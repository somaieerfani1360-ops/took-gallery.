// منتظر بارگذاری کامل صفحه
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tools Gallery loaded successfully! 🚀');
    
    // عناصر DOM
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeNavBtn = document.getElementById('closeNavBtn');
    const mobileNav = document.getElementById('mobileNav');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const productsSlider = document.getElementById('productsSlider');
    const cartBadge = document.querySelector('#cartBtn .badge');
    const wishlistBadge = document.querySelector('#wishlistBtn .badge');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // متغیرهای اسلایدر
    let currentSlide = 0;
    const slideWidth = 305; // عرض هر اسلاید + گپ
    const totalSlides = document.querySelectorAll('.product-slide').length;
    const visibleSlides = Math.floor(productsSlider.parentElement.offsetWidth / slideWidth);
    
    // 1. مدیریت منو همبرگر
    function initMobileMenu() {
        hamburgerBtn.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeNavBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // بستن منو با کلیک بیرون
        document.addEventListener('click', function(event) {
            if (!mobileNav.contains(event.target) && 
                !hamburgerBtn.contains(event.target) && 
                mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // بستن منو با دکمه ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // 2. مدیریت جستجو
    function initSearch() {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
        
        function performSearch() {
            const query = searchInput.value.trim();
            if (query) {
                alert(`جستجو برای: "${query}"\n\nاین ویژگی در نسخه کامل پیاده‌سازی می‌شود.`);
                searchInput.value = '';
            } else {
                alert('لطفاً عبارت جستجو را وارد کنید.');
                searchInput.focus();
            }
        }
    }
    
    // 3. مدیریت اسلایدر
    function initSlider() {
        function updateSliderPosition() {
            const maxSlide = totalSlides - visibleSlides;
            if (currentSlide > maxSlide) currentSlide = maxSlide;
            if (currentSlide < 0) currentSlide = 0;
            
            productsSlider.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
            
            // نمایش/مخفی کردن دکمه‌ها
            prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
        }
        
        prevBtn.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const maxSlide = totalSlides - visibleSlides;
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateSliderPosition();
            }
        });
        
        // کشیدن با ماوس/لمس
        let isDragging = false;
        let startPosition = 0;
        let currentTranslate = 0;
        let previousTranslate = 0;
        
        productsSlider.addEventListener('mousedown', dragStart);
        productsSlider.addEventListener('touchstart', dragStart);
        
        productsSlider.addEventListener('mousemove', drag);
        productsSlider.addEventListener('touchmove', drag);
        
        productsSlider.addEventListener('mouseup', dragEnd);
        productsSlider.addEventListener('mouseleave', dragEnd);
        productsSlider.addEventListener('touchend', dragEnd);
        
        function dragStart(event) {
            if (event.type === 'touchstart') {
                startPosition = event.touches[0].clientX;
            } else {
                startPosition = event.clientX;
                event.preventDefault();
            }
            
            isDragging = true;
            productsSlider.style.transition = 'none';
        }
        
        function drag(event) {
            if (!isDragging) return;
            
            let currentPosition = 0;
            if (event.type === 'touchmove') {
                currentPosition = event.touches[0].clientX;
            } else {
                currentPosition = event.clientX;
            }
            
            currentTranslate = previousTranslate + currentPosition - startPosition;
            productsSlider.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        function dragEnd() {
            if (!isDragging) return;
            
            isDragging = false;
            productsSlider.style.transition = 'transform 0.5s ease';
            
            const movedBy = currentTranslate - previousTranslate;
            
            if (movedBy < -100 && currentSlide < totalSlides - visibleSlides) {
                currentSlide++;
            }
            
            if (movedBy > 100 && currentSlide > 0) {
                currentSlide--;
            }
            
            previousTranslate = currentSlide * -slideWidth;
            productsSlider.style.transform = `translateX(${previousTranslate}px)`;
        }
        
        // ریسپانسیو
        window.addEventListener('resize', function() {
            const newVisibleSlides = Math.floor(productsSlider.parentElement.offsetWidth / slideWidth);
            if (newVisibleSlides !== visibleSlides) {
                updateSliderPosition();
            }
        });
        
        updateSliderPosition();
    }
    
    // 4. مدیریت تایمر
    function initTimer() {
        let hours = 23;
        let minutes = 56;
        let seconds = 16;
        
        function updateTimer() {
            seconds--;
            
            if (seconds < 0) {
                seconds = 59;
                minutes--;
                
                if (minutes < 0) {
                    minutes = 59;
                    hours--;
                    
                    if (hours < 0) {
                        // ریست تایمر
                        hours = 23;
                        minutes = 56;
                        seconds = 16;
                        
                        // نمایش اعلان
                        showNotification('⏰ تایمر فروش ویژه به پایان رسید! به زودی فروش ویژه جدید آغاز می‌شود.');
                    }
                }
            }
            
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        // اجرای تایمر هر ثانیه
        setInterval(updateTimer, 1000);
    }
    
    // 5. مدیریت سبد خرید و علاقه‌مندی‌ها
    function initCartAndWishlist() {
        let cartCount = parseInt(cartBadge.textContent) || 0;
        let wishlistCount = parseInt(wishlistBadge.textContent) || 0;
        
        window.addToCart = function(productId) {
            cartCount++;
            cartBadge.textContent = cartCount;
            
            showNotification(`✅ محصول ${productId} به سبد خرید اضافه شد!`);
            
            // ذخیره در localStorage
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            cartItems.push({
                id: productId,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        };
        
        window.addToWishlist = function(productId) {
            wishlistCount++;
            wishlistBadge.textContent = wishlistCount;
            
            showNotification(`❤️ محصول ${productId} به علاقه‌مندی‌ها اضافه شد!`);
            
            // ذخیره در localStorage
            const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
            wishlistItems.push({
                id: productId,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
        };
        
        window.viewProduct = function(productId) {
            window.location.href = `product.html?id=${productId}`;
        };
    }
    
    // 6. نمایش اعلان
    function showNotification(message) {
        // حذف اعلان قبلی اگر وجود دارد
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;
        
        // استایل اعلان
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #00b894, #00cec9);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        `;
        
        // استایل انیمیشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // حذف خودکار بعد از 3 ثانیه
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // 7. انیمیشن‌های ورود
    function initAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // مشاهده عناصر برای انیمیشن
        document.querySelectorAll('.category-card, .product-slide, .new-product-card').forEach(element => {
            observer.observe(element);
        });
    }
    
    // 8. بارگذاری اولیه داده‌ها
    function loadInitialData() {
        // بارگذاری تعداد سبد خرید از localStorage
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        if (cartItems.length > 0) {
            cartBadge.textContent = cartItems.length;
        }
        
        // بارگذاری تعداد علاقه‌مندی‌ها از localStorage
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
        if (wishlistItems.length > 0) {
            wishlistBadge.textContent = wishlistItems.length;
        }
        
        // نمایش پیام خوش‌آمد
        setTimeout(() => {
            console.log('✨ Tools Gallery آماده است!');
        }, 1000);
    }
    
    // 9. مدیریت فیلترها
    function initFilters() {
        const filterSelects = document.querySelectorAll('.filter-select');
        
        filterSelects.forEach(select => {
            select.addEventListener('change', function() {
                console.log(`فیلتر تغییر کرد: ${this.value}`);
                // در نسخه کامل، اینجا محصولات فیلتر می‌شوند
            });
        });
    }
    
    // 10. مدیریت لینک‌های هدر
    function initHeaderLinks() {
        const userIcons = document.querySelectorAll('.user-icon');
        
        userIcons.forEach(icon => {
            icon.addEventListener('click', function(e) {
                if (!this.getAttribute('href')) {
                    e.preventDefault();
                    showNotification('⚠️ این صفحه در حال توسعه است.');
                }
            });
        });
    }
    
    // راه‌اندازی همه قابلیت‌ها
    function initAll() {
        initMobileMenu();
        initSearch();
        initSlider();
        initTimer();
        initCartAndWishlist();
        initAnimations();
        initFilters();
        initHeaderLinks();
        loadInitialData();
    }
    
    // شروع
    initAll();
});

// توابع عمومی
function showAlert(message, type = 'info') {
    alert(message);
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' تومان';
    }
