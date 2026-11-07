// Global State Variables
let productsData = [];
let cart = [];

// DOM Elements
const menuGrid = document.getElementById('menu-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeModal = document.getElementById('close-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// 1. Fetch Product Data from external JSON file
async function fetchProducts() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        productsData = data.products;
        displayProducts(productsData);
    } catch (error) {
        console.error('Error loading menu products:', error);
        menuGrid.innerHTML = '<p>Failed to load menu items. Please try again later.</p>';
    }
}

// 2. Render Products into HTML Grid
function displayProducts(products) {
    menuGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
}

// 3. Category Filter Logic
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons and add to clicked one
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');
        if (category === 'all') {
            displayProducts(productsData);
        } else {
            const filteredProducts = productsData.filter(item => item.category === category);
            displayProducts(filteredProducts);
        }
    });
});

// 4. Cart Logic
function addToCart(productId) {
    const item = productsData.find(p => p.id === productId);
    cart.push(item);
    updateCartUI();
}

function updateCartUI() {
    // Update badge count
    cartCount.textContent = cart.length;

    // Render cart items inside modal
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>$${item.price.toFixed(2)}</small>
                </div>
                <button class="btn btn-secondary" onclick="removeFromCart(${index})" style="padding: 4px 10px; font-size: 0.8rem;">Remove</button>
            </div>
        `).join('');
    }

    // Calculate total price
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Modal Event Listeners
cartBtn.addEventListener('click', () => cartModal.classList.add('open'));
closeModal.addEventListener('click', () => cartModal.classList.remove('open'));

// 5. Mobile Navbar Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// 6. Contact Form Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Thank you! Your message has been sent successfully.';
    contactForm.reset();
    setTimeout(() => {
        formStatus.textContent = '';
    }, 4000);
});

// Initialize on page load
fetchProducts();