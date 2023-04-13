// Despliegue menú de usuario
const menuButton = document.getElementById('menuButton');
const userMenu = document.getElementById('userMenu');
const loggedInMenu = document.getElementById('loggedIn');
const notLoggedInMenu = document.getElementById('notLoggedIn');

menuButton.addEventListener('click', () => {
    userMenu.classList.toggle('show');

    if (sessionStorage.getItem('user')) {
        loggedInMenu.classList.toggle('show');
        notLoggedInMenu.classList.toggle('show');
    }
});

// Registro de usuario
const registerForm = document.getElementById('registerForm');

registerForm && registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('register_name').value;
    const email = document.getElementById('register_email').value;
    const password = document.getElementById('register_password').value;
    const password2 = document.getElementById('register_password2').value;

    // Validación de campos
    if (password !== password2) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Creación de usuario
    const user = {
        nombre: nombre,
        email: email,
        password: password
    };

    // Guardar usuario en sessionStorage
    const user_json = JSON.stringify(user);
    sessionStorage.setItem('user', user_json);

    localStorage.setItem('showWelcome', true)

    window.location.href = '/index.html';
});


// Inicio de sesión
const sessionUserJson = sessionStorage.getItem('userPrueba');
const sessionUser = JSON.parse(sessionUserJson);

const loginForm = document.getElementById('loginForm');

loginForm && loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;

    if (email === sessionUser.email && password === sessionUser.password) {
        sessionStorage.setItem('user', sessionUserJson);
        localStorage.setItem('showWelcome', true)
        window.location.href = '/index.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});


// Muestro mensaje de bienvenida
if (localStorage.getItem('showWelcome')) {
    Toastify({
        text: "Bienvenido " + sessionUser.nombre,
        duration: 3000,
        close: true,
        gravity: "bottom",
        style: {
            background: "rgb(13, 92, 83)",
        },
    }).showToast();

    localStorage.removeItem('showWelcome');
}


// Cierre de sesión
const logOutButton = document.getElementById('logOut');

logOutButton.addEventListener('click', () => {
    sessionStorage.removeItem('user');

    window.location.href = '/index.html';
});


// Muestro/oculto botón de comprar
const comprarButtons = document.getElementsByClassName('main__productComprar');

if (sessionStorage.getItem('user')) {
    for (let i = 0; i < comprarButtons.length; i++) {
        comprarButtons[i].classList.add('show');
    }
} else {
    for (let i = 0; i < comprarButtons.length; i++) {
        comprarButtons[i].classList.remove('show');
    }
}


// Agregar producto al carrito
sessionStorage.getItem('cart') ?? sessionStorage.setItem('cart', JSON.stringify([]));

const addToCart = id => {
    product = products.find(product => product.id == id);
    
    // Si hay stock, agrego el producto al carrito
    if (product.stock > 0) {
        product.stock -= 1;
        sessionStorage.setItem('products', JSON.stringify(products));

        // Si se quedó sin stock, no muestro el producto
        mainContainer.innerHTML = '';
        products.forEach(product => {
            if (product.stock == 0) {return};

            mainContainer.innerHTML += `
                <div class="main__product">
                    <img src="${product.images[0]}" alt="Producto">
                    <h1 class="main__product-title">${product.title}</h1>
                    <h3 class="main__product-price">$${product.price}</h3>
                    <button class="main__productComprar show" onClick="addToCart(${product.id})">Agregar al carrito</button>
                </div>
            `
        });

        let cart = JSON.parse(sessionStorage.getItem('cart'));

        // Agrego el producto al carrito
        const productoEnCarrito = cart.find(product => product.id == id);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad += 1;
        } else {
            cart.push({
                id: id,
                nombre: product.title,
                precio: product.price,
                imagen: product.images[0],
                cantidad: 1,
            });
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Muestro mensaje producto agregado
        Toastify({
            text: `${product.title} agregado al carrito`,
            duration: 2000,
            close: true,
            gravity: "bottom",
            style: {
                background: "rgb(13, 92, 83)",
            },
        }).showToast();
    }
}

// Restar producto del carrito
const subtractOneFromCart = id => {
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    
    let product_in_cart = cart.find(product => product.id == id);

    if (product_in_cart.cantidad > 1) {
        product_in_cart.cantidad -= 1;
    } else {
        deleteFromCart(id);
        return;
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));

    // Actualizo el carrito
    window.location.href = '/pages/cart.html';
}

// Sumar producto al carrito
const addOneToCart = id => {
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    
    let product_in_cart = cart.find(product => product.id == id);

    let products = JSON.parse(sessionStorage.getItem('products'));
    let product = products.find(product => product.id == product_in_cart.id);

    if (product.stock > 0) {
        product_in_cart.cantidad += 1;
        product.stock -= 1;
    } else {
        swal("Lo sentimos", "Ya no hay stock para éste producto", "warning");
        return;
    }

    sessionStorage.setItem('cart', JSON.stringify(cart));
    sessionStorage.setItem('products', JSON.stringify(products));

    // Actualizo el carrito
    window.location.href = '/pages/cart.html';
}

// Eliminar productos del carrito
const deleteFromCart = id => {
    let cart = JSON.parse(sessionStorage.getItem('cart'));
    
    let product_in_cart = cart.find(product => product.id == id);
    
    // Agrego el producto al stock
    let products = JSON.parse(sessionStorage.getItem('products'));
    let product = products.find(product => product.id == product_in_cart.id);

    product.stock += product_in_cart.cantidad;

    sessionStorage.setItem('products', JSON.stringify(products));

    // Elimino el producto del carrito
    cart = cart.filter(product => product.id != id);
    sessionStorage.setItem('cart', JSON.stringify(cart));

    localStorage.setItem('showDeletedProduct', true)

    // Actualizo el carrito
    window.location.href = '/pages/cart.html';
}

// Muestro mensaje de producto eliminado
if (localStorage.getItem('showDeletedProduct')) {
    Toastify({
        text: "Producto eliminado del carrito",
        duration: 3000,
        close: true,
        gravity: "bottom",
        style: {
            background: "rgb(13, 92, 83)",
        },
    }).showToast();

    localStorage.removeItem('showDeletedProduct');
}

// Finalizar compra
const finishPurchase = () => {
    let cart = JSON.parse(sessionStorage.getItem('cart'));

    if (cart.length > 0) {
        swal({
            title: "¿Desea finalizar la compra?",
            text: "Una vez finalizada, no podrá modificar su carrito",
            icon: "info",
            buttons: ["Cancelar", "Finalizar"],
        })
        .then(accept => {
            if (accept) {
                cart = [];
                sessionStorage.setItem('cart', JSON.stringify(cart));

                swal("Compra finalizada con éxito", "Gracias por su compra", "success")
            }
        })
        .then(() => {
            window.location.href = '/pages/cart.html';
        })
    }
}