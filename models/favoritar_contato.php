<?php

include '../database/conexao.php';

$id = json_decode(file_get_contents('php://input'), true);

if($id !=''){
    $sql = "UPDATE contatos SET favorito = '1' WHERE id = :id";

    $sql_preparado = $conn->prepare($sql);
    $sql_preparado->bindValue(':id', $id);
    //No bindParam() o argumento esperado é uma referência (variável ou constante)
    // e não pode ser um tipo primitivo como uma string ou número solto, retorno de função/método. Já bindValue() pode receber referências e valores como argumento.
    $sql_preparado->execute();
    echo json_encode(array('status' => true));
}else{
    echo json_encode(array('status' => false));
}

?>