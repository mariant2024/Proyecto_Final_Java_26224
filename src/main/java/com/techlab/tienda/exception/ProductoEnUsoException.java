package com.techlab.tienda.exception;

public class ProductoEnUsoException extends RuntimeException {

    public ProductoEnUsoException(String mensaje) {
        super(mensaje);
    }
}