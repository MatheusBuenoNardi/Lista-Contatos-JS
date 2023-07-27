<?php

include '../database/conexao.php';

$pessoa = json_decode(file_get_contents('php://input'), true);

$nome = $pessoa['nome'];
$sobrenome = $pessoa['sobrenome'];
$numero = $pessoa['telefone'];
$id = $pessoa['id'];

if ($nome != '' && $sobrenome != '' && $numero != '' && $id !='') {
    $sql = "UPDATE contatos SET nome = :nome, sobrenome = :sobrenome, numero = :numero WHERE id = :id" ;

    $sql_preparado = $conn->prepare($sql);
    $sql_preparado->bindValue(':nome', $nome);
    $sql_preparado->bindValue(':sobrenome', $sobrenome);
    $sql_preparado->bindValue(':numero', $numero);
    $sql_preparado->bindValue(':id', $id);
    //No bindParam() o argumento esperado é uma referência (variável ou constante)
    // e não pode ser um tipo primitivo como uma string ou número solto, retorno de função/método. Já bindValue() pode receber referências e valores como argumento.
    $sql_preparado->execute();

    if ($sql_preparado->rowCount() > 0) {
        echo json_encode(array('status' => true));
    } else {
        echo json_encode(array('status' => false));
    }
} else {
    echo json_encode(array('status' => false));
}
?>