<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $colors = $_POST["colors"];
    $mixedColor = $_POST["resultColor"];

    saveToTextFile($colors, $mixedColor);

    echo "Registros salvos com sucesso!";
}

function saveToTextFile($colors, $mixedColor) {
    $timestamp = date("Y-m-d H:i:s");
    $logMessage = "Data: $timestamp | Cores Selecionadas: $colors | Cor Misturada: $mixedColor" . PHP_EOL;
    $logFile = "registros.txt";

    file_put_contents($logFile, $logMessage, FILE_APPEND);
}
