<?php
date_default_timezone_set('America/Argentina/Salta');
//obtengo los parametros del login
$token=$_GET['tkn'];
$ip=$_SERVER['REMOTE_ADDR'];
//incorporo la conexion a la base de datos
require('conn.php');

//realizo consulta con los parametros
$consulta = "SELECT * FROM control WHERE token = '". $token."' and ip = '". $ip."' and estado = 1";
$resultado = mysqli_query($iden,$consulta);
$datos = mysqli_fetch_assoc($resultado);
if(!$datos)
{
    $respuesta = array("respcode"=>"201");
    $resp=json_encode($respuesta);
    echo $resp;
}
else
{
    $respuesta = array("respcode"=>"200");
    $resp=json_encode($respuesta);
    echo $resp;
}
?>

