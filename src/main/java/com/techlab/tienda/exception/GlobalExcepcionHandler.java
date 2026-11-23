package com.techlab.tienda.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExcepcionHandler {
    

    @ExceptionHandler(ProductoNoEncontradoException.class) 
    public ResponseEntity<String> manejarProductoNoEncontradoException(ProductoNoEncontradoException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(StockInsuficienteException.class)
    public ResponseEntity<String> manejarStockInsuficienteException(StockInsuficienteException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    @ExceptionHandler (ProductoDuplicadoException.class)
    public ResponseEntity<String> manejarProductoDuplicadoException(ProductoDuplicadoException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(PedidoNoEncontradoException.class)
    public ResponseEntity<String> manejarPedidoNoEncontrado(PedidoNoEncontradoException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());     // 404
    }   


    @ExceptionHandler(ProductoEnUsoException.class)
    public ResponseEntity<String> manejarProductoEnUso(ProductoEnUsoException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());      // 409
    }
}
