// Image Carousel Functionality
class ImageCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll(".carousel-item");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.autoRotateInterval = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startAutoRotate();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    this.dots.forEach((dot, index) => {
      dot.addEventListener("click", () => this.goToSlide(index));
    });

    const carouselContainer = document.querySelector(".carousel-container");
    carouselContainer.addEventListener("mouseenter", () =>
      this.stopAutoRotate()
    );
    carouselContainer.addEventListener("mouseleave", () =>
      this.startAutoRotate()
    );
  }

  updateSlide() {
    this.slides.forEach((slide, index) => {
      slide.classList.remove("active");
      if (index === this.currentSlide) {
        slide.classList.add("active");
      }
    });

    this.dots.forEach((dot, index) => {
      dot.classList.remove("active");
      if (index === this.currentSlide) {
        dot.classList.add("active");
      }
    });
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlide();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
  }

  goToSlide(slideIndex) {
    this.currentSlide = slideIndex;
    this.updateSlide();
  }

  startAutoRotate() {
    this.stopAutoRotate();
    this.autoRotateInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Image Modal Functionality
class ImageModal {
  constructor() {
    this.modal = document.getElementById("imageModal");
    this.modalImage = document.getElementById("modalImage");
    this.modalTitle = document.getElementById("modalTitle");
    this.modalDescription = document.getElementById("modalDescription");
    this.closeBtn = document.querySelector(".close-modal");
    this.isOpen = false;
    this.lastClickedRect = null; // Store position of the clicked image

    if (this.modal && this.modalImage && this.modalTitle && this.modalDescription && this.closeBtn) {
      this.init();
    }
  }

  init() {
    this.setupEventListeners();
    this.addClickListenersToCarouselImages();
  }

  setupEventListeners() {
    // Close modal when clicking the X button
    this.closeBtn.addEventListener("click", () => this.closeModal());

    // Close modal when clicking outside the modal content
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "block") {
        this.closeModal();
      }
    });
  }

  addClickListenersToCarouselImages() {
    const carousel = document.querySelector(".carousel");
    if (!carousel) return;

    carousel.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG" && e.target.closest(".carousel-item")) {
        e.preventDefault();
        if (this.isOpen) return;

        const carouselItem = e.target.closest(".carousel-item");
        const title = carouselItem.querySelector("h3").textContent;
        const description = carouselItem.querySelector("p").textContent;
        const imageSrc = e.target.src;
        const imageAlt = e.target.alt;
        this.openModal(e.target, imageSrc, imageAlt, title, description);
      }
    });
  }

  openModal(clickedImage, imageSrc, imageAlt, title, description) {
    if (this.isOpen) return;
    this.isOpen = true;

    this.lastClickedRect = clickedImage.getBoundingClientRect();

    const animator = this.modal.querySelector('.modal-animator');

    animator.style.left = `${this.lastClickedRect.left}px`;
    animator.style.top = `${this.lastClickedRect.top}px`;
    animator.style.width = `${this.lastClickedRect.width}px`;
    animator.style.height = `${this.lastClickedRect.height}px`;
    animator.style.transition = 'none';

    this.modalImage.src = imageSrc;
    this.modalImage.alt = imageAlt;
    this.modalTitle.textContent = title;
    this.modalDescription.textContent = description;

    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      animator.style.transition = 'transform 0.5s ease, border-radius 0.5s ease';
      animator.style.opacity = '1';

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scaleX = viewportWidth / this.lastClickedRect.width;
      const scaleY = viewportHeight / this.lastClickedRect.height;
      const scale = Math.max(scaleX, scaleY) * 1.2;

      const translateX = (viewportWidth / 2) - (this.lastClickedRect.left + this.lastClickedRect.width / 2);
      const translateY = (viewportHeight / 2) - (this.lastClickedRect.top + this.lastClickedRect.height / 2);

      animator.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
      animator.style.borderRadius = '10px';

      setTimeout(() => {
        this.modal.querySelector('.modal-content').style.opacity = '1';
      }, 300);
    });
  }

  closeModal() {
    if (!this.isOpen) return;
    this.isOpen = false;

    const animator = this.modal.querySelector('.modal-animator');

    this.modal.querySelector('.modal-content').style.opacity = '0';

    setTimeout(() => {
      animator.style.transition = 'transform 0.5s ease, border-radius 0.5s ease, opacity 0.3s ease 0.2s';
      animator.style.transform = 'none';
      animator.style.borderRadius = '50%';
      animator.style.left = `${this.lastClickedRect.left}px`;
      animator.style.top = `${this.lastClickedRect.top}px`;
      animator.style.width = `${this.lastClickedRect.width}px`;
      animator.style.height = `${this.lastClickedRect.height}px`;
      animator.style.opacity = '0';

      setTimeout(() => {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }, 500);
    }, 50);
  }
}

// Initialize carousel and modal when page loads
document.addEventListener("DOMContentLoaded", function () {
  new ImageCarousel();
  new ImageModal();
});

// Simple navbar scroll effect
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (navbar) { // Check if navbar exists before using it
    if (window.scrollY > 50) {
      navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
    } else {
      navbar.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
    }
  }
});
