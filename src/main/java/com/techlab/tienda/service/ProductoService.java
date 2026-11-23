package com.techlab.tienda.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

import com.techlab.tienda.dto.ProductoConCategoria;
import com.techlab.tienda.exception.ProductoDuplicadoException;
import com.techlab.tienda.exception.ProductoEnUsoException;
import com.techlab.tienda.exception.ProductoNoEncontradoException;
import com.techlab.tienda.model.Categoria;
import com.techlab.tienda.model.Producto;
import com.techlab.tienda.repository.CategoriaRepository;
import com.techlab.tienda.repository.LineaPedidoRepository;
import com.techlab.tienda.repository.ProductoRepository;
import com.techlab.tienda.util.Validador;


@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final LineaPedidoRepository lineaPedidoRepository;

    public ProductoService(ProductoRepository repository, CategoriaRepository categoriaRepository,
                           LineaPedidoRepository lineaPedidoRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.lineaPedidoRepository = lineaPedidoRepository;
    }

    // GET /productos
    public List<Producto> listarTodos() {
        return repository.findAll();
    }

    // GET /productos/{id}
    public Producto obtenerPorId(int id) {
        Optional<Producto> resultado = repository.findById(id);
        if (resultado.isEmpty()) {
            throw new ProductoNoEncontradoException("No se encontro un producto con el id " + id);
        }
        return resultado.get();
    }

    // POST /productos
    // La regla de nombre repetido se vuelve a agregar en el paso 18.
    public Producto guardar(Producto p) {
        Validador.validarNombre(p.getNombre());
        //validarNombreUnico(p.getNombre());
        Validador.validarPrecio(p.getPrecio());
        Validador.validarStock(p.getStock());

            // Regla de negocio: no puede haber dos productos con el mismo nombre (409)
        if (repository.existsByNombreIgnoreCase(p.getNombre())) {
          throw new ProductoDuplicadoException("Ya existe un producto con el nombre " + p.getNombre());
        }

        // El id lo asigna la base: se ignora el que envíe el cliente.
        // Con id 0, save() hace un INSERT.
        p.setId(0);
        p.setCategoria(obtenerCategoria(p));
        return repository.save(p);
    }

    // PUT /productos/{id}
    public Producto actualizar(int id, Producto datos) {
        // Si el id no existe, obtenerPorId lanza la excepción y no se modifica nada
        Producto p = obtenerPorId(id);

        Validador.validarNombre(datos.getNombre());
        Validador.validarPrecio(datos.getPrecio());
        Validador.validarStock(datos.getStock());

            // El nombre puede repetirse solo si es el del mismo producto
        if (repository.existsByNombreIgnoreCaseAndIdNot(datos.getNombre(), id)) {
            throw new ProductoDuplicadoException("Ya existe un producto con el nombre " + datos.getNombre());
        }

        p.setNombre(datos.getNombre());
        p.setPrecio(datos.getPrecio());
        p.setStock(datos.getStock());
        p.setCategoria(obtenerCategoria(datos));

        // Como p ya tiene un id existente, save() hace un UPDATE
        return repository.save(p);
    }

    // DELETE /productos/{id}
    public void eliminar(int id) {
        // Primero se busca, así un id inexistente responde 404
        Producto p = obtenerPorId(id);

        // Un producto que figura en un pedido no se puede borrar:
    // los pedidos perderían el detalle de lo que se compró (409)
    if (lineaPedidoRepository.existsByProductoId(id)) {
        throw new ProductoEnUsoException(
                "No se puede eliminar el producto " + id + " porque figura en pedidos.");
    }
    
        repository.delete(p);
    }

    // GET /productos/categoria/{categoria}
    // Versión temporal: recorre los productos de la base.
    // En el paso 16 se reemplaza por una consulta que filtra en la base.
    public List<Producto> listarPorCategoria(String categoria) {
        return repository.findByCategoriaNombre(categoria);
    }

    // Comprueba que la categoría enviada exista en la base y la devuelve completa
    private Categoria obtenerCategoria(Producto p) {
        if (p.getCategoria() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria.");
        }
        int idCategoria = p.getCategoria().getId();
        Optional<Categoria> resultado = categoriaRepository.findById(idCategoria);
        if (resultado.isEmpty()) {
            throw new IllegalArgumentException("No existe la categoría con id " + idCategoria);
        }
        return resultado.get();
    }

    public List<Producto> buscarPorNombre(String texto) {
    return repository.findByNombreContainingIgnoreCase(texto);
    }

    public List<ProductoConCategoria> listarConCategoria() {
    return repository.listarConCategoria();
    }

    // Lanza ProductoDuplicadoException si ya existe un producto con ese nombre
    /*private void validarNombreUnico(String nombre) {
    if (repository.existsByNombreIgnoreCase(nombre)) {
        throw new ProductoDuplicadoException("Ya existe un producto con el nombre: " + nombre);
    }*/

    public void descontarStock(Producto p, int cantidad) {
        p.setStock(p.getStock() - cantidad);
        repository.save(p);
    }   
   
}