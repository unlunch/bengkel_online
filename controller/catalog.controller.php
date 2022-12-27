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
            'all_data' => $this->catalogAllDAta($data)
        ]);
    }

    public function create($data)
    {
        $collectData = [];
        foreach ($data as $object) {
            $collectData[$object->name] = $object->value;
        }
        echo json_encode([
            'data' => $this->createCatalog((object)$collectData),
            'status' => true,
            'result' => true,
        ]);
    }

    public function edit($id)
    {
        echo json_encode([
            'data' => $this->getCatalog($id)
        ]);
    }

    public function update($data)
    {
        echo json_encode([
            'data' => $this->editCatalog($data),
            'status' => true,
        ]);
    }

    public function delete($id)
    {
        echo json_encode([
            'data' => $this->deleteCatalog($id),
            'status' => true,
        ]);
    }
}