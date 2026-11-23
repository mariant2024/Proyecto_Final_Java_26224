package com.techlab.tienda.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.techlab.tienda.model.Categoria;
import com.techlab.tienda.repository.CategoriaRepository;

@Service
public class CategoriaService {

    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }

    // GET /categorias
    public List<Categoria> listarTodas() {
        return repository.findAll();
    }
}
