const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback, { once: true });
  } else {
    callback();
  }
};

ready(() => {
  const refreshIcons = () => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  };

  refreshIcons();

  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");
  const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
  const motionToggle = document.querySelector("[data-motion-toggle]");
  const finderForm = document.querySelector("[data-finder-form]");
  const finderNote = document.querySelector("[data-finder-note]");
  const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
  const destinationCards = Array.from(document.querySelectorAll("[data-group]"));
  const mapPins = Array.from(document.querySelectorAll("[data-map-target]"));
  const mapRegion = document.querySelector("[data-map-region]");
  const mapTitle = document.querySelector("[data-map-title]");
  const mapCopy = document.querySelector("[data-map-copy]");
  const mapMeta = document.querySelector("[data-map-meta]");
  const testimonialTrack = document.querySelector("[data-testimonial-track]");
  const testimonials = testimonialTrack ? Array.from(testimonialTrack.querySelectorAll(".testimonial")) : [];
  const prevTestimonial = document.querySelector("[data-testimonial-prev]");
  const nextTestimonial = document.querySelector("[data-testimonial-next]");
  const consultForm = document.querySelector("[data-consult-form]");
  const formStatus = document.querySelector("[data-form-status]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeNavigation = () => {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      navToggle.innerHTML = '<i data-lucide="menu"></i>';
      refreshIcons();
    }
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      navToggle.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      refreshIcons();
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        closeNavigation();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeNavigation();
    }
  });

  if (motionToggle) {
    motionToggle.addEventListener("click", () => {
      const paused = document.body.classList.toggle("motion-paused");
      motionToggle.setAttribute("aria-label", paused ? "Play hero motion" : "Pause hero motion");
      motionToggle.innerHTML = paused ? '<i data-lucide="play"></i>' : '<i data-lucide="pause"></i>';
      refreshIcons();
    });
  }

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  const revealVisibleItems = () => {
    revealItems.forEach((item) => {
      if (item.classList.contains("is-visible")) return;
      if (item.getBoundingClientRect().top < window.innerHeight * 0.94) {
        item.classList.add("is-visible");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
    revealVisibleItems();
    window.addEventListener("scroll", revealVisibleItems, { passive: true });
    window.addEventListener("resize", revealVisibleItems);
    window.setTimeout(revealVisibleItems, 650);
    const revealTimer = window.setInterval(() => {
      revealVisibleItems();
      if (revealItems.every((item) => item.classList.contains("is-visible"))) {
        window.clearInterval(revealTimer);
      }
    }, 450);
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = navLinks
    .map((link) => {
      const target = document.querySelector(link.getAttribute("href"));
      return target ? { link, target } : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => link.classList.remove("is-active"));
          const active = sections.find((section) => section.target === entry.target);
          if (active) active.link.classList.add("is-active");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.02 }
    );

    sections.forEach(({ target }) => activeObserver.observe(target));
  }

  if (finderForm && finderNote) {
    finderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(finderForm);
      const destination = data.get("destination");
      const program = data.get("program");
      const intake = data.get("intake");
      finderNote.textContent = `${program} planning for ${destination} in ${intake}: start with profile diagnostics, eligibility checks, and a three-tier university list.`;
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");

      destinationCards.forEach((card) => {
        const groups = card.dataset.group.split(" ");
        card.classList.toggle("is-hidden", filter !== "all" && !groups.includes(filter));
      });
    });
  });

  const destinationInsights = {
    uk: {
      region: "Europe",
      title: "United Kingdom",
      copy: "Focused degrees, one-year masters, strong global recognition, and city-led career exploration.",
      meta: "Best for: focused programs, brand recognition, faster postgraduate timelines"
    },
    canada: {
      region: "North America",
      title: "Canada",
      copy: "Academic quality, co-op pathways, and a student experience that rewards early planning around costs and eligibility.",
      meta: "Best for: settlement pathways, co-op options, balanced budgets"
    },
    usa: {
      region: "North America",
      title: "United States",
      copy: "Deep specialization, research access, and broad campus choice for students with a strong application narrative.",
      meta: "Best for: research, scholarships, flexible academic exploration"
    },
    germany: {
      region: "Europe",
      title: "Germany",
      copy: "Value-led public education with strong technical pathways when language, prerequisites, and timing are handled early.",
      meta: "Best for: engineering, value-led study, structured documentation"
    },
    ireland: {
      region: "Europe",
      title: "Ireland",
      copy: "A compact market with strong technology, business, healthcare, and applied postgraduate opportunities.",
      meta: "Best for: industry access, applied masters, practical city networks"
    },
    australia: {
      region: "Oceania",
      title: "Australia",
      copy: "Practical learning, flexible intakes, vibrant cities, and strong student support for career-aligned programs.",
      meta: "Best for: flexible intakes, applied learning, student lifestyle"
    }
  };

  const setMapInsight = (target) => {
    const insight = destinationInsights[target];
    if (!insight || !mapRegion || !mapTitle || !mapCopy || !mapMeta) return;
    mapPins.forEach((pin) => pin.classList.toggle("is-active", pin.dataset.mapTarget === target));
    mapRegion.textContent = insight.region;
    mapTitle.textContent = insight.title;
    mapCopy.textContent = insight.copy;
    mapMeta.textContent = insight.meta;
  };

  mapPins.forEach((pin) => {
    pin.addEventListener("click", () => setMapInsight(pin.dataset.mapTarget));
    pin.addEventListener("mouseenter", () => setMapInsight(pin.dataset.mapTarget));
  });

  let testimonialIndex = 0;
  const showTestimonial = (index) => {
    if (!testimonials.length) return;
    testimonialIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((testimonial, itemIndex) => {
      testimonial.classList.toggle("is-active", itemIndex === testimonialIndex);
    });
  };

  if (testimonials.length) {
    prevTestimonial?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
    nextTestimonial?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));

    let autoAdvance = window.setInterval(() => showTestimonial(testimonialIndex + 1), 6800);
    testimonialTrack.addEventListener("mouseenter", () => window.clearInterval(autoAdvance));
    testimonialTrack.addEventListener("mouseleave", () => {
      autoAdvance = window.setInterval(() => showTestimonial(testimonialIndex + 1), 6800);
    });
  }

  if (consultForm && formStatus) {
    consultForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!consultForm.checkValidity()) {
        consultForm.reportValidity();
        return;
      }

      const formData = new FormData(consultForm);
      const name = String(formData.get("name") || "there").trim().split(" ")[0];
      formStatus.textContent = `Thank you, ${name}. Your enquiry is ready for the OneDegreeAdvisory team.`;
      consultForm.reset();
    });
  }
});
