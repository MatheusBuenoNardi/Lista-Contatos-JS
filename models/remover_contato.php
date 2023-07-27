<?php

include '../database/conexao.php';

$pessoa = json_decode(file_get_contents('php://input'), true);

$id = $pessoa['id'];

if($id !=''){
    $sql = "DELETE FROM contatos WHERE id = :id";

    $sql_preparado = $conn->prepare($sql);
    $sql_preparado->bindParam(':id', $id);//No bindParam() o argumento esperado é uma referência (variável ou constante)
    // e não pode ser um tipo primitivo como uma string ou número solto, retorno de função/método. Já bindValue() pode receber referências e valores como argumento.
    
    $sql_preparado->execute();
    echo json_encode(array('status' => true));
}else{
    // terá que me retornar um erro
    echo json_encode(array('status' => false));
}
?>