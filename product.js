document.addEventListener('DOMContentLoaded', () => {
    const productDetailContainer = document.getElementById('product-detail-container');
    const currentYearSpan = document.getElementById('current-year');

    // Intersection Observer for animations
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

    // Load product data
    let products = [];
    try {
        const storedProducts = localStorage.getItem('productsData');
        if (storedProducts) {
            products = JSON.parse(storedProducts);
        } else {
            console.warn("No 'productsData' found in localStorage. Using fallback product data.");
            products = [
                {
                    id: 1,
                    name: "Handmade Necklace",
                    price: 499.00,
                    image: "images/necklace.jpg",
                    description: "A beautifully handcrafted necklace, perfect for any occasion. Made with ethically sourced materials and exquisite attention to detail, it adds a touch of elegance to your everyday look or special events."
                },
                {
                    id: 2,
                    name: "Wooden Wall Art",
                    price: 899.00,
                    image: "images/wall-art.jpg",
                    description: "Unique wooden wall art, carved from sustainable timber. This rustic yet modern piece brings nature's beauty into your home, perfect for living rooms, bedrooms, or offices. Easy to hang and a true conversation starter."
                },
                {
                    id: 3,
                    name: "Cotton Tote Bag",
                    price: 299.00,
                    image: "images/tote-bag.jpg",
                    description: "An eco-friendly and stylish cotton tote bag, ideal for shopping, books, or daily essentials. Durable, reusable, and spacious, it's a perfect blend of practicality and fashion for the conscious consumer."
                },
                {
                    id: 4,
                    name: "Decorative Candle",
                    price: 199.00,
                    image: "images/candle.jpg",
                    description: "A delightful decorative candle, infused with calming lavender and vanilla scents. Hand-poured with natural soy wax, it creates a warm and inviting ambiance in any room, perfect for relaxation or gifting."
                }
            ];
            localStorage.setItem('productsData', JSON.stringify(products));
        }
    } catch (e) {
        console.error("Error accessing localStorage for products data:", e);
    }

    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function renderProductDetails(product) {
        if (!productDetailContainer) {
            console.error("Product detail container not found.");
            return;
        }

        productDetailContainer.innerHTML = `
            <div class="product-detail-wrapper">
                <div class="product-detail-image-area">
                    <img src="${product.image}" alt="${product.name}" class="product-detail-image">
                </div>
                <div class="product-detail-info-area">
                    <h1 class="product-detail-name">${product.name}</h1>
                    <p class="product-detail-price">₹${product.price.toFixed(2)}</p>
                    <p class="product-detail-description">${product.description}</p>
                    <button id="add-to-cart-detail-btn" class="btn btn-primary mt-4" data-product-id="${product.id}">Add to Cart</button>
                    <a href="products.html" class="btn btn-secondary mt-2">← Back to Products</a>
                </div>
            </div>
        `;

        const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
        if (addToCartDetailBtn) {
            addToCartDetailBtn.addEventListener('click', () => {
                function waitForAddToCartAndRun() {
                    if (typeof window.addToCart === 'function') {
                        window.addToCart(product.id); // Only product ID is passed
                    } else {
                        setTimeout(waitForAddToCartAndRun, 50); // Retry after short delay
                    }
                }
                waitForAddToCartAndRun();
            });
        }

        renderReviews(product.id); // ✅ Important: ensure reviews load
    }

    const productId = getQueryParam('id');
    if (productId) {
        const selectedProduct = products.find(p => p.id === parseInt(productId));
        if (selectedProduct) {
            renderProductDetails(selectedProduct);
            if (productDetailContainer) {
                productDetailContainer.classList.add('reveal-on-scroll');
                observer.observe(productDetailContainer);
            }
        } else {
            productDetailContainer.innerHTML = '<p class="text-center">Product not found. Please check the product ID.</p>';
        }
    } else {
        productDetailContainer.innerHTML = '<p class="text-center">No product selected. Please go back to the <a href="index.html">home page</a> to select a product.</p>';
    }

    // Footer year
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Mobile nav toggle
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

    // Observe static reveal elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        if (el.id !== 'product-detail-container') {
            observer.observe(el);
        }
    });
    function renderReviews(productId) {
        const reviewList = document.getElementById('review-list');
        const reviewForm = document.getElementById('review-form');
        const nameInput = document.getElementById('reviewer-name');
        const textInput = document.getElementById('review-text');
        const starRatingContainer = document.getElementById('star-rating');
        const ratingError = document.getElementById('rating-error');
        const mediaUploadInput = document.getElementById('review-media-upload');
        const mediaPreviewContainer = document.getElementById('media-preview-container');

        if (!reviewList || !reviewForm || !nameInput || !textInput || !starRatingContainer || !mediaUploadInput || !mediaPreviewContainer) {
            console.warn("Review system elements not found. Skipping review rendering.");
            return;
        }

        const key = `product_reviews_${productId}`;
        let reviews = JSON.parse(localStorage.getItem(key)) || [];
        let selectedRating = 0;
        let uploadedMediaFile = null;

        // Render reviews
        const render = () => {
            reviewList.innerHTML = '';
            if (reviews.length === 0) {
                reviewList.innerHTML = '<p class="text-gray-500">No reviews yet. Be the first to review this product!</p>';
                return;
            }

            const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
            sorted.forEach(review => {
                const div = document.createElement('div');
                div.className = 'review-item bg-white p-6 rounded-lg shadow-md';

                let mediaHtml = '';
                if (review.mediaUrl && review.mediaType) {
                    if (review.mediaType.startsWith('image/')) {
                        mediaHtml = `<div class="review-media"><img src="${review.mediaUrl}" alt="Review Image" class="rounded-md shadow-sm"></div>`;
                    } else if (review.mediaType.startsWith('video/')) {
                        mediaHtml = `<div class="review-media"><video controls src="${review.mediaUrl}" class="rounded-md shadow-sm" style="max-width:150px;max-height:150px;"></video><p class="text-xs text-gray-500 mt-1">Video preview</p></div>`;
                    }
                }

                div.innerHTML = `
                    <p class="reviewer-name font-bold">${review.name}</p>
                    <div class="review-rating text-yellow-500 text-lg">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                    <p class="review-text mt-1">${review.text}</p>
                    ${mediaHtml}
                    <p class="review-date text-sm text-gray-400 mt-2">${new Date(review.date).toLocaleString()}</p>
                `;
                reviewList.appendChild(div);
            });
        };

        // Render star rating UI
        starRatingContainer.innerHTML = '';
        for (let i = 5; i >= 1; i--) {
            starRatingContainer.innerHTML += `
                <input type="radio" id="star${i}" name="rating" value="${i}" class="hidden" />
                <label for="star${i}" class="star text-4xl cursor-pointer text-gray-300 hover:text-yellow-400 transition-colors duration-200">★</label>
            `;
        }

        starRatingContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('star')) {
                selectedRating = parseInt(e.target.previousElementSibling.value);
                ratingError.textContent = '';

                starRatingContainer.querySelectorAll('label.star').forEach(label => {
                    const value = parseInt(label.previousElementSibling.value);
                    label.style.color = value <= selectedRating ? '#FFD700' : '#d1d5db';
                });
            }
        });

        mediaUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            uploadedMediaFile = file;
            mediaPreviewContainer.innerHTML = '';

            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    window.showMessage('File size exceeds 5MB.', 'error');
                    mediaUploadInput.value = '';
                    uploadedMediaFile = null;
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    const preview = document.createElement('div');
                    preview.classList.add('media-preview-item');

                    let media;
                    if (file.type.startsWith('image/')) {
                        media = document.createElement('img');
                        media.src = event.target.result;
                    } else if (file.type.startsWith('video/')) {
                        media = document.createElement('video');
                        media.src = event.target.result;
                        media.controls = true;
                        window.showMessage('Video will not be persistently stored.', 'warning', 5000);
                    }

                    preview.appendChild(media);

                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.classList.add('remove-media-btn');
                    removeBtn.onclick = () => {
                        mediaUploadInput.value = '';
                        uploadedMediaFile = null;
                        mediaPreviewContainer.innerHTML = '<p class="text-gray-500">No media selected.</p>';
                    };

                    preview.appendChild(removeBtn);
                    mediaPreviewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            } else {
                mediaPreviewContainer.innerHTML = '<p class="text-gray-500">No media selected.</p>';
            }
        });
            reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name || !text) {
                window.showMessage("Please fill in all fields", "error");
                return;
            }

            if (selectedRating === 0) {
                ratingError.textContent = 'Please select a star rating.';
                return;
            }

            let mediaData = null;
            if (uploadedMediaFile) {
                if (uploadedMediaFile.type.startsWith('image/')) {
                    mediaData = await new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(uploadedMediaFile);
                    });
                } else if (uploadedMediaFile.type.startsWith('video/')) {
                    mediaData = uploadedMediaFile.name;
                }
            }

            reviews.push({
                name,
                text,
                rating: selectedRating,
                mediaUrl: mediaData,
                mediaType: uploadedMediaFile ? uploadedMediaFile.type : null,
                date: new Date().toISOString()
            });

            localStorage.setItem(key, JSON.stringify(reviews));

            nameInput.value = '';
            textInput.value = '';
            selectedRating = 0;
            starRatingContainer.querySelectorAll('label.star').forEach(label => label.style.color = '#d1d5db');
            mediaUploadInput.value = '';
            uploadedMediaFile = null;
            mediaPreviewContainer.innerHTML = '<p class="text-gray-500">No media selected.</p>';

            render();
            window.showMessage("Review submitted successfully!", "success");
        });

        render();
    }

    // ✅ Define global toast utility if not already present
    if (!window.showMessage) {
        window.showMessage = function (msg, type = 'info', duration = 3000) {
            const old = document.querySelector('.message-box');
            if (old) old.remove();

            const box = document.createElement('div');
            box.className = `message-box ${
                type === 'success'
                    ? 'bg-green-500'
                    : type === 'error'
                    ? 'bg-red-500'
                    : type === 'warning'
                    ? 'bg-orange-500'
                    : 'bg-blue-500'
            } scale-0 opacity-0`;
            box.textContent = msg;
            document.body.appendChild(box);

            setTimeout(() => box.classList.add('scale-100', 'opacity-100'), 50);
            setTimeout(() => {
                box.classList.remove('scale-100', 'opacity-100');
                box.addEventListener('transitionend', () => box.remove(), { once: true });
            }, duration);
        };
    }
});
