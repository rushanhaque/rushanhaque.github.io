'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// certificate modal variables
const certCards = document.querySelectorAll(".certificate-card");
const certModalContainer = document.querySelector("[data-cert-modal-container]");
const certModalCloseBtn = document.querySelector("[data-cert-modal-close-btn]");
const certOverlay = document.querySelector("[data-cert-overlay]");
const certModalImg = document.querySelector("[data-cert-modal-img]");

// modal toggle function
const certModalFunc = function () {
  certModalContainer.classList.toggle("active");
  certOverlay.classList.toggle("active");
}

// add click event to all cert cards
for (let i = 0; i < certCards.length; i++) {
  certCards[i].addEventListener("click", function (e) {
    e.preventDefault(); // prevent opening in new tab
    certModalImg.src = this.href;
    certModalImg.alt = this.querySelector(".certificate-title").innerHTML;
    certModalFunc();
  });
}

// add click event to modal close button
if (certModalCloseBtn && certOverlay) {
  certModalCloseBtn.addEventListener("click", certModalFunc);
  certOverlay.addEventListener("click", certModalFunc);
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (form) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// sideways scroll for certificates
const certificatesList = document.querySelector(".certificates-list");
const prevBtn = document.querySelector(".arrow.prev");
const nextBtn = document.querySelector(".arrow.next");

if (certificatesList && prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    certificatesList.scrollBy({ left: -300, behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    certificatesList.scrollBy({ left: 300, behavior: "smooth" });
  });
}



// ====================================================
//  PREMIUM ENHANCEMENTS
// ====================================================


// PRELOADER
const preloader = document.getElementById('preloader');
if (preloader) {
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('loaded'), 350);
  });
}


// READING PROGRESS BAR
const progressBar = document.getElementById('progressBar');
if (progressBar) {
  const updateProgress = () => {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
}


// BACK TO TOP BUTTON
const backTopBtn = document.getElementById('backTopBtn');
if (backTopBtn) {
  window.addEventListener('scroll', () => {
    backTopBtn.classList.toggle('visible', window.scrollY > 280);
  }, { passive: true });

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


// SCROLL REVEAL (IntersectionObserver)
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
}

// Re-trigger reveals when switching tabs
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener('click', () => {
    setTimeout(() => {
      document.querySelectorAll('.active [data-reveal]:not(.revealed)').forEach(el => {
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        obs.observe(el);
      });
    }, 50);
  });
}


// CONTACT FORM — async submit with loading + feedback
const contactForm = document.querySelector('[data-form]');
const formSubmitBtn = document.querySelector('[data-form-btn]');

if (contactForm && formSubmitBtn) {
  const successMsg = document.createElement('div');
  successMsg.className = 'form-feedback success';
  successMsg.innerHTML = `<ion-icon name="checkmark-circle-outline" style="font-size:18px;flex-shrink:0"></ion-icon>
    <span>Message sent! I'll get back to you soon.</span>`;

  const errorMsg = document.createElement('div');
  errorMsg.className = 'form-feedback error';
  errorMsg.innerHTML = `<ion-icon name="alert-circle-outline" style="font-size:18px;flex-shrink:0"></ion-icon>
    <span>Something went wrong. Please try again.</span>`;

  contactForm.insertAdjacentElement('afterend', errorMsg);
  contactForm.insertAdjacentElement('afterend', successMsg);

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSubmitBtn.classList.add('loading');
    successMsg.classList.remove('visible');
    errorMsg.classList.remove('visible');

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        successMsg.classList.add('visible');
        contactForm.reset();
        formSubmitBtn.setAttribute('disabled', '');
      } else {
        errorMsg.classList.add('visible');
      }
    } catch (_) {
      errorMsg.classList.add('visible');
    } finally {
      formSubmitBtn.classList.remove('loading');
    }
  });
}


