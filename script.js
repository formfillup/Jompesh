/* ============================================================
   Job data — shared by index.html (modal) and apply.html
   ============================================================ */
const JOBS = {
  "data-entry-operator": {
    title: "Data Entry Operator",
    salary: "৳18,000 – ৳25,000 / month",
    arrangement: "Remote",
    schedule: "Full-time",
    hours: "9:00 AM – 6:00 PM",
    experience: "0–1 Year",
    positions: "30 Openings",
    description: [
      "As a Data Entry Operator at Jompesh, you'll be responsible for accurately processing, organizing, and maintaining records for our operations team. This role is well suited to someone who is detail-oriented, comfortable working independently, and confident with basic office software.",
      "You'll work closely with a small remote team, receive clear daily targets, and have room to grow into more senior data and operations roles as you build a track record."
    ],
    requirements: [
      "Comfortable using spreadsheets and basic data entry software",
      "Strong attention to detail and accuracy under deadlines",
      "Reliable internet connection and a personal computer",
      "Good written communication in English and Bengali",
      "Ability to work independently with minimal supervision"
    ]
  },
  "telemarketing-executive": {
    title: "International Telemarketing Executive",
    salary: "৳25,000 – ৳35,000 / month",
    arrangement: "Remote",
    schedule: "Full-time",
    hours: "Evening / Night Shift (Client Timezone)",
    experience: "1+ Year Preferred",
    positions: "35 Openings",
    description: [
      "As an International Telemarketing Executive, you'll speak directly with clients abroad, build genuine rapport quickly, and guide conversations toward clear outcomes. This role rewards confidence, clarity, and persistence.",
      "You'll be supported with scripts, live coaching, and a target structure designed to help you grow your earnings as you grow your skill."
    ],
    requirements: [
      "Fluent, confident spoken English",
      "Prior calling, sales, or customer service experience preferred",
      "Comfortable working evening or night shifts aligned to client timezones",
      "Resilient, positive attitude when facing objections",
      "Reliable internet connection and a quiet calling environment"
    ]
  }
};

/* ============================================================
   Navbar scroll state + mobile menu
   ============================================================ */
const navbar = document.getElementById("navbar");
if (navbar) {
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburgerBtn && mobileMenu) {
  const openMobileMenu = () => {
    mobileMenu.classList.add("open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenu.classList.add("is-visible");
      });
    });
  };

  const closeMobileMenu = () => {
    if (!mobileMenu.classList.contains("open")) return;
    mobileMenu.classList.remove("is-visible");
    let closed = false;
    const finish = () => { mobileMenu.classList.remove("open"); };
    const onTransitionEnd = (e) => {
      if (e.target !== mobileMenu || e.propertyName !== "opacity") return;
      closed = true;
      mobileMenu.removeEventListener("transitionend", onTransitionEnd);
      finish();
    };
    mobileMenu.addEventListener("transitionend", onTransitionEnd);
    setTimeout(() => {
      if (!closed) {
        mobileMenu.removeEventListener("transitionend", onTransitionEnd);
        finish();
      }
    }, 350);
  };

  hamburgerBtn.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });
  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}

/* ============================================================
   Scroll reveal
   ============================================================ */
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 6, 5) * 70}ms`;
    io.observe(el);
  });
}

/* ============================================================
   Job details modal (index.html only)
   ============================================================ */
const modalOverlay = document.getElementById("modalOverlay");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");

function renderJobModal(jobKey) {
  const job = JOBS[jobKey];
  if (!job || !modalBody) return;

  modalBody.innerHTML = `
    <span class="eyebrow">Job Opportunity</span>
    <h2>${job.title}</h2>
    <div class="info-grid">
      <div class="info-card"><span>Salary</span><b>${job.salary}</b></div>
      <div class="info-card"><span>Work Arrangement</span><b>${job.arrangement}</b></div>
      <div class="info-card"><span>Schedule</span><b>${job.schedule}</b></div>
      <div class="info-card"><span>Working Hours</span><b>${job.hours}</b></div>
      <div class="info-card"><span>Experience</span><b>${job.experience}</b></div>
      <div class="info-card"><span>Available Positions</span><b>${job.positions}</b></div>
    </div>
    <div class="modal-desc">
      <h4>About the Role</h4>
      ${job.description.map(p => `<p>${p}</p>`).join("")}
      <h4>Requirements</h4>
      <ul>${job.requirements.map(r => `<li>${r}</li>`).join("")}</ul>
    </div>
    <a href="apply.html?job=${jobKey}" class="btn btn-primary modal-apply">Apply for this Position →</a>
  `;
}

function openModal(jobKey) {
  renderJobModal(jobKey);
  // Step 1: take it out of `display:none` so it's actually in the layout.
  modalOverlay.classList.add("open");
  document.body.classList.add("modal-locked");
  // Step 2: on the next frame (after the browser has painted the
  // display:flex state), add the class that fades/scales it in —
  // this is what lets it animate instead of just popping into view.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modalOverlay.classList.add("is-visible");
    });
  });
}

function closeModal() {
  // Step 1: fade/scale out.
  modalOverlay.classList.remove("is-visible");
  document.body.classList.remove("modal-locked");
  // Step 2: once the fade finishes, set display:none again so the
  // modal stops occupying any space (and can't be focused/read)
  // while hidden. Falls back to a timeout if transitionend is missed.
  const finishClose = () => {
    modalOverlay.classList.remove("open");
  };
  let closed = false;
  const onTransitionEnd = (e) => {
    if (e.target !== modalOverlay || e.propertyName !== "opacity") return;
    closed = true;
    modalOverlay.removeEventListener("transitionend", onTransitionEnd);
    finishClose();
  };
  modalOverlay.addEventListener("transitionend", onTransitionEnd);
  setTimeout(() => {
    if (!closed) {
      modalOverlay.removeEventListener("transitionend", onTransitionEnd);
      finishClose();
    }
  }, 350);
}

if (modalOverlay) {
  document.querySelectorAll(".view-details-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.job));
  });
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

/* ============================================================
   Application form (apply.html only)
   ============================================================ */
const applyForm = document.getElementById("applyForm");
if (applyForm) {
  const params = new URLSearchParams(window.location.search);
  const jobKey = params.get("job");
  const job = JOBS[jobKey] || JOBS["data-entry-operator"];

  const positionField = document.getElementById("positionField");
  const applyingForLabel = document.getElementById("applyingForLabel");
  if (positionField) positionField.value = job.title;
  if (applyingForLabel) applyingForLabel.textContent = `Applying for: ${job.title}`;

  /* ---------- CV / resume upload ---------- */
  const resumeInput = document.getElementById("resume");
  const uploadZone = document.getElementById("uploadZone");
  const resumeFileName = document.getElementById("resumeFileName");
  const RESUME_MAX_BYTES = 5 * 1024 * 1024;
  const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"];

  function isValidResume(file) {
    if (!file) return false;
    const name = file.name.toLowerCase();
    const hasValidExt = RESUME_EXTENSIONS.some(ext => name.endsWith(ext));
    return hasValidExt && file.size <= RESUME_MAX_BYTES;
  }

  function updateResumeUI(file) {
    if (file) {
      uploadZone.classList.add("has-file");
      resumeFileName.textContent = file.name;
    } else {
      uploadZone.classList.remove("has-file");
      resumeFileName.textContent = "";
    }
  }

  if (resumeInput && uploadZone) {
    resumeInput.addEventListener("change", () => {
      updateResumeUI(resumeInput.files[0]);
      uploadZone.closest(".field").classList.remove("invalid");
    });

    ["dragover", "dragleave", "drop"].forEach(evt => {
      uploadZone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    uploadZone.addEventListener("dragover", () => uploadZone.classList.add("dragover"));
    uploadZone.addEventListener("dragleave", () => uploadZone.classList.remove("dragover"));
    uploadZone.addEventListener("drop", (e) => {
      uploadZone.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file) {
        resumeInput.files = e.dataTransfer.files;
        updateResumeUI(file);
        uploadZone.closest(".field").classList.remove("invalid");
      }
    });
  }

  /* ---------- Submit / validation ---------- */
  applyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    applyForm.querySelectorAll("[required]").forEach(input => {
      const field = input.closest(".field");
      let invalid;

      if (input.type === "file") {
        invalid = !isValidResume(input.files[0]);
      } else {
        const isEmpty = !input.value.trim();
        const isBadEmail = input.type === "email" && input.value && !/^\S+@\S+\.\S+$/.test(input.value);
        invalid = isEmpty || isBadEmail;
      }

      if (invalid) {
        field.classList.add("invalid");
        valid = false;
      } else {
        field.classList.remove("invalid");
      }
    });

    if (!valid) return;

    window.location.href = "thankyou.html";
  });

  applyForm.querySelectorAll("[required]").forEach(input => {
    const evt = input.type === "file" ? "change" : "input";
    input.addEventListener(evt, () => {
      input.closest(".field").classList.remove("invalid");
    });
  });
}
