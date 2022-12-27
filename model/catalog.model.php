<?php

include('../connection.php');

class CatalogModel extends Connection
{
    public function catalogSearch($data)
    {
        $sql = "SELECT * FROM product";
        if ($data->search->name && $data->search->type) {
            $sql .= " WHERE nama LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        } elseif ($data->search->name) {
            $sql .= " WHERE nama LIKE '%{$data->search->name}%'";
        } elseif ($data->search->type) {
            $sql .= " WHERE type = '{$data->search->type}'";
        }
        $sql .= " LIMIT {$data->limit} OFFSET {$data->start}";
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
        $sql = "SELECT * FROM product";
        if ($data->search->name && $data->search->type) {
            $sql .= " WHERE nama LIKE '%{$data->search->name}%' AND type = '{$data->search->type}'";
        } elseif ($data->search->name) {
            $sql .= " WHERE nama LIKE '%{$data->search->name}%'";
        } elseif ($data->search->type) {
            $sql .= " WHERE type = '{$data->search->type}'";
        }
        $result = $this->connect()->query($sql);
        return $result->num_rows;
    }

    public function createCatalog($data)
    {
        $qname  = "nama  = '$data->name',";
        $qprice = "harga = '$data->price',";
        $qtype  = "type  = '$data->type',";
        $qimg   = "image   = '$data->img'";
        $sql    = "INSERT INTO product SET $qname $qprice $qtype $qimg";
        $result = $this->connect()->query($sql);
        return $result;
    }

    public function getCatalog($id)
    {
        $sql    = "SELECT * FROM product WHERE id = $id";
        $result = $this->connect()->query($sql);
        if ($result->num_rows > 0) {
            while ($data = mysqli_fetch_assoc($result)) {
                $catalog = $data;
            }
            return $catalog;
        }
        return null;
    }

    public function editCatalog($data)
    {
        $qid    = "id      = '$data->id'";
        $qname  = "nama    = '$data->name'";
        $qprice = ", harga = '$data->price'";
        $qtype  = ", type  = '$data->type'";
        $qimg   = $data->img ? ", img   = '$data->img'" : "";
        $sql    = "UPDATE product SET $qname $qprice $qtype $qimg WHERE $qid";
        $result = $this->connect()->query($sql);
        return $result;
    }

    public function deleteCatalog($id)
    {
        $sql    = "DELETE FROM product WHERE id = '$id'";
        $result = $this->connect()->query($sql);
        return $result;
    }
}