<?php

// Credenciales de la base de datos
define('DB_USUARIO', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost');
define('DB_NOMBRE', 'agendaphp');
define('DB_PORT', '8889');

$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE, DB_PORT);
//echo $conn->ping();

?>