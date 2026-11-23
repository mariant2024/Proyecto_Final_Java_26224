package com.techlab.tienda.controller;

import java.util.List;

import com.techlab.tienda.dto.ProductoConCategoria;
import com.techlab.tienda.model.Producto;
import com.techlab.tienda.service.ProductoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController 
@RequestMapping ("/productos")
public class ProductoController {
    

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping 
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping ("/{id}")
    public ResponseEntity<Producto> obtenerProducto(@PathVariable int id) {
        return ResponseEntity.ok(productoService.obtenerPorId(id));
    }

    @PostMapping 
    public ResponseEntity<Producto> agregarProducto(@RequestBody Producto producto) {
        Producto nuevo= productoService.guardar(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@RequestBody Producto producto, @PathVariable int id) {
        return ResponseEntity.ok(productoService.actualizar(id,producto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable int id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> buscarPorCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.listarPorCategoria(categoria);
        return ResponseEntity.ok(productos);
    }

    @GetMapping(params = "nombre")
    public ResponseEntity<List<Producto>> buscarPorNombre(@RequestParam String nombre) {
    return ResponseEntity.ok(productoService.buscarPorNombre(nombre));
    }


    @GetMapping("/con-categoria")
    public ResponseEntity<List<ProductoConCategoria>> listarConCategoria() {
    return ResponseEntity.ok(productoService.listarConCategoria());
    }
    
}