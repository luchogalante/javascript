// Productos disponibles
const vinos = [
  { id: 1, nombre: "Rutini Malbec", precio: 8900 },
  { id: 2, nombre: "Luigi Bosca Cabernet Sauvignon", precio: 8300 },
  { id: 3, nombre: "Norton Reserva Malbec", precio: 4900 },
  { id: 4, nombre: "Trumpeter Chardonnay", precio: 5600 },
  { id: 5, nombre: "Catena Zapata Malbec Argentino", precio: 16500 },
  { id: 6, nombre: "Salentein Reserva Pinot Noir", precio: 6100 },
  { id: 7, nombre: "El Esteco Blend de Extremos", precio: 7700 },
  { id: 8, nombre: "Alma Negra Misterio", precio: 7200 },
  { id: 9, nombre: "Terrazas de los Andes Malbec", precio: 6400 },
  { id: 10, nombre: "Amalaya Blanco Dulce", precio: 3900 },
];


let carrito = [];

// Mostrar productos
function mostrarProductos(lista) {
  const contenedor = document.getElementById("productos");
  contenedor.innerHTML = ""; // Limpiar antes de renderizar
  lista.forEach((vino) => {
    const descuento = vino.precio > 1200 ? 0.10 : 0; // 10% de descuento si > 1200
    const precioFinal = vino.precio * (1 - descuento);

    const div = document.createElement("div");
    div.innerHTML = `
      <h3>${vino.nombre}</h3>
      <p>Precio: <del>$${vino.precio.toFixed(2)}</del> <strong>$${precioFinal.toFixed(2)}</strong> ${descuento ? "<span style='color:green'>(10% OFF)</span>" : ""}
      </p>
      <button onclick="agregarAlCarrito(${vino.id})">Comprar</button>
      <hr>
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
    carrito.push({ ...vino, precioFinal });
    alert(`${vino.nombre} fue agregado al carrito.`);
    calcularTotales();
  }
}

// Buscar por nombre
function buscarVinos() {
  const texto = document.getElementById("buscador").value.toLowerCase();
  const filtrados = vinos.filter(v => v.nombre.toLowerCase().includes(texto));
  mostrarProductos(filtrados);
}

// Filtro por precio
function filtrarPrecio() {
  const valor = parseInt(document.getElementById("filtroPrecio").value);
  if (!isNaN(valor)) {
    const filtrados = vinos.filter(v => v.precio <= valor);
    mostrarProductos(filtrados);
  } else {
    mostrarProductos(vinos); // Reset si no hay filtro
  }
}

// Vaciar carrito
function vaciarCarrito() {
  if (confirm("¿Estás seguro de que querés salir del carrito?")) {
    carrito = [];
    calcularTotales();
    alert("Carrito vacío.");
  }
}

// Calcular el total
function calcularTotales() {
  const cantidad = carrito.length;
  let total = carrito.reduce((acc, p) => acc + p.precio, 0);
  let descuento = 0;

  if (cantidad >= 3) {
    descuento = total * 0.10; // 10% de descuento
  }

  const totalFinal = total - descuento;

  document.getElementById("cantidad").innerText = cantidad;
  document.getElementById("total").innerText = totalFinal.toFixed(2);
  document.getElementById("descuento").innerText = descuento.toFixed(2);
}
// Iniciar
document.addEventListener("DOMContentLoaded", () => {
  mostrarProductos(vinos);
});

