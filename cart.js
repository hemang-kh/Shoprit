// Make addToCart available immediately
window.addToCart = function(product, quantity = 1, redirect = false) {
    let cart = JSON.parse(localStorage.getItem('shoprit_cart')) || [];
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
        showMessage(`Quantity for "${product.name}" updated!`, 'info');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
        showMessage(`"${product.name}" added to cart!`, 'success');
    }

    localStorage.setItem('shoprit_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    // Ensure renderCart is called after adding to cart
    if (typeof window.renderCart === 'function') {
        window.renderCart();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');

    function loadCart() {
        try {
            return JSON.parse(localStorage.getItem('shoprit_cart')) || [];
        } catch (e) {
            console.error("Error parsing cart from localStorage:", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('shoprit_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); // Dispatch event to update header cart count
        // Call renderCart after saving the cart to update the display
        if (typeof window.renderCart === 'function') {
            window.renderCart();
        }
    }

    window.renderCart = function() {
        const cart = loadCart();
        if (!cartItemsContainer) {
            console.warn("Cart items container not found. Cannot render cart.");
            return;
        }
        cartItemsContainer.innerHTML = ''; // Clear previous items

        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block'; // Show empty cart message
                emptyCartMessage.classList.remove('hidden'); // Ensure hidden class is removed if present
            }
            if (cartTotalElement) cartTotalElement.textContent = `₹0.00`; // Set total to zero
            if (checkoutButton) {
                checkoutButton.disabled = true; // Disable checkout button if cart is empty
                checkoutButton.classList.add('opacity-50', 'cursor-not-allowed');
            }
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none'; // Hide empty cart message
                emptyCartMessage.classList.add('hidden'); // Add hidden class for Tailwind if using
            }
            if (checkoutButton) {
                checkoutButton.disabled = false; // Enable checkout button
                checkoutButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }

            let total = 0;
            cart.forEach(item => {
                const itemLi = document.createElement('li'); // Changed from 'div' to 'li'
                itemLi.classList.add(
                    'cart-item', 'flex', 'items-center', 'justify-between', 'p-4', 'mb-4',
                    'bg-white', 'rounded-lg', 'shadow-md', 'reveal-on-scroll', 'is-visible'
                );

                const price = parseFloat(item.price) || 0;
                const quantity = parseInt(item.quantity) || 1;
                const itemTotal = price * quantity;
                total += itemTotal;

                itemLi.innerHTML = `
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-md" />
                        <div>
                            <h4 class="text-lg font-semibold text-gray-800">${item.name}</h4>
                            <p class="text-primary-color font-bold">₹${price.toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="decrease-quantity bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition" data-id="${item.id}">-</button>
                        <span class="quantity text-gray-700 font-medium">${quantity}</span>
                        <button class="increase-quantity bg-gray-200 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-300 transition" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item-button text-red-500 hover:text-red-700 text-2xl font-bold ml-4" data-id="${item.id}">&times;</button>
                `;
                cartItemsContainer.appendChild(itemLi); // Append li
            });

            if (cartTotalElement) {
                cartTotalElement.textContent = `₹${total.toFixed(2)}`; // Update cart total
            }
        }

        if (typeof window.updateHeaderCartCount === 'function') {
            window.updateHeaderCartCount();
        }
    };

    function updateQuantity(itemId, change) {
        let cart = loadCart();
        const index = cart.findIndex(item => item.id === itemId);
        if (index !== -1) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
                showMessage("Item removed from cart!", "success");
            } else {
                showMessage("Cart quantity updated!", "info");
            }
            saveCart(cart); // This will also call renderCart
        }
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', e => {
            const target = e.target;
            const id = parseInt(target.dataset.id);
            if (target.classList.contains('remove-item-button')) {
                updateQuantity(id, -9999); // Remove by setting a very low quantity
            } else if (target.classList.contains('increase-quantity')) {
                updateQuantity(id, 1);
            } else if (target.classList.contains('decrease-quantity')) {
                updateQuantity(id, -1);
            }
        });
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cart = loadCart();
            if (cart.length > 0) {
                window.location.href = 'checkout.html'; // Redirect to checkout
                showMessage("Proceeding to checkout!", "success");
            } else {
                showMessage("Your cart is empty!", "warning");
            }
        });
    }

    // Initial render of the cart when the page loads
    window.renderCart();
});

// Minimal toast message function (make sure this is globally available or handled)
function showMessage(msg, type = 'info') {
    const old = document.querySelector('.message-box');
    if (old) old.remove();

    const box = document.createElement('div');
    box.className = `message-box ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'} scale-0 opacity-0`;
    box.textContent = msg;
    document.body.appendChild(box);

    setTimeout(() => {
        box.classList.add('scale-100', 'opacity-100');
    }, 50);

    setTimeout(() => {
        box.classList.remove('scale-100', 'opacity-100');
        box.addEventListener('transitionend', () => box.remove(), { once: true });
    }, 3000);
}

// Function to update the cart count in the header
window.updateHeaderCartCount = function() {
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const cart = JSON.parse(localStorage.getItem('shoprit_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartItemCountSpan) {
        cartItemCountSpan.textContent = `(${totalItems})`;
    }
};

// Listen for the custom 'cartUpdated' event
window.addEventListener('cartUpdated', window.updateHeaderCartCount);
