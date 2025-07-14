// Inicializar carrito desde localStorage o vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Variable global de vinos
let vinos = [];

// Fetch de vinos.json
fetch('vinos.json')
  .then(response => response.json())
  .then(data => {
    vinos = data;
    mostrarProductos(vinos);
    calcularTotales();
    renderizarCarrito();
  })
  .catch(error => console.error('Error cargando vinos:', error));

// Mostrar productos con imágenes y precios
function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  lista.forEach(vino => {
    const descuento = vino.precio > 1200 ? 0.10 : 0;
    const precioFinal = vino.precio * (1 - descuento);

    const div = document.createElement("div");
    div.innerHTML = `
      <img src="img/${vino.imagen}" alt="${vino.nombre}">
      <div>
        <h3>${vino.nombre}</h3>
        <p>Precio: <del>$${vino.precio.toFixed(2)}</del> 
        <strong>$${precioFinal.toFixed(2)}</strong> 
        ${descuento ? "<span style='color:green'>(10% OFF)</span>" : ""}
        </p>
        <button onclick="agregarAlCarrito(${vino.id})">Comprar</button>
      </div>
    `;
    contenedor.appendChild(div);
  });
}

// Agregar al carrito
function agregarAlCarrito(id) {
  const vino = vinos.find(v => v.id === id);
  if (vino) {
    const descuento = vino.precio > 1200 ? 0.10 : 0;
    const precioFinal = vino.precio * (1 - descuento);

    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
      carrito[index].cantidad += 1;
    } else {
      carrito.push({ ...vino, precio: precioFinal, cantidad: 1 });
    }

    guardarCarrito();
    calcularTotales();
    renderizarCarrito();

    Swal.fire({
      icon: 'success',
      title: 'Agregado al carrito',
      text: `${vino.nombre} fue agregado.`,
      timer: 1500,
      showConfirmButton: false
    });
  }
}

// Guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Vaciar carrito con confirmación
function vaciarCarrito() {
  Swal.fire({
    title: '¿Vaciar carrito?',
    text: "Se eliminarán todos los productos.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, vaciar',
    cancelButtonText: 'Cancelar'
  }).then(result => {
    if (result.isConfirmed) {
      carrito = [];
      guardarCarrito();
      calcularTotales();
      renderizarCarrito();
      Swal.fire({
        icon: 'success',
        title: 'Carrito vacío',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}

// Eliminar producto individual
function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  calcularTotales();
  renderizarCarrito();
}

// Mostrar carrito visualmente
function renderizarCarrito() {
  const contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${p.nombre} x${p.cantidad} - $${(p.precio * p.cantidad).toFixed(2)}
      <button onclick="eliminarProducto(${p.id})">Eliminar</button></p>
    `;
    contenedor.appendChild(div);
  });
}

// Buscar vinos
function buscarVinos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = vinos.filter(v => v.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

// Filtrar vinos por precio
function filtrarPrecio() {
  const valor = parseInt(document.getElementById("filtroPrecio").value);
  if (!isNaN(valor)) {
    const filtrados = vinos.filter(v => v.precio <= valor);
    mostrarProductos(filtrados);
  } else {
    mostrarProductos(vinos);
  }
}

// Calcular totales y actualizar pantalla
function calcularTotales() {
  const cantidad = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  let total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  let descuento = 0;

  if (cantidad >= 3) {
    descuento = total * 0.10;
  }

  const totalFinal = total - descuento;

  document.getElementById("cantidad").innerText = cantidad;
  document.getElementById("total").innerText = totalFinal.toFixed(2);
  document.getElementById("descuento").innerText = descuento.toFixed(2);
}
