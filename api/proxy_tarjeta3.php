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
// 1. Obtener Stock Actual (Quants)
$operaciones = call_odoo(
    'search_read', 
    'x_operaciones_agrupada', 
    [['x_fecha', '>=', $inicio], ['x_fecha', '<=', $final], ['x_tipo_agrupados', '=', 'Recepcion'], ['x_studio_stage_id', '=', 'Finalizado']], 
    ['x_studio_propietarios', 'x_studio_cant_palletsemipallet_recibidos','x_studio_cant_combis_recibidas' ]
);
echo json_encode([
    'status'=> 200,
    'operaciones' => $operaciones,
]);
exit;