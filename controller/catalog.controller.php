<?php

include('../model/catalog.model.php');

class CatalogController extends CatalogModel
{
    public function search($data)
    {
        echo json_encode([
            'data' => $this->catalogSearch($data),
            'status' => true,
            'result' => true,
            // 'all_data' => $this->catalogAllDAta($data)
        ]);
    }
}