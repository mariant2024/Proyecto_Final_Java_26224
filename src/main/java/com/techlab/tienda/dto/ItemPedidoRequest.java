package com.techlab.tienda.dto;

public class ItemPedidoRequest {

    private int productoId;
    private int cantidad;

    // Constructor vacío y setters: los necesita Jackson para convertir el JSON
    public ItemPedidoRequest() {
    }

    public int getProductoId() {
        return productoId;
    }

    public void setProductoId(int productoId) {
        this.productoId = productoId;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}