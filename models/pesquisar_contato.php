<?php

include '../database/conexao.php';

$nome = json_decode(file_get_contents('php://input'));

$sql = "SELECT * FROM contatos WHERE nome LIKE ?";

$sql_preparado = $conn->prepare($sql);
$sql_preparado->execute(array("%$nome%"));

// Aqui pegamos os dados que vieram, do banco, e transformamos ele em uma array com chave e valor
// chave = nome_do_campo, valor = valor_que_tem_no_campo
$contatos = $sql_preparado->fetchAll(PDO::FETCH_ASSOC); // retorna um array indexado pelo nome da coluna conforme retornado em seu conjunto de resultados


// transformamos o array em formato JSON que é o "retorno" da função pesquisarContato
echo json_encode($contatos);
// tipo do "retorno" {id: "6", nome: "Mateus", sobrenome: "Nobrega", numero: "49999999999", favorito: null}
