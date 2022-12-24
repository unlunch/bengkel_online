<?php

include('../connection.php');

class CatalogModel extends Connection
{
    public function catalogSearch($data)
    {
        $sql = "SELECT * FROM product";
        // if ($data->search->name && $data->search->type) {
        //     $sql .= " WHERE name LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        // } elseif ($data->search->name) {
        //     $sql .= " WHERE name LIKE '%{$data->search->name}%'";
        // } elseif ($data->search->type) {
        //     $sql .= " WHERE type = '{$data->search->type}'";
        // }
        // $sql .= " LIMIT {$data->limit} OFFSET {$data->start}";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $catalog[] = $data;
            }
            return $catalog;
        }
        return [];
    }

    public function catalogAllDAta($data)
    {
        $sql = "SELECT * FROM catalogs";
        if ($data->search->name && $data->search->type) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        } elseif ($data->search->name) {
            $sql .= " WHERE name LIKE '%{$data->search->name}%'";
        } elseif ($data->search->type) {
            $sql .= " WHERE type = '{$data->search->type}'";
        }
        $result = $this->connect()->query($sql);
        return $result->num_rows;
    }
}