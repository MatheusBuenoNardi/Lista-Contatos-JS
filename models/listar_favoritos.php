<?php
include '../database/conexao.php';

$favorito = json_decode(file_get_contents('php://input'), true);

$sql = "SELECT * FROM contatos WHERE favorito = '1'";

$sql_preparado = $conn->prepare($sql);
$sql_preparado->execute();

$contatos = $sql_preparado->fetchAll(PDO::FETCH_ASSOC);//retorna um array indexado pelo nome da coluna conforme retornado em seu conjunto de resultados
echo json_encode($contatos);
?>

