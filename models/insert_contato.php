<?php

include '../database/conexao.php';

// pega os dados enviados da funcção em javascript
$pessoa = json_decode(file_get_contents('php://input'), true);

$nome = $pessoa['nome'];
$sobrenome = $pessoa['sobrenome'];
$numero = $pessoa['telefone'];

if($nome != '' && $sobrenome != '' && $numero != ''){
    $sql = "INSERT INTO contatos(nome, sobrenome, numero) VALUES(:nome, :sobrenome, :numero)";
 
    $sql_preparado = $conn->prepare($sql);
    $sql_preparado->bindParam(':nome', $nome);
    $sql_preparado->bindParam(':sobrenome', $sobrenome);
    $sql_preparado->bindParam(':numero', $numero);
    //No bindParam() o argumento esperado é uma referência (variável ou constante)
    // e não pode ser um tipo primitivo como uma string ou número solto, retorno de função/método. Já bindValue() pode receber referências e valores como argumento.
    
    $sql_preparado->execute();

    echo json_encode(array('status' => true, 'id_inserido' => $conn->lastInsertId()));
}else{
    // terá que me retornar um erro
    echo json_encode(array('status' => false));
}
?>

