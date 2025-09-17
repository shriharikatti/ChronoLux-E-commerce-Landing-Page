// DOM Elements
const carouselTrack = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const thumbnails = document.querySelectorAll('.thumbnail');
const toggleDetailsBtn = document.getElementById('toggleDetails');
const productDetails = document.getElementById('productDetails');
const slides = document.querySelectorAll('.carousel-slide');
const optionButtons = document.querySelectorAll('.option-btn');
const addToCartBtn = document.querySelector('.add-to-cart');
const wishlistBtn = document.querySelector('.wishlist');

// 🎯 SUPER SIMPLE & RELIABLE CAROUSEL MANAGER
class CarouselManager {
  constructor() {
    this.currentIndex = 0;
    this.totalSlides = slides.length;
    this.isTransitioning = false;
    this.autoPlayInterval = null;

    console.log(`🎠 Carousel initialized with ${this.totalSlides} slides`);
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.showSlide(0); // Show first slide immediately
    this.startAutoPlay();
  }

  setupEventListeners() {
    // Previous/Next buttons
    prevBtn?.addEventListener('click', () => this.previousSlide());
    nextBtn?.addEventListener('click', () => this.nextSlide());

    // Thumbnail clicks
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', () => {
        console.log(`🖼️ Thumbnail ${index + 1} clicked`);
        this.goToSlide(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch support
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    let startX = 0;
    let endX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      this.pauseAutoPlay();
    });

    carouselTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.nextSlide();
        } else {
          this.previousSlide();
        }
      }
      this.startAutoPlay();
    });
  }

  showSlide(index) {
    if (this.isTransitioning) return;

    console.log(`🎯 Showing slide ${index + 1}/${this.totalSlides}`);

    this.isTransitioning = true;
    this.currentIndex = index;

    // Update slides
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Reset transition lock
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;
    console.log(`➡️ Next slide: ${nextIndex + 1}`);
    this.showSlide(nextIndex);
    this.resetAutoPlay();
  }

  previousSlide() {
    const prevIndex =
      this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
    console.log(`⬅️ Previous slide: ${prevIndex + 1}`);
    this.showSlide(prevIndex);
    this.resetAutoPlay();
  }

  goToSlide(index) {
    if (index !== this.currentIndex) {
      this.showSlide(index);
      this.resetAutoPlay();
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  pauseAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  resetAutoPlay() {
    this.pauseAutoPlay();
    this.startAutoPlay();
  }
}

// 🛡️ Image Error Handler
class ImageManager {
  constructor() {
    this.setupImageErrorHandling();
  }

  setupImageErrorHandling() {
    document.addEventListener(
      'error',
      (e) => {
        if (e.target.tagName === 'IMG') {
          console.warn('❌ Image failed to load:', e.target.src);
          this.handleBrokenImage(e.target);
        }
      },
      true
    );
  }

  handleBrokenImage(img) {
    const isCarousel = img.closest('.carousel-slide');
    const isThumbnail = img.closest('.thumbnail');

    if (isCarousel) {
      const slideIndex = Array.from(slides).indexOf(
        img.closest('.carousel-slide')
      );
      img.src = `https://via.placeholder.com/600x600/667eea/ffffff?text=Watch+${
        slideIndex + 1
      }`;
    } else if (isThumbnail) {
      const thumbIndex = Array.from(thumbnails).indexOf(
        img.closest('.thumbnail')
      );
      img.src = `https://via.placeholder.com/100x100/764ba2/ffffff?text=${
        thumbIndex + 1
      }`;
    }
  }
}

// 📋 Details Toggle
class DetailsManager {
  constructor() {
    this.isOpen = false;
    this.init();
  }

  init() {
    toggleDetailsBtn?.addEventListener('click', () => this.toggleDetails());
  }

  toggleDetails() {
    this.isOpen = !this.isOpen;

    productDetails.classList.toggle('active', this.isOpen);
    toggleDetailsBtn.classList.toggle('active', this.isOpen);

    const buttonText = toggleDetailsBtn.querySelector('span');
    const buttonIcon = toggleDetailsBtn.querySelector('i');

    if (this.isOpen) {
      buttonText.textContent = 'Hide Specifications';
      buttonIcon.style.transform = 'rotate(180deg)';

      setTimeout(() => {
        productDetails.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 300);
    } else {
      buttonText.textContent = 'View Specifications';
      buttonIcon.style.transform = 'rotate(0deg)';
    }
  }
}

// ⚙️ Options Manager
class OptionsManager {
  constructor() {
    this.selectedOptions = {
      'case material': 'Titanium',
      strap: 'Leather',
    };
    this.init();
  }

  init() {
    optionButtons.forEach((button) => {
      button.addEventListener('click', (e) => this.selectOption(e));
    });
  }

  selectOption(e) {
    const button = e.target;
    const optionGroup = button.closest('.option-group');
    const label = optionGroup
      .querySelector('label')
      .textContent.replace(':', '')
      .toLowerCase();

    // Remove active from siblings
    optionGroup.querySelectorAll('.option-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // Add active to clicked button
    button.classList.add('active');
    this.selectedOptions[label] = button.textContent;

    // Update price
    this.updatePrice();

    // Visual feedback
    button.style.transform = 'scale(0.95)';
    setTimeout(() => (button.style.transform = ''), 150);
  }

  updatePrice() {
    const priceElement = document.querySelector('.current-price');
    let basePrice = 2999;

    // Price adjustments
    if (this.selectedOptions['case material'] === 'Gold') basePrice += 1000;
    if (this.selectedOptions['case material'] === 'Steel') basePrice -= 200;
    if (this.selectedOptions['strap'] === 'Metal') basePrice += 150;
    if (this.selectedOptions['strap'] === 'Rubber') basePrice -= 100;

    // Animate price change
    priceElement.style.transform = 'scale(1.1)';
    priceElement.style.color = '#e74c3c';

    setTimeout(() => {
      priceElement.textContent = `$${basePrice.toLocaleString()}`;
      priceElement.style.transform = '';
      priceElement.style.color = '';
    }, 200);
  }
}

// 🎮 Interaction Manager
class InteractionManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupCartButton();
    this.setupWishlistButton();
  }

  setupCartButton() {
    addToCartBtn?.addEventListener('click', () => {
      const originalText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Adding...';
      addToCartBtn.disabled = true;

      setTimeout(() => {
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        addToCartBtn.style.background =
          'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';

        setTimeout(() => {
          addToCartBtn.innerHTML = originalText;
          addToCartBtn.style.background = '';
          addToCartBtn.disabled = false;
        }, 2000);
      }, 1500);

      // Animate to cart
      this.animateToCart();
    });
  }

  setupWishlistButton() {
    let isWishlisted = false;

    wishlistBtn?.addEventListener('click', () => {
      isWishlisted = !isWishlisted;
      const icon = wishlistBtn.querySelector('i');

      if (isWishlisted) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        wishlistBtn.style.color = '#e74c3c';
        wishlistBtn.style.borderColor = '#e74c3c';
      } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        wishlistBtn.style.color = '';
        wishlistBtn.style.borderColor = '';
      }

      wishlistBtn.style.transform = 'scale(1.2)';
      setTimeout(() => (wishlistBtn.style.transform = ''), 200);
    });
  }

  animateToCart() {
    const floatingItem = document.createElement('div');
    floatingItem.style.cssText = `
            position: fixed;
            width: 50px;
            height: 50px;
            background: var(--primary-gradient);
            border-radius: 50%;
            z-index: 9999;
            pointer-events: none;
            transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
        `;

    const buttonRect = addToCartBtn.getBoundingClientRect();
    floatingItem.style.left = buttonRect.left + 'px';
    floatingItem.style.top = buttonRect.top + 'px';

    document.body.appendChild(floatingItem);

    setTimeout(() => {
      const cartIcon = document.querySelector('.fa-shopping-cart');
      const cartRect = cartIcon.getBoundingClientRect();

      floatingItem.style.left = cartRect.left + 'px';
      floatingItem.style.top = cartRect.top + 'px';
      floatingItem.style.transform = 'scale(0)';
      floatingItem.style.opacity = '0';
    }, 100);

    setTimeout(() => {
      document.body.removeChild(floatingItem);
    }, 1100);
  }
}

// 🚀 Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 ChronoLux Loading...');

  // Initialize all managers
  const carousel = new CarouselManager();
  const imageManager = new ImageManager();
  const details = new DetailsManager();
  const options = new OptionsManager();
  const interactions = new InteractionManager();

  // Easter egg
  let clickCount = 0;
  document.querySelector('.nav-logo')?.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
      document.body.style.animation = 'pulse 0.5s ease-in-out';
      setTimeout(() => {
        document.body.style.animation = '';
        clickCount = 0;
      }, 500);
    }
  });

  console.log('✅ All systems loaded!');
  console.log('🎯 Carousel should now work perfectly!');
  console.log('💡 Use arrow keys, click thumbnails, or navigation buttons');
  console.log('🎉 Try clicking the logo 5 times for a surprise!');
});
