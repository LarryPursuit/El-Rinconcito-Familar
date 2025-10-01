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

// Initialize carousel when page loads
document.addEventListener("DOMContentLoaded", function () {
  new ImageCarousel();
});

// Simple navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  } else {
    navbar.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  }
});
