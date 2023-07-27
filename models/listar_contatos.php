<?php

include '../database/conexao.php';

$sql = "SELECT * FROM contatos";

$sql_preparado = $conn->prepare($sql);
$sql_preparado->execute();
$contatos = $sql_preparado->fetchAll(PDO::FETCH_ASSOC);//retorna um array indexado pelo nome da coluna conforme retornado em seu conjunto de resultados
echo json_encode($contatos);
?>