/* =========================================================
   BASH ENTERPRISE — Shared Script
   Handles: mobile nav, scroll reveal, contact form validation
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  initMobileNav();
  initScrollReveal();
  initContactForm();
  initHeaderShadow();
});

/* ---------------- Mobile hamburger navigation ---------------- */
function initMobileNav() {
  const toggle = document.querySelector(".hamburger");
  const links = document.querySelector(".nav-links");
  const overlay = document.querySelector(".nav-overlay");

  if (!toggle || !links) return;

  function closeNav() {
    links.classList.remove("open");
    overlay && overlay.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openNav() {
    links.classList.add("open");
    overlay && overlay.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  toggle.addEventListener("click", function () {
    const isOpen = links.classList.contains("open");
    isOpen ? closeNav() : openNav();
  });

  overlay && overlay.addEventListener("click", closeNav);

  links.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 860) closeNav();
  });
}

/* ---------------- Sticky header subtle shadow on scroll ---------------- */
function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  function update() {
    if (window.scrollY > 8) {
      header.style.boxShadow = "0 8px 24px -16px rgba(10,35,66,0.35)";
    } else {
      header.style.boxShadow = "none";
    }
  }
  update();
  window.addEventListener("scroll", update, { passive: true });
}

/* ---------------- Scroll reveal for elements with .reveal ---------------- */
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach(function (el) { observer.observe(el); });
}

/* ---------------- Contact form validation ---------------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const statusBox = document.getElementById("form-status");

  const validators = {
    name: function (v) { return v.trim().length >= 2; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); },
    phone: function (v) { return v.trim().length >= 7; },
    subject: function (v) { return v.trim().length >= 2; },
    message: function (v) { return v.trim().length >= 10; }
  };

  const errorMessages = {
    name: "Please enter your full name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.",
    subject: "Please let us know the subject.",
    message: "Please enter a message of at least 10 characters."
  };

  function validateField(input) {
    const name = input.name;
    const fieldWrap = input.closest(".field");
    if (!validators[name]) return true;

    const isValid = validators[name](input.value);
    if (fieldWrap) {
      fieldWrap.classList.toggle("invalid", !isValid);
      const errorEl = fieldWrap.querySelector(".error-msg");
      if (errorEl) errorEl.textContent = errorMessages[name];
    }
    return isValid;
  }

  form.querySelectorAll("input, textarea").forEach(function (input) {
    input.addEventListener("blur", function () { validateField(input); });
    input.addEventListener("input", function () {
      const fieldWrap = input.closest(".field");
      if (fieldWrap && fieldWrap.classList.contains("invalid")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let allValid = true;

    form.querySelectorAll("input, textarea").forEach(function (input) {
      if (validators[input.name] && !validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      if (statusBox) {
        statusBox.textContent = "Please fix the highlighted fields and try again.";
        statusBox.style.background = "#fdecea";
        statusBox.style.color = "#c0392b";
        statusBox.classList.add("show");
      }
      return;
    }

    // No backend is connected yet — confirm receipt to the visitor.
    if (statusBox) {
      statusBox.textContent = "Thanks! Your message has been prepared. We'll get back to you shortly at " + form.email.value.trim() + ".";
      statusBox.style.background = "";
      statusBox.style.color = "";
      statusBox.classList.add("show");
    }
    form.reset();
  });
}
