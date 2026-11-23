package com.techlab.tienda.dto;

import java.util.List;

public class PedidoRequest {

    private List<ItemPedidoRequest> items;

    public PedidoRequest() {
    }

    public List<ItemPedidoRequest> getItems() {
        return items;
    }

    public void setItems(List<ItemPedidoRequest> items) {
        this.items = items;
    }
}