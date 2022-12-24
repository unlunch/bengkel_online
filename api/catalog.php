<?php

include('../controller/catalog.controller.php');

$json = file_get_contents('php://input');
$data = json_decode($json);

$catalog = new CatalogController();
$function = $_GET['f'];

try {
    $catalog->$function($data);
} catch (\Throwable $th) {
    throw $th;
}