// --- 1. EMAILJS LOGIC ---
(function () {
  // Use keys from config.js
  if (typeof CONFIG !== "undefined" && emailjs) {
    emailjs.init(CONFIG.EMAILJS_PUBLIC_KEY);
  } else {
    console.error("Config or EmailJS not loaded properly.");
  }
})();

const contactForm = document.getElementById("contact-form");
const submitBtn = document.getElementById("submit-btn");

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();
    submitBtn.innerText = "Sending...";

    const serviceID = CONFIG.EMAILJS_SERVICE_ID;
    const templateID = CONFIG.EMAILJS_TEMPLATE_ID;

    emailjs.sendForm(serviceID, templateID, this).then(
      () => {
        submitBtn.innerText = "Sent!";
        alert("Message sent successfully!");
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = "Send Message";
        }, 3000);
      },
      (err) => {
        submitBtn.innerText = "Send Message";
        alert(JSON.stringify(err));
        console.error("EmailJS Error:", err);
      }
    );
  });
}

// --- 2. ANIMATIONS & THEME LOGIC ---
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// --- THEME SWITCHING LOGIC ---
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

if (toggleBtn) {
  const icon = toggleBtn.querySelector("i");
  const currentTheme = localStorage.getItem("theme");

  // Function to update images based on theme
  const updateThemeImages = (isLight) => {
    const themeImages = document.querySelectorAll(".theme-img");
    themeImages.forEach((img) => {
      const newSrc = isLight
        ? img.getAttribute("data-light")
        : img.getAttribute("data-dark");
      if (newSrc) img.src = newSrc;
    });
  };

  // Check Local Storage on Load
  if (currentTheme === "light") {
    body.classList.add("light-mode");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    updateThemeImages(true); // Load light images
  } else {
    updateThemeImages(false); // Load dark images
  }

  // Toggle Event Listener
  toggleBtn.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");

    if (isLight) {
      icon.classList.remove("fa-sun");
      icon.classList.add("fa-moon");
      localStorage.setItem("theme", "light");
      updateThemeImages(true); // Switch to light images
    } else {
      icon.classList.remove("fa-moon");
      icon.classList.add("fa-sun");
      localStorage.setItem("theme", "dark");
      updateThemeImages(false); // Switch to dark images
    }
  });
}
