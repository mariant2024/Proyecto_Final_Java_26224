// Direcciones de la API
const URL_API = "http://localhost:8081/productos";
const URL_CATEGORIAS = "http://localhost:8081/categorias";
const URL_PEDIDOS = "http://localhost:8081/pedidos";

// Elementos de la página
const lista = document.getElementById("lista");
const mensaje = document.getElementById("mensaje");
const formulario = document.getElementById("formulario");
const tituloFormulario = document.getElementById("titulo-formulario");
const botonCancelar = document.getElementById("btn-cancelar");
const filtroCategoria = document.getElementById("filtro-categoria");
const campoId = document.getElementById("id");
const campoNombre = document.getElementById("nombre");
const campoPrecio = document.getElementById("precio");
const campoStock = document.getElementById("stock");
const campoCategoria = document.getElementById("categoria");

// Elementos de la sección de pedidos
const formularioPedido = document.getElementById("formulario-pedido");
const selectPedidoProducto = document.getElementById("pedido-producto");
const campoPedidoCantidad = document.getElementById("pedido-cantidad");
const contenedorItems = document.getElementById("pedido-items");
const botonConfirmar = document.getElementById("btn-confirmar");
const botonVaciar = document.getElementById("btn-vaciar");
const listaPedidos = document.getElementById("lista-pedidos");

// Productos que trajo la API (se usan para completar el formulario al editar)
let productos = [];

// Todos los productos, sin el filtro por categoría (para el selector del pedido)
let todosLosProductos = [];

// Productos que se van agregando al pedido antes de confirmarlo.
// Cada elemento tiene la forma { producto: {...}, cantidad: 2 }
let itemsPedido = [];

// ---------------------------------------------------------------
// Mensajes en pantalla
// ---------------------------------------------------------------
function mostrarMensaje(texto, esError) {
  mensaje.textContent = texto;
  mensaje.className = esError ? "mensaje error" : "mensaje exito";
  mensaje.hidden = false;
  setTimeout(() => mensaje.hidden = true, 4000);
}

// fetch NO considera error un 400 o un 404: la promesa se cumple igual.
// Por eso se revisa response.ok. La API responde los errores como texto,
// así que se leen con response.text() y se lanzan para que los tome catch.
function leerRespuesta(response) {
  if (!response.ok) {
    return response.text().then(texto => {
      throw new Error(texto);
    });
  }
  return response;
}

// ---------------------------------------------------------------
// GET categorías: completa el formulario y el filtro
// ---------------------------------------------------------------
function cargarCategorias() {
  fetch(URL_CATEGORIAS)
    .then(leerRespuesta)
    .then(response => response.json())
    .then(categorias => {
      let opcionesFormulario = `<option value="">Seleccione una categoría</option>`;
      let opcionesFiltro = `<option value="">Todas</option>`;

      categorias.forEach(c => {
        opcionesFormulario += `<option value="${c.id}">${c.nombre}</option>`;
        opcionesFiltro += `<option value="${c.nombre}">${c.nombre}</option>`;
      });

      campoCategoria.innerHTML = opcionesFormulario;
      filtroCategoria.innerHTML = opcionesFiltro;
    })
    .catch(error => mostrarMensaje(error.message, true));
}

// ---------------------------------------------------------------
// GET productos: todos, o los de la categoría elegida en el filtro
// ---------------------------------------------------------------
function cargarProductos() {
  let url = URL_API;

  if (filtroCategoria.value !== "") {
    // encodeURIComponent convierte espacios y tildes para que viajen bien en la URL
    url = URL_API + "/categoria/" + encodeURIComponent(filtroCategoria.value);
  }

  fetch(url)
    .then(leerRespuesta)
    .then(response => response.json())
    .then(datos => {
      productos = datos;
      mostrarProductos();
      cargarSelectorPedido();
    })
    .catch(error => mostrarMensaje(error.message, true));
}

function mostrarProductos() {
  if (productos.length === 0) {
    lista.innerHTML = "<p>No hay productos para mostrar.</p>";
    return;
  }

  let html = "";

  productos.forEach(p => {
    html += `
      <article class="tarjeta">
        <h3>${p.nombre}</h3>
        <p class="categoria">${p.categoria.nombre}</p>
        <p class="precio">$ ${p.precio}</p>
        <p>Stock: ${p.stock}</p>
        <div class="acciones">
          <button onclick="editarProducto(${p.id})">Editar</button>
          <button class="peligro" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </div>
      </article>
    `;
  });

  lista.innerHTML = html;
}

filtroCategoria.addEventListener("change", cargarProductos);

// ---------------------------------------------------------------
// POST y PUT: crear o actualizar (según el formulario tenga un id o no)
// ---------------------------------------------------------------
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  // La categoría se envía como objeto: la API espera { "id": ... }
  const producto = {
    nombre: campoNombre.value,
    precio: Number(campoPrecio.value),
    stock: Number(campoStock.value),
    categoria: { id: Number(campoCategoria.value) }
  };

  let url = URL_API;
  let metodo = "POST";

  if (campoId.value !== "") {
    url = URL_API + "/" + campoId.value;
    metodo = "PUT";
  }

  fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(producto)
  })
    .then(leerRespuesta)
    .then(() => {
      mostrarMensaje("Producto guardado.", false);
      limpiarFormulario();
      cargarProductos();
    })
    .catch(error => mostrarMensaje(error.message, true));
});

// ---------------------------------------------------------------
// DELETE: eliminar producto
// La API responde 204 (sin cuerpo): no se llama a response.json().
// Si el producto figura en un pedido, responde 409 y el mensaje se muestra igual.
// ---------------------------------------------------------------
function eliminarProducto(id) {
  if (!confirm("¿Eliminar el producto " + id + "?")) {
    return;
  }

  fetch(URL_API + "/" + id, { method: "DELETE" })
    .then(leerRespuesta)
    .then(() => {
      mostrarMensaje("Producto eliminado.", false);
      cargarProductos();
    })
    .catch(error => mostrarMensaje(error.message, true));
}

// ---------------------------------------------------------------
// Editar: pasa los datos del producto al formulario
// ---------------------------------------------------------------
function editarProducto(id) {
  const p = productos.find(producto => producto.id === id);

  campoId.value = p.id;
  campoNombre.value = p.nombre;
  campoPrecio.value = p.precio;
  campoStock.value = p.stock;
  campoCategoria.value = p.categoria.id;

  tituloFormulario.textContent = "Editando producto " + p.id;
  botonCancelar.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function limpiarFormulario() {
  formulario.reset();
  campoId.value = "";
  tituloFormulario.textContent = "Nuevo producto";
  botonCancelar.hidden = true;
}

botonCancelar.addEventListener("click", limpiarFormulario);

// ---------------------------------------------------------------
// PEDIDOS
// ---------------------------------------------------------------

// GET productos (todos): completa el selector del pedido con nombre y stock
function cargarSelectorPedido() {
  fetch(URL_API)
    .then(leerRespuesta)
    .then(response => response.json())
    .then(datos => {
      todosLosProductos = datos;

      let opciones = `<option value="">Seleccione un producto</option>`;
      datos.forEach(p => {
        opciones += `<option value="${p.id}">${p.nombre} (stock: ${p.stock})</option>`;
      });

      selectPedidoProducto.innerHTML = opciones;
    })
    .catch(error => mostrarMensaje(error.message, true));
}

// Agregar un producto al pedido que se está armando.
// Todavía no se llama a la API: el pedido se envía al confirmarlo.
formularioPedido.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const idProducto = Number(selectPedidoProducto.value);
  const cantidad = Number(campoPedidoCantidad.value);

  if (idProducto === 0) {
    mostrarMensaje("Seleccione un producto.", true);
    return;
  }

  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    mostrarMensaje("La cantidad debe ser un número entero mayor a cero.", true);
    return;
  }

  const producto = todosLosProductos.find(p => p.id === idProducto);

  // La API no acepta el mismo producto dos veces: si ya está, se suma la cantidad
  const existente = itemsPedido.find(item => item.producto.id === idProducto);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    itemsPedido.push({ producto: producto, cantidad: cantidad });
  }

  selectPedidoProducto.value = "";
  campoPedidoCantidad.value = 1;
  mostrarItemsPedido();
});

// Dibuja el pedido en armado: una fila por producto y el total
function mostrarItemsPedido() {
  if (itemsPedido.length === 0) {
    contenedorItems.innerHTML = `<p class="vacio">El pedido está vacío.</p>`;
    return;
  }

  let html = "";
  let total = 0;

  itemsPedido.forEach((item, indice) => {
    const subtotal = item.producto.precio * item.cantidad;
    total += subtotal;

    html += `
      <div class="fila-pedido">
        <span class="nombre">${item.producto.nombre}</span>
        <span>${item.cantidad} x $ ${item.producto.precio}</span>
        <strong>$ ${subtotal.toFixed(2)}</strong>
        <button class="peligro" onclick="quitarItem(${indice})">Quitar</button>
      </div>
    `;
  });

  html += `<p class="total-pedido">Total: $ ${total.toFixed(2)}</p>`;
  contenedorItems.innerHTML = html;
}

// Quita una fila del pedido en armado
function quitarItem(indice) {
  itemsPedido.splice(indice, 1);
  mostrarItemsPedido();
}

botonVaciar.addEventListener("click", function () {
  itemsPedido = [];
  mostrarItemsPedido();
});

// POST /pedidos: envía el pedido a la API
// La API responde 201. Si hay un error (por ejemplo stock insuficiente),
// responde 400 con un mensaje que leerRespuesta convierte en Error.
botonConfirmar.addEventListener("click", function () {
  // La API espera { items: [ { productoId, cantidad }, ... ] }
  const items = [];
  itemsPedido.forEach(item => {
    items.push({ productoId: item.producto.id, cantidad: item.cantidad });
  });

  fetch(URL_PEDIDOS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ items: items })
  })
    .then(leerRespuesta)
    .then(() => {
      mostrarMensaje("Pedido confirmado.", false);
      itemsPedido = [];
      mostrarItemsPedido();
      cargarProductos();   // el stock cambió
      cargarPedidos();
    })
    .catch(error => mostrarMensaje(error.message, true));
});

// GET /pedidos: lista los pedidos realizados
function cargarPedidos() {
  fetch(URL_PEDIDOS)
    .then(leerRespuesta)
    .then(response => response.json())
    .then(pedidos => mostrarPedidos(pedidos))
    .catch(error => mostrarMensaje(error.message, true));
}

function mostrarPedidos(pedidos) {
  if (pedidos.length === 0) {
    listaPedidos.innerHTML = "<p>Todavía no hay pedidos.</p>";
    return;
  }

  let html = "";

  // Se recorre desde el último: el pedido más reciente aparece primero
  for (let i = pedidos.length - 1; i >= 0; i--) {
    const p = pedidos[i];
    const fecha = new Date(p.fecha).toLocaleString("es-AR");

    let lineas = "";
    p.lineas.forEach(l => {
      lineas += `<li>${l.producto}: ${l.cantidad} x $ ${l.precioUnitario} = $ ${l.subtotal}</li>`;
    });

    html += `
      <article class="pedido">
        <div class="pedido-cabecera">
          <h3>Pedido ${p.id}</h3>
          <span class="fecha">${fecha}</span>
        </div>
        <ul>${lineas}</ul>
        <p class="total">Total: $ ${p.total}</p>
      </article>
    `;
  }

  listaPedidos.innerHTML = html;
}

// Carga inicial
cargarCategorias();
cargarProductos();
mostrarItemsPedido();
cargarPedidos();