// Cart functionality
let cart = [];
let cartTotal = 0;

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
    document.getElementById('cart-items-count').textContent = count;
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = cartTotal.toLocaleString();
}

function addToCart(product) {
    const existingItem = cart.find(item => item.name === product.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: product.name,
            price: parseFloat(product.price),
            quantity: 1,
            image: product.image,
            originalPrice: product.originalPrice,
            discount: product.discount
        });
    }
    
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    saveCartToLocalStorage();
    
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    saveCartToLocalStorage();
}

function updateQuantity(productName, change) {
    const item = cart.find(item => item.name === productName);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCartCount();
        updateCartTotal();
        renderCartItems();
        saveCartToLocalStorage();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price.toLocaleString()} x ${item.quantity}</p>
                ${item.discount ? `<p class="discount">-${item.discount}% off</p>` : ''}
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.name}')" class="remove-item">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('amazonCart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('amazonCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
        updateCartTotal();
        renderCartItems();
    }
}

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const products = document.querySelectorAll('.box');
    
    products.forEach(product => {
        const productName = product.querySelector('h2').textContent.toLowerCase();
        if (productName.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Product details popup
function showProductDetails(product) {
    const popup = document.getElementById('product-popup');
    const productImage = popup.querySelector('.product-image');
    const productName = popup.querySelector('.product-name');
    const productPrice = popup.querySelector('.product-price');
    const productRating = popup.querySelector('.product-rating');
    
    productImage.style.backgroundImage = `url('${product.image}')`;
    productName.textContent = product.name;
    
    const priceHtml = product.originalPrice ? 
        `<div>
            <span class="original-price">₹${parseFloat(product.originalPrice).toLocaleString()}</span>
            <span class="discount">-${product.discount}%</span>
            <br>
            <span class="price">₹${parseFloat(product.price).toLocaleString()}</span>
        </div>` :
        `<span class="price">₹${parseFloat(product.price).toLocaleString()}</span>`;
    
    productPrice.innerHTML = priceHtml;
    
    productRating.innerHTML = `
        <div class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}</div>
        <span class="review-count">${product.reviews} ratings</span>
    `;
    
    showPopup('product-popup');
}

// Popup functionality
function showPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load cart from local storage
    loadCartFromLocalStorage();

    // Search functionality
    document.querySelector('.searchinput').addEventListener('input', handleSearch);

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productBox = button.closest('.box');
            const product = {
                name: productBox.dataset.name,
                price: productBox.dataset.price,
                originalPrice: productBox.dataset.originalPrice,
                discount: productBox.dataset.discount,
                image: productBox.querySelector('.boximg').style.backgroundImage.slice(4, -1).replace(/"/g, '')
            };
            addToCart(product);
        });
    });

    // Product boxes (for details popup)
    document.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', () => {
            const product = {
                name: box.dataset.name,
                price: box.dataset.price,
                originalPrice: box.dataset.originalPrice,
                discount: box.dataset.discount,
                rating: parseFloat(box.dataset.rating),
                reviews: box.dataset.reviews,
                image: box.querySelector('.boximg').style.backgroundImage.slice(4, -1).replace(/"/g, '')
            };
            showProductDetails(product);
        });
    });

    // Cart popup trigger
    document.getElementById('cart-popup-trigger').addEventListener('click', () => {
        showPopup('cart-popup');
    });

    // Sign in popup trigger
    document.getElementById('signin-popup-trigger').addEventListener('click', () => {
        showPopup('signin-popup');
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.popup');
            closePopup(popup.id);
        });
    });

    // Close popups when clicking outside
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                closePopup(popup.id);
            }
        });
    });

    // Sign in form submission
    document.getElementById('signin-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Here you would typically handle authentication
        console.log('Sign in attempted with:', { email, password });
        showNotification('Sign in successful!');
        closePopup('signin-popup');
    });

    // Buy now buttons
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotification('Proceeding to checkout...');
        });
    });

    // Checkout button
    document.querySelector('.checkout-button').addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
        } else {
            showNotification('Proceeding to checkout...');
            closePopup('cart-popup');
        }
    });
});