document.addEventListener('DOMContentLoaded', () => {
    const checkoutCartSummary = document.getElementById('checkout-cart-summary');
    const checkoutTotalElement = document.getElementById('checkout-total');
    const placeOrderButton = document.getElementById('place-order-btn');
    const checkoutForm = document.getElementById('checkout-form');
    const confirmationMessageDiv = document.getElementById('confirmation-message');
    const cartItemCountSpan = document.getElementById('cart-item-count');

    const updateHeaderCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('shoprit_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = `(${totalItems})`;
        }
    };

    window.addEventListener('cartUpdated', updateHeaderCartCount);
    updateHeaderCartCount();

    const loadCart = () => {
        try {
            return JSON.parse(localStorage.getItem('shoprit_cart')) || [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    };

    const renderCheckoutSummary = () => {
        const cart = loadCart();
        checkoutCartSummary.innerHTML = '';

        if (cart.length === 0) {
            checkoutCartSummary.innerHTML = '<p class="text-gray-600 text-center">Your cart is empty. Please add items to proceed.</p>';
            placeOrderButton.disabled = true;
            placeOrderButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            cart.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("cart-summary-item");
                itemDiv.innerHTML = `
                    <span>${item.name} (x${item.quantity})</span>
                    <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutCartSummary.appendChild(itemDiv);
            });
            placeOrderButton.disabled = false;
            placeOrderButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        updateCheckoutTotal(cart);
    };

    const updateCheckoutTotal = (cart) => {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        checkoutTotalElement.textContent = `₹${total.toFixed(2)}`;
    };

    const handlePlaceOrder = (event) => {
        event.preventDefault();

        const cart = loadCart();
        if (cart.length === 0) {
            window.showMessage?.('Your cart is empty. Please add items before placing an order.', 'error');
            return;
        }

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const addressLine1 = document.getElementById('addressLine1').value.trim();
        const addressLine2 = document.getElementById('addressLine2').value.trim();
        const city = document.getElementById('city').value.trim();
        const state = document.getElementById('state').value.trim();
        const zipCode = document.getElementById('zipCode').value.trim();
        const country = document.getElementById('country').value.trim();

        if (!fullName || !email || !phone || !addressLine1 || !city || !state || !zipCode || !country) {
            window.showMessage?.('Please fill in all required delivery information fields.', 'error');
            return;
        }

        // Final Order Object
        const orderDetails = {
            orderId: 'ORD-' + Date.now(),
            date: new Date().toISOString(),
            total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
            status: "Pending",
            trackingStatus: "Ordered",
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity
            }))
        };

        // ✅ Save to shoprit_user.orders[]
        const user = window.getLoggedInUser();
        if (!user) {
            window.showMessage?.("Please login before placing an order", "error");
            return;
        }

        if (!user.orders) user.orders = [];
        user.orders.push(orderDetails);
        window.setLoggedInUser(user);

        // Also update full users array
        const users = JSON.parse(localStorage.getItem('shoprit_users')) || [];
        const index = users.findIndex(u => u.email === user.email);
        if (index !== -1) {
            users[index] = user;
            localStorage.setItem('shoprit_users', JSON.stringify(users));
        }

        // Success UI
        window.showMessage?.("Order placed successfully!", "success");
        checkoutForm.style.display = 'none';
        confirmationMessageDiv.style.display = 'block';

        // Cleanup
        localStorage.removeItem('shoprit_cart');
        window.dispatchEvent(new Event('cartUpdated'));
        renderCheckoutSummary();
        checkoutForm.reset();
    };

    checkoutForm.addEventListener('submit', handlePlaceOrder);
    placeOrderButton.addEventListener('click', handlePlaceOrder);

    // Mobile Nav + Footer year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }

    renderCheckoutSummary();
});
