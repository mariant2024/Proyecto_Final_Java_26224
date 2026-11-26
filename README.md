# Tienda

Aplicación de gestión de productos, categorías y pedidos. El backend está desarrollado con Spring Boot y expone una API REST; el frontend está en `front/`.

## Requisitos

- JDK 25.
- MySQL en ejecución.
- La base de datos `tienda` y un esquema compatible con las entidades del proyecto.
- Navegador web para usar el frontend.

La conexión predeterminada está configurada en `src/main/resources/application.properties`:

| Propiedad | Valor predeterminado |
| --- | --- |
| Puerto de la API | `8081` |
| URL de MySQL | `jdbc:mysql://localhost:3306/tienda` |
| Usuario | `root` |
| Contraseña | Vacía |

Ajusta esas propiedades si tu instalación de MySQL usa otros valores. El proyecto no incluye migraciones ni datos iniciales: prepara las tablas y carga las categorías antes de usar la interfaz. La API ofrece consulta de categorías, pero no un endpoint para crearlas.

## Ejecutar

Desde la raíz del proyecto, inicia el backend:

```bash
./mvnw spring-boot:run
```

En Windows:

```bat
mvnw.cmd spring-boot:run
```

La API estará disponible en `http://localhost:8081`. Para ejecutar las pruebas:

```bash
./mvnw test
```

Para usar la interfaz, sirve la carpeta `front/` con una extensión o servidor estático en el puerto `5500` y abre `http://127.0.0.1:5500` o `http://localhost:5500`. Por ejemplo, con la extensión Live Server de VS Code, abre `front/index.html` y selecciona **Open with Live Server**. Esos dos orígenes están permitidos por la configuración CORS del backend.

## API REST

Todas las rutas usan el prefijo `http://localhost:8081`. Los cuerpos y respuestas usan JSON, salvo las respuestas sin contenido y los mensajes de error de texto.

### Productos

| Método | Ruta | Descripción | Respuesta habitual |
| --- | --- | --- | --- |
| `GET` | `/productos` | Lista todos los productos. | `200 OK` |
| `GET` | `/productos/{id}` | Obtiene un producto por ID. | `200 OK`; `404` si no existe |
| `POST` | `/productos` | Crea un producto. | `201 Created` |
| `PUT` | `/productos/{id}` | Actualiza un producto. | `200 OK` |
| `DELETE` | `/productos/{id}` | Elimina un producto. | `204 No Content`; `409` si está en uso |
| `GET` | `/productos/categoria/{categoria}` | Lista productos por nombre de categoría. | `200 OK` |
| `GET` | `/productos?nombre={nombre}` | Busca productos por nombre. | `200 OK` |
| `GET` | `/productos/con-categoria` | Lista productos con información de categoría. | `200 OK` |

Ejemplo de cuerpo para crear o actualizar un producto:

```json
{
  "nombre": "Teclado",
  "precio": 29.99,
  "stock": 12,
  "categoria": {
    "id": 1
  }
}
```

La categoría indicada debe existir.

### Categorías

| Método | Ruta | Descripción | Respuesta habitual |
| --- | --- | --- | --- |
| `GET` | `/categorias` | Lista las categorías disponibles. | `200 OK` |

### Pedidos

| Método | Ruta | Descripción | Respuesta habitual |
| --- | --- | --- | --- |
| `POST` | `/pedidos` | Crea un pedido con sus productos y cantidades. | `201 Created`; `400` si no hay stock suficiente |
| `GET` | `/pedidos` | Lista los pedidos realizados. | `200 OK` |
| `GET` | `/pedidos/{id}` | Obtiene un pedido por ID. | `200 OK`; `404` si no existe |

Ejemplo de cuerpo para crear un pedido:

```json
{
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    },
    {
      "productoId": 3,
      "cantidad": 1
    }
  ]
}
```

Los errores de negocio pueden responder `400 Bad Request`, `404 Not Found` o `409 Conflict`, según el caso; el cuerpo contiene el mensaje del error.