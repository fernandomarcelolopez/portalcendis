<?php
$token  = $_GET['tkn'] ?? null;
$inicio = $_GET['finicio'] ?? null;
$final  = $_GET['ffinal'] ?? null;

error_reporting(E_ALL);
ini_set('display_errors', 0);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'config.php';

function call_odoo($method, $model, $domain, $fields) {
    global $url, $db, $uid, $api_key;
    $params = [
        "jsonrpc" => "2.0",
        "method"  => "call",
        "params"  => [
            "service" => "object",
            "method"  => "execute_kw",
            "args"    => [
                $db, (int)$uid, $api_key,
                $model, $method,
                [$domain],
                ['fields' => $fields, 'limit' => 50000]
            ]
        ],
        "id" => rand(1, 1000)
    ];
   
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);

    return json_decode($response, true)['result'] ?? [];
}

// 1. Obtener las operaciones
$operaciones = call_odoo(
    'search_read',
    'x_operaciones_agrupada',
    [
        ['x_fecha', '>=', $inicio], 
        ['x_fecha', '<=', $final], 
        ['x_tipo_agrupados', '=', 'Recepcion'], 
        ['x_studio_stage_id', '=', 'Finalizado']
    ],
    ['x_studio_propietarios', 'x_studio_servicios_op_agrupada']
);

// 2. PROCESAR PROPIETARIOS (IDs -> Nombres)
$propietarios_ids = [];
foreach ($operaciones as $op) {
    if (!empty($op['x_studio_propietarios']) && is_array($op['x_studio_propietarios'])) {
        $propietarios_ids = array_merge($propietarios_ids, $op['x_studio_propietarios']);
    }
}
$propietarios_ids = array_unique($propietarios_ids);

$mapa_propietarios = [];
if (!empty($propietarios_ids)) {
    $propietarios_data = call_odoo(
        'search_read',
        'res.partner',
        [['id', 'in', array_values($propietarios_ids)]],
        ['id', 'display_name']
    );

    foreach ($propietarios_data as $prop) {
        $mapa_propietarios[$prop['id']] = $prop['display_name'];
    }
}

// 3. PROCESAR SERVICIOS (IDs de líneas -> Detalle)
$lineas_ids = [];
foreach ($operaciones as $op) {
    if (!empty($op['x_studio_servicios_op_agrupada']) && is_array($op['x_studio_servicios_op_agrupada'])) {
        $lineas_ids = array_merge($lineas_ids, $op['x_studio_servicios_op_agrupada']);
    }
}
$lineas_ids = array_unique($lineas_ids);

$mapa_lineas = [];
if (!empty($lineas_ids)) {
    $lineas_data = call_odoo(
        'search_read',
        'x_op_agrupadas_servicios_line',
        [['id', 'in', array_values($lineas_ids)]],
        ['id', 'x_studio_servicio', 'x_studio_cantidad']
    );

    foreach ($lineas_data as $linea) {
        $servicio_nombre = is_array($linea['x_studio_servicio']) ? $linea['x_studio_servicio'][1] : 'Sin Servicio';

        $mapa_lineas[$linea['id']] = [
            'servicio' => $servicio_nombre,
            'cantidad' => (float)($linea['x_studio_cantidad'] ?? 0)
        ];
    }
}

// 4. MAPEAR DATOS Y AGRUPAR TOTALES POR PROPIETARIO Y SERVICIO
$agrupado = [];

foreach ($operaciones as &$op) {
    // Resolver Propietarios
    $propietarios_nombres = [];
    if (!empty($op['x_studio_propietarios']) && is_array($op['x_studio_propietarios'])) {
        foreach ($op['x_studio_propietarios'] as $prop_id) {
            if (isset($mapa_propietarios[$prop_id])) {
                $propietarios_nombres[] = $mapa_propietarios[$prop_id];
            }
        }
    }
    if (empty($propietarios_nombres)) {
        $propietarios_nombres = ['Sin Propietario'];
    }

    // Resolver Servicios de la Operación
    $servicios_detalle = [];
    if (!empty($op['x_studio_servicios_op_agrupada']) && is_array($op['x_studio_servicios_op_agrupada'])) {
        foreach ($op['x_studio_servicios_op_agrupada'] as $linea_id) {
            if (isset($mapa_lineas[$linea_id])) {
                $servicios_detalle[] = $mapa_lineas[$linea_id];
            }
        }
    }

    $op['x_studio_propietarios'] = $propietarios_nombres;
    $op['x_studio_servicios_op_agrupada'] = $servicios_detalle;

    // Agrupar cantidades por cada Propietario de la operación
    foreach ($propietarios_nombres as $prop_nombre) {
        if (!isset($agrupado[$prop_nombre])) {
            $agrupado[$prop_nombre] = [];
        }

        foreach ($servicios_detalle as $srv) {
            $nombre_servicio = $srv['servicio'];
            $cantidad = $srv['cantidad'];

            if (!isset($agrupado[$prop_nombre][$nombre_servicio])) {
                $agrupado[$prop_nombre][$nombre_servicio] = 0;
            }

            $agrupado[$prop_nombre][$nombre_servicio] += $cantidad;
        }
    }
}
unset($op);

// 5. ESTRUCTURAR EL RESUMEN FINAL
$resumen_propietarios = [];

foreach ($agrupado as $propietario => $servicios) {
    $lista_servicios = [];
    foreach ($servicios as $servicio_nombre => $total_cantidad) {
        $lista_servicios[] = [
            'servicio' => $servicio_nombre,
            'total_cantidad' => $total_cantidad
        ];
    }

    $resumen_propietarios[] = [
        'propietario' => $propietario,
        'servicios' => $lista_servicios
    ];
}

// Devuelve las operaciones detalladas y el nuevo JSON procesado/resumido
echo json_encode([
    'status' => 200,
    'resumen_propietarios' => $resumen_propietarios,
    //'operaciones' => $operaciones
], JSON_UNESCAPED_UNICODE);
exit;
?>