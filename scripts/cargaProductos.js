const mainContainer = document.getElementById("mainContainer");

let products = JSON.parse(sessionStorage.getItem("products"));

if (products) {
  addToHtml(products);
} else {
  fetch("https://api.escuelajs.co/api/v1/products?offset=0&limit=30")
    .then((response) => response.json())
    .then((data) => {
      data.map(product => {product.stock = 10}) // Agrego stock default a cada producto
      sessionStorage.setItem("products", JSON.stringify(data));
    })
    .then(() => {
      let products = JSON.parse(sessionStorage.getItem("products"));

      addToHtml(products);
    });
}

function addToHtml(products) {
  products.forEach((product) => {
    mainContainer.innerHTML += `
      <div class="main__product">
          <img src="${product.images[0]}" alt="Producto">
          <h1 class="main__product-title">${product.title}</h1>
          <h3 class="main__product-price">$${product.price}</h3>
          <button class="main__productComprar" onClick="addToCart(${product.id})">Agregar al carrito</button>
      </div>
    `;
  });
}