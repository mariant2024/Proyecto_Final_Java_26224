
package com.techlab.tienda.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.techlab.tienda.model.Categoria;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
}
