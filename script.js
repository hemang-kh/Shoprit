// Make products array globally accessible
const products = [
    {
        id: 1,
        name: "Handmade Necklace",
        price: 499.00,
        image: "images/necklace.jpg",
        description: "A beautifully handcrafted necklace, perfect for any occasion. Made with ethically sourced materials and exquisite attention to detail, it adds a touch of elegance to your everyday look or special events.",
        category: "accessories"
    },
    {
        id: 2,
        name: "Wooden Wall Art",
        price: 899.00,
        image: "images/wall-art.jpg",
        description: "Unique wooden wall art, carved from sustainable timber. This rustic yet modern piece brings nature's beauty into your home, perfect for living rooms, bedrooms, or offices. Easy to hang and a true conversation starter.",
        category: "home-decor"
    },
    {
        id: 3,
        name: "Cotton Tote Bag",
        price: 299.00,
        image: "images/tote-bag.jpg",
        description: "An eco-friendly and stylish cotton tote bag.",
        category: "bags"
    },
    {
        id: 4,
        name: "Decorative Candle",
        price: 199.00,
        image: "images/candle.jpg",
        description: "A delightful decorative candle, infused with calming lavender and vanilla scents.",
        category: "home-decor"
    },
    {
        id: 5,
        name: "Bluetooth Keyboard",
        price: 1500.00,
        image: "images/bluetooth-keyboard.jpg",
        description: "Slim and portable, perfect for on-the-go productivity.",
        category: "electronics"
    },
    {
        id: 6,
        name: "Smart LED Bulb",
        price: 800.00,
        image: "images/smart-led-bulb.jpg",
        description: "Control your lighting from anywhere with your smartphone.",
        category: "electronics"
    },
    {
        id: 7,
        name: "Wireless Earbuds",
        price: 2500.00,
        image: "images/wireless-earbuds.jpg",
        description: "Crystal-clear audio and comfortable fit for all-day listening.",
        category: "electronics"
    },
    {
        id: 8,
        name: "Portable SSD",
        price: 4000.00,
        image: "images/portable-ssd.jpg",
        description: "Lightning-fast storage for all your files on the go.",
        category: "electronics"
    },
    {
        id: 9,
        name: "Gaming Mouse",
        price: 1200.00,
        image: "images/gaming-mouse.jpg",
        description: "Precision and speed for an immersive gaming experience.",
        category: "electronics"
    },
    {
        id: 10,
        name: "USB-C Hub",
        price: 900.00,
        image: "images/usb-c-hub.jpg",
        description: "Expand your laptop's connectivity with multiple ports.",
        category: "electronics"
    },
    {
        id: 11,
        name: "Noise-Cancelling Headphones",
        price: 3500.00,
        image: "images/noise-cancelling-headphones.jpg",
        description: "Immerse yourself in pure sound, free from distractions.",
        category: "electronics"
    },
    {
        id: 12,
        name: "Webcam 1080p",
        price: 1800.00,
        image: "images/webcam-1080p.jpg",
        description: "Crisp video calls and streaming in full high definition.",
        category: "electronics"
    },
    {
        id: 13,
        name: "Graphic Tablet",
        price: 6000.00,
        image: "images/graphic-tablet.jpg",
        description: "Unleash your creativity with precise digital drawing.",
        category: "electronics"
    }
];

// Expose products globally
window.products = products;


document.addEventListener('DOMContentLoaded', () => {

    const productListContainer = document.getElementById('product-list-container');
    const cartItemCountSpan = document.getElementById('cart-item-count');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const sortBySelect = document.getElementById('sort-by');

    // --- NEW JAVASCRIPT FOR CAROUSEL STARTS HERE ---
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevButton = document.querySelector('.carousel-control-prev');
    const nextButton = document.querySelector('.carousel-control-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');

    let currentIndex = 0;
    let autoSlideInterval;
    const slideDuration = 5000; // 5 seconds per slide

    // Function to show a specific slide - **THIS IS THE SNIPPET YOU PROVIDED**
    function showSlide(index) {
        // Calculate the new transform position
        const offset = -index * 100; // each slide = 100% width

        // Apply transform to slide horizontally
        if (carouselInner) {
            carouselInner.style.transform = `translateX(${offset}%)`;
        }

        // Update active indicator
        indicators.forEach(indicator => indicator.classList.remove('active'));
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }

        // Update current index
        currentIndex = index;
    }

    // Function to go to the next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
    }

    // Function to go to the previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
    }

    // Start auto-sliding
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval first
        autoSlideInterval = setInterval(nextSlide, slideDuration);
    }

    // Stop auto-sliding
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event Listeners for carousel controls
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            prevSlide();
            startAutoSlide(); // Restart after a brief pause (optional)
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            stopAutoSlide(); // Stop auto-slide on manual interaction
            nextSlide();
            startAutoSlide(); // Restart after a brief pause (optional)
        });
    }

    if (indicatorsContainer) {
        indicatorsContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('indicator')) {
                stopAutoSlide(); // Stop auto-slide on manual interaction
                const slideTo = parseInt(event.target.dataset.slideTo);
                showSlide(slideTo);
                startAutoSlide(); // Restart
            }
        });
    }

    // Initial load: show the first slide and start auto-slide
    if (carouselItems.length > 0) {
        showSlide(currentIndex);
        startAutoSlide();

        // Pause auto-slide when mouse is over the carousel
        const heroCarousel = document.querySelector('.hero-carousel');
        if (heroCarousel) {
            heroCarousel.addEventListener('mouseenter', stopAutoSlide);
            heroCarousel.addEventListener('mouseleave', startAutoSlide);
        }
    }
    // --- NEW JAVASCRIPT FOR CAROUSEL ENDS HERE ---


    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);

    function createProductCard(product, delay = 0) {
        const div = document.createElement('div');
        div.className = 'product-card reveal-on-scroll';
        div.style.transitionDelay = `${delay}s`;

        div.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-card-link">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.onerror=null; this.src='https://placehold.co/300x200/e2e8f0/6366f1?text=No+Image';">
                </div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">₹${product.price.toFixed(2)}</p>
            </a>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
            <!-- Wishlist Button - Added -->
            <button class="wishlist-btn" data-product-id="${product.id}">&#x2764;</button>
        `;
        return div;
    }

    function displayProducts(productsDataToShow = products) {
        if (!productListContainer) {
            console.error("Product list container not found. Check 'product-list-container' ID in HTML.");
            return;
        }

        productListContainer.innerHTML = "";
        const delayIncrement = 0.1;
        const productsToRender = productsDataToShow;

        if (productsToRender.length === 0) {
            productListContainer.innerHTML = '<p class="text-center text-gray-600 col-span-full">No products found matching your criteria.</p>';
            return;
        }

        productsToRender.forEach((product, index) => {
            const card = createProductCard(product, index * delayIncrement);
            productListContainer.appendChild(card);
            observer.observe(card);
        });

        localStorage.setItem('productsData', JSON.stringify(products));
        attachAddToCartListeners();

        // NEW: Dispatch event after products are rendered
        window.dispatchEvent(new Event('productsRendered'));
    }

    function filterAndSearchProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const sortByValue = sortBySelect ? sortBySelect.value : 'default';

        let filteredProducts = products;

        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
        }

        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                (product.description && product.description.toLowerCase().includes(searchTerm)) ||
                (product.category && product.category.toLowerCase().includes(searchTerm))
            );
        }

        switch (sortByValue) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'default':
            default:
                break;
        }

        displayProducts(filteredProducts);
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const productId = parseInt(event.target.dataset.productId);
                const productToAdd = products.find(p => p.id === productId);

                if (productToAdd) {
                    function waitForAddToCartAndRun() {
                        if (typeof window.addToCart === 'function') {
                            // This is the correct call, passing the full product object
                            window.addToCart(productToAdd, 1, true);
                        } else {
                            setTimeout(waitForAddToCartAndRun, 50);
                        }
                    }
                    waitForAddToCartAndRun();
                } else {
                    console.error('Product not found for ID:', productId);
                }
            });
        });
    }

    const updateHeaderCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('shoprit_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountSpan) {
            cartItemCountSpan.textContent = `(${totalItems})`;
        }
    };

    window.addEventListener('cartUpdated', updateHeaderCartCount);

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

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    filterAndSearchProducts();

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearchProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterAndSearchProducts);
    }
    if (sortBySelect) {
        sortBySelect.addEventListener('change', filterAndSearchProducts);
    }

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        if (!productListContainer.contains(el)) {
            observer.observe(el);
        }
    });

    updateHeaderCartCount();


    // ======== USER UTILITIES ========
    window.getLoggedInUser = function () {
        return JSON.parse(localStorage.getItem("shoprit_user"));
    };

    window.setLoggedInUser = function (user) {
        localStorage.setItem("shoprit_user", JSON.stringify(user));
        window.dispatchEvent(new Event("userUpdated")); // Useful if account.html listens
    };

    // ======== DASHBOARD FUNCTIONAL METHODS ========
    window.recordOrder = function () {
        const user = window.getLoggedInUser();
        if (!user) return;

        user.totalOrders = (user.totalOrders || 0) + 1;
        user.pendingOrders = (user.pendingOrders || 0) + 1;
        user.lastLogin = new Date().toISOString(); // Update activity

        window.setLoggedInUser(user);
    };

    window.completeOrder = function () {
        const user = window.getLoggedInUser();
        if (!user) return;

        user.pendingOrders = Math.max(0, (user.pendingOrders || 0) - 1);
        window.setLoggedInUser(user);
    };

    window.recordCancelledOrder = function () {
        const user = window.getLoggedInUser();
        if (!user) return;

        user.cancelledOrders = (user.cancelledOrders || 0) + 1;
        user.pendingOrders = Math.max(0, (user.pendingOrders || 0) - 1);
        window.setLoggedInUser(user);
    };

    // REMOVED CONFLICTING window.addToWishlist and window.removeFromWishlist
    // These are now handled by wishlist.js.
    // The dashboard metrics will be updated by listening to 'wishlistUpdated' event from wishlist.js
    // or by calling a specific dashboard update function.
    window.updateWishlistDashboardCount = function() {
        const user = window.getLoggedInUser();
        if (!user) return;
        const wishlist = window.loadWishlist ? window.loadWishlist() : []; // Use loadWishlist from wishlist.js
        user.wishlistItems = wishlist.length;
        window.setLoggedInUser(user);
    };

    window.applyCouponCode = function (code) {
        const user = window.getLoggedInUser();
        if (!user) return;

        if (!user.couponCodes) user.couponCodes = [];

        if (!user.couponCodes.includes(code)) {
            user.couponCodes.push(code);
            window.setLoggedInUser(user);
            return true;
        }
        return false;
    };

    window.updateLastLogin = function () {
        const user = window.getLoggedInUser();
        if (!user) return;
        user.lastLogin = new Date().toISOString();
        window.setLoggedInUser(user);
    };

    // ======== HEADER CART COUNT (already implemented) ========
    // This function is fine as is.
    // window.updateHeaderCartCount is defined in cart.js and also here.
    // Let's ensure cart.js's version is the primary one, or consolidate.
    // For now, keeping both as they are identical.

    window.addEventListener("cartUpdated", window.updateHeaderCartCount);

    // NEW: Call updateWishlistHeaderCount on initial load and listen for updates
    // This ensures the header badge is updated.
    if (typeof window.updateWishlistHeaderCount === 'function') {
        window.updateWishlistHeaderCount();
    }
    window.addEventListener('wishlistUpdated', () => {
        if (typeof window.updateWishlistHeaderCount === 'function') {
            window.updateWishlistHeaderCount();
        }
        // Also update dashboard count if on account page
        if (window.location.pathname.includes("account.html")) {
             window.updateWishlistDashboardCount();
        }
    });
    // Also listen for user updates to refresh dashboard wishlist count
    window.addEventListener('userUpdated', () => {
        if (window.location.pathname.includes("account.html")) {
            window.updateWishlistDashboardCount();
        }
    });


    // NEW: Function to initialize wishlist buttons on product cards
    function initializeWishlistButtonsOnCards() {
        document.querySelectorAll('.product-card .wishlist-btn').forEach(button => {
            const productId = parseInt(button.dataset.productId);
            const loggedInUser = window.getLoggedInUser();

            if (!loggedInUser) {
                button.style.display = 'none'; // Hide wishlist button if not logged in
                return;
            } else {
                button.style.display = 'flex'; // Show if logged in
            }

            // Set initial state
            // Ensure window.isProductInWishlist is available from wishlist.js
            if (typeof window.isProductInWishlist === 'function' && window.isProductInWishlist(productId)) {
                button.classList.add('saved');
            } else {
                button.classList.remove('saved');
            }

            // Add click listener
            button.onclick = (e) => { // Using onclick to avoid multiple listeners if re-initialized
                e.stopPropagation(); // Prevent card click if any
                const product = products.find(p => p.id === productId); // Access global products array
                if (product) {
                    if (typeof window.isProductInWishlist === 'function' && window.isProductInWishlist(productId)) {
                        window.removeFromWishlist(productId); // Call wishlist.js function
                    } else {
                        window.addToWishlist(product); // Call wishlist.js function
                    }
                    // Update button state immediately after action
                    initializeWishlistButtonsOnCards(); // Re-initialize all buttons to update states
                    window.updateWishlistHeaderCount(); // Update header badge
                }
            };
        });
    }

    // Listen for products to be rendered, then initialize wishlist buttons
    window.addEventListener('productsRendered', initializeWishlistButtonsOnCards);
    // Also re-initialize if wishlist changes from other pages (e.g., wishlist.html)
    window.addEventListener('wishlistUpdated', initializeWishlistButtonsOnCards);

}); // End of main DOMContentLoaded


// User Authentication Logic (Outside main DOMContentLoaded for global access if needed)

// Show toast message
function showMessage(msg, type = 'info') {
    const old = document.querySelector('.message-box');
    if (old) old.remove();

    const box = document.createElement('div');
    box.className = `message-box ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'} scale-0 opacity-0`;
    box.textContent = msg;
    document.body.appendChild(box);

    setTimeout(() => box.classList.add('scale-100', 'opacity-100'), 50);
    setTimeout(() => {
        box.classList.remove('scale-100', 'opacity-100');
        box.addEventListener('transitionend', () => box.remove(), { once: true });
    }, 3000);
}

// Register
// ✅ Enhanced Registration with Duplicate Email Check
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showMessage("Passwords do not match!", "error");
            return;
        }

        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('shoprit_users')) || [];

        // Check if email already exists
        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            showMessage("This email is already registered!", "error");
            return;
        }

        // Add new user
        const newUser = { name, email, password, totalOrders: 0, pendingOrders: 0, cancelledOrders: 0, wishlistItems: 0, couponCodes: [], lastLogin: new Date().toISOString() };
        users.push(newUser);

        // Save updated user list
        localStorage.setItem('shoprit_users', JSON.stringify(users));
        showMessage("Registered successfully!", "success");

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    });
}


// Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        const users = JSON.parse(localStorage.getItem('shoprit_users')) || []; // Load all users
        const matchedUser = users.find(user => user.email === email && user.password === password);


        if (!matchedUser) {
            showMessage("Invalid credentials!", "error");
            return;
        }

        localStorage.setItem('shoprit_logged_in', 'true');
        // Store the *matchedUser* object in shoprit_user
        localStorage.setItem('shoprit_user', JSON.stringify(matchedUser));
        showMessage("Logged in successfully!", "success");
        setTimeout(() => window.location.href = 'account.html', 1000);
    });
}

// Update header account status

function updateAccountStatus() {
    const accountStatus = document.getElementById('accountStatus');
    const isLoggedIn = localStorage.getItem('shoprit_logged_in') === 'true';
    const user = window.getLoggedInUser(); // Use the global getLoggedInUser

    if (accountStatus) {
        if (isLoggedIn && user) {
            accountStatus.textContent = `Hi, ${user.name} 👋`;
        } else {
            accountStatus.textContent = '(Guest)';
        }
    }
}

updateAccountStatus();

// On account.html – personalize and allow logout
if (window.location.pathname.includes('account.html')) {
    const user = window.getLoggedInUser(); // Use the global getLoggedInUser
    const welcome = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');

    if (user && welcome) {
        welcome.textContent = `Welcome, ${user.name}!`;
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('shoprit_logged_in');
            localStorage.removeItem('shoprit_user'); // Clear user data on logout
            showMessage("Logged out successfully!", "success");
            setTimeout(() => window.location.href = 'login.html', 1000);
        });
    }
}
// ✅ Forgot Password Logic
document.addEventListener('DOMContentLoaded', () => { // This is a redundant DOMContentLoaded, should be merged or removed
    const emailForm = document.getElementById('forgotPasswordEmailForm');
    const resetForm = document.getElementById('resetPasswordForm');

    if (emailForm && resetForm) {
        let resetEmail = '';

        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('forgotEmail');
            const email = emailInput.value.trim().toLowerCase();
            const errorBox = document.getElementById('forgotEmailError');

            const users = JSON.parse(localStorage.getItem('shoprit_users')) || [];
            const matchedUser = users.find(user => user.email === email);

            if (!matchedUser) {
                errorBox.textContent = "No account found with this email.";
                return;
            }

            // Hide step 1, show step 2
            resetEmail = email;
            emailForm.style.display = 'none';
            resetForm.style.display = 'block';
            showMessage("Account found. Set your new password.", "info");
        });

        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmNewPassword').value;
            const error1 = document.getElementById('newPasswordError');
            const error2 = document.getElementById('confirmNewPasswordError');

            error1.textContent = '';
            error2.textContent = '';

            if (newPass.length < 6) {
                error1.textContent = "Password must be at least 6 characters.";
                return;
            }
            if (newPass !== confirmPass) {
                error2.textContent = "Passwords do not match.";
                return;
            }

            const users = JSON.parse(localStorage.getItem('shoprit_users')) || [];
            const updatedUsers = users.map(user => {
                if (user.email === resetEmail) {
                    return { ...user, password: newPass };
                }
                return user;
            });

            localStorage.setItem('shoprit_users', JSON.stringify(updatedUsers));
            showMessage("Password updated successfully!", "success");

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }
});
