<?php
date_default_timezone_set('America/Argentina/Salta');
//obtengo los parametros del login
$nombre=$_GET['username'];
$clave=$_GET['password'];
$clave1 = md5($clave);

//incorporo la conexion a la base de datos
require('conn.php');

//realizo consulta con los parametros
$consulta = "SELECT * FROM personas WHERE usuario = '". $nombre."'";
$resultado = mysqli_query($iden,$consulta);
$datos = mysqli_fetch_assoc($resultado);
if(!$datos)
{
    $respuesta = array("respcode"=>"400", "razon"=>"usuario inexistente");
    $resp=json_encode($respuesta);
    echo $resp;
}
else
{
    IF($datos['clave'] == $clave1 && $datos['estado'] == 1)
        {
            //crear token de conexion
            $inicio= date("Y-m-d H:i:s");
            $tokena=$datos['Id'];
            $ip = $_SERVER['REMOTE_ADDR'];
            $token=md5($tokena.$nombre.$clave);
            //$minuto=intval(date("i")) + 3;
            //$final= date("Y")."-".date("m")."-".date("d")." ".date("H").":".$minuto.":".date("s");
            $sentencia = "INSERT INTO control (token, ip, idpersona, inicio, estado) VALUES ('".$token."', '".$ip."', '".$tokena."', '".$inicio."', 1)";
            $consu1 = mysqli_query($iden,$sentencia);
            
            $respuesta = array("respcode"=>"200", "conexion"=>$token, "username"=> $nombre , "password"=>$clave);
            $resp=json_encode($respuesta);
            echo $resp;
        }
    else {
        $respuesta = array("respcode"=>"401", "razon"=>"password incorrecta");
        $resp=json_encode($respuesta);
        echo $resp;
        }
}
?>

