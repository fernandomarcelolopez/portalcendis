<?php
$token=$_GET['tkn'];
$ip=$_SERVER['REMOTE_ADDR'];
//incorporo la conexion a la base de datos
require('conn.php');

//realizo consulta con los parametros
$consulta = "SELECT * FROM control WHERE token = '". $token."' and ip = '". $ip."' and estado = 1";
$resultado = mysqli_query($iden,$consulta);
$datos = mysqli_fetch_assoc($resultado);
if($datos)
{
    $id = $datos['Id'];
    $fin= date("Y-m-d H:i:s");
    $registro = "UPDATE control SET fin = '". $fin."', estado = 0 WHERE Id='". $id."'";
    $grabado = mysqli_query($iden,$registro);
}
if($grabado)
{
    $respuesta = array("respcode"=>"200");
    $resp=json_encode($respuesta);
    echo $resp;
}
?>