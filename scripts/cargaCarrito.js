cartContainer = document.getElementById('cartProducts');

let cart= JSON.parse(sessionStorage.getItem('cart'));

if (cart.length > 0) {
  let total = 0;

  cartContainer.innerHTML = "";

  cart.forEach((product) => {
    total += product.precio * product.cantidad;

    cartContainer.innerHTML += `
        <div class="cart__product">
            <img src="${product.imagen}" alt="producto">
            <div class="cart__productInfo">
                <h2 class="cart__productTitle">${product.nombre}</h2>
                <h4 class="cart__productPrice">$${product.precio}</h4>
            </div>
            <div class="cart__productQuantity">
                <button class="cart__productQuantityButton" onClick="subtractOneFromCart(${product.id})">-</button>
                <p class="cart__productQuantityNumber">${product.cantidad}</p>
                <button class="cart__productQuantityButton" onClick="addOneToCart(${product.id})">+</button>
            </div>
            <button class="cart__productDelete" onClick="deleteFromCart(${product.id})">Eliminar</button>
        </div>
    `;
  });

  cartContainer.innerHTML += `
        <div style="text-align:right;" >
            <h2 style="margin: 1rem 2rem" class="cart__totalTitle">Total $${total}</h2>
            <button class="cart__productDelete" onClick="finishPurchase()">Finalizar compra</button>
        </div>
    `;
}