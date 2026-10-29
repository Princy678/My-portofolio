/* ===================================================================
   PRINCY BHATT - PORTFOLIO INTERACTIVITY (script.js)
   BCA Student | School of Science and Technology, SRHU
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initParticleCanvas();
  initTypingEffect();
  initNavbar();
  initScrollProgress();
  initStatsCounter();
  initSkillBars();
  initProjectFilters();
  initTerminal();
  initProjectModal();
  initContactForm();
  initBackToTop();
});

/* -------------------------------------------------------------------
   1. THEME TOGGLER (DARK / LIGHT MODE)
   ------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
  const savedTheme = localStorage.getItem('pb_portfolio_theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('pb_portfolio_theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-moon';
      themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    }
  }
}

/* -------------------------------------------------------------------
   2. CUSTOM INTERACTIVE CURSOR
   ------------------------------------------------------------------- */
function initCustomCursor() {
  const cursor = document.querySelector('.custom-cursor');
  const cursorDot = document.querySelector('.custom-cursor-dot');
  
  if (!cursor || !cursorDot || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = -100, mouseY = -100;
  let cursorX = -100, cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth trailing animation
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Enlarge cursor over clickable elements
  const hoverElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .filter-btn');
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
      cursor.style.borderColor = 'var(--accent-secondary)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'var(--accent-primary)';
    });
  });
}

/* -------------------------------------------------------------------
   3. BACKGROUND PARTICLE CANVAS (CONSTELLATION EFFECT)
   ------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 65);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? 'rgba(99, 102, 241, 0.45)' : 'rgba(168, 85, 247, 0.55)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const lineColor = isLight ? '99, 102, 241' : '129, 140, 248';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${lineColor}, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }

  render();
}

/* -------------------------------------------------------------------
   4. DYNAMIC TYPING EFFECT
   ------------------------------------------------------------------- */
function initTypingEffect() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'BCA Student @ SRHU',
    'Frontend Web Developer',
    'Creative UI/UX Designer',
    'Aspiring Software Engineer',
    'Passionate Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;
  const deleteSpeed = 50;
  const holdDelay = 1800;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = holdDelay;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  type();
}

/* -------------------------------------------------------------------
   5. NAVBAR, SCROLL SPY & MOBILE MENU
   ------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Spy active state
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile drawer toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close when a nav link is clicked
    navItems.forEach((item) => {
      item.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
}

/* -------------------------------------------------------------------
   6. SCROLL PROGRESS BAR
   ------------------------------------------------------------------- */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.pageYOffset / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  });
}

/* -------------------------------------------------------------------
   7. ANIMATED STATS COUNTER
   ------------------------------------------------------------------- */
function initStatsCounter() {
  const statsElements = document.querySelectorAll('.stat-number');
  if (!statsElements.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statsElements.forEach((stat) => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const stepTime = Math.max(Math.floor(duration / (target || 1)), 20);

          const timer = setInterval(() => {
            count += Math.ceil(target / (duration / stepTime));
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = count + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
}

/* -------------------------------------------------------------------
   8. SKILL PROGRESS BARS (TRIGGER ON SCROLL)
   ------------------------------------------------------------------- */
function initSkillBars() {
  const skillCards = document.querySelectorAll('.skill-card');
  if (!skillCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fillBar = entry.target.querySelector('.skill-progress-fill');
        if (fillBar) {
          const progress = fillBar.getAttribute('data-progress');
          fillBar.style.width = `${progress}%`;
        }
      }
    });
  }, { threshold: 0.3 });

  skillCards.forEach((card) => observer.observe(card));
}

/* -------------------------------------------------------------------
   9. SKILLS & PROJECTS CATEGORY FILTER
   ------------------------------------------------------------------- */
function initProjectFilters() {
  // Skills filter
  const skillFilters = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      skillFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-skill-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Projects filter
  const projectFilters = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilters.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilters.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-project-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-project-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });
}

/* -------------------------------------------------------------------
   10. INTERACTIVE TERMINAL WIDGET ("Ask Princy / CLI")
   ------------------------------------------------------------------- */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalLog = document.getElementById('terminal-log');
  const terminalBody = document.querySelector('.terminal-body');
  const hintButtons = document.querySelectorAll('.terminal-hint-btn');

  if (!terminalInput || !terminalLog) return;

  const commandDatabase = {
    help: `Available commands:
• <span class="t-command">bio</span> - Brief overview about Princy
• <span class="t-command">education</span> - University & academic details
• <span class="t-command">skills</span> - Core programming and web technologies
• <span class="t-command">projects</span> - Top showcased software projects
• <span class="t-command">contact</span> - Email, phone and connection links
• <span class="t-command">clear</span> - Clean the terminal window`,

    bio: `Princy Bhatt is a tech enthusiast pursuing BCA at Swami Rama Himalayan University (SRHU), Dehradun. Driven by building clean, high-performance web applications and mastering computer science fundamentals.`,

    education: `🎓 Degree: Bachelor of Computer Applications (BCA)
🏛️ Institution: School of Science and Technology, Swami Rama Himalayan University (SRHU), Jolly Grant, Dehradun
📚 Key Focus: Data Structures, Web Development, DBMS, OOP, Software Engineering.`,

    skills: `⚡ Frontend: HTML5, CSS3, JavaScript (ES6+), Responsive UI/UX
💻 Languages: C, C++, Python, Core Java
🛠️ Tools & DB: Git, GitHub, MySQL, VS Code, Figma design`,

    projects: `🚀 1. Campus Connect (Student & Academics Portal)
🚀 2. FitTrack (Habit & Fitness Dashboard)
🚀 3. OmniShop (Modern E-Commerce Storefront)
🚀 4. DevFolio UI Design System
🚀 5. CodeQuiz (Interactive Programming Quiz App)`,

    contact: `📧 Email: princybhatt.dev@gmail.com
📍 Location: Dehradun, Uttarakhand, India
🔗 LinkedIn: linkedin.com/in/princy-bhatt
🐙 GitHub: github.com/princy-bhatt`,

    date: `Local Time: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
    quote: `"First, solve the problem. Then, write the code." — John Johnson`
  };

  function executeCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();

    // Append user input
    const userRow = document.createElement('div');
    userRow.innerHTML = `<span class="t-prompt">visitor@princy-bhatt:~$</span> <span class="t-command">${escapeHtml(cmd)}</span>`;
    terminalLog.appendChild(userRow);

    if (cleanCmd === 'clear') {
      terminalLog.innerHTML = '';
    } else if (cleanCmd === '') {
      // Empty input
    } else if (commandDatabase[cleanCmd]) {
      const respRow = document.createElement('div');
      respRow.className = 't-response';
      respRow.innerHTML = commandDatabase[cleanCmd];
      terminalLog.appendChild(respRow);
    } else {
      const errRow = document.createElement('div');
      errRow.className = 't-response';
      errRow.innerHTML = `Command not recognized: '<span style="color:#f87171">${escapeHtml(cleanCmd)}</span>'. Type <span class="t-command">help</span> for a list of valid commands.`;
      terminalLog.appendChild(errRow);
    }

    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    terminalInput.value = '';
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput.value);
    }
  });

  hintButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/* -------------------------------------------------------------------
   11. PROJECT DETAIL MODAL SYSTEM
   ------------------------------------------------------------------- */
function initProjectModal() {
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-description');
  const modalFeatures = document.getElementById('modal-features');
  const modalStack = document.getElementById('modal-stack');
  const modalDemoBtn = document.getElementById('modal-demo-btn');
  const modalGithubBtn = document.getElementById('modal-github-btn');

  const projectDetails = {
    'campus-connect': {
      title: 'Campus Connect - Academic Portal',
      category: 'Full-Stack Web App',
      description: 'An integrated student portal designed for Swami Rama Himalayan University students to manage academic schedules, track attendance, receive announcements, and download course notes in real-time.',
      features: [
        'Interactive Student Dashboard with attendance visualizer and GPA tracking',
        'Faculty Noticeboard with categorized announcements and filter options',
        'Study Material Vault with instant document search and download',
        'Fully responsive glassmorphism UI optimized for phones and tablets'
      ],
      stack: ['HTML5', 'CSS3 / Modern Grid', 'JavaScript ES6+', 'Local Database', 'Figma'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/campus-connect'
    },
    'fittrack': {
      title: 'FitTrack - Health & Daily Habit Tracker',
      category: 'Web Application',
      description: 'A comprehensive lifestyle companion that empowers users to monitor daily water intake, step milestones, calorie goals, and fitness streaks with local persistence and dynamic chart visualizers.',
      features: [
        'Dynamic milestone progress bars with celebratory animations',
        'Dark & light mode adaptation with smooth color grading',
        'Persistent offline support utilizing browser localStorage',
        'Exportable monthly health summaries in clean format'
      ],
      stack: ['HTML5', 'CSS3 Animations', 'JavaScript', 'Web Storage API'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/fittrack'
    },
    'omnishop': {
      title: 'OmniShop - Modern E-Commerce Platform',
      category: 'Web App & UI',
      description: 'An intuitive, fast-loading online store interface featuring live product search, category filtering, persistent shopping cart drawer, promo code discounts, and simulated checkout flow.',
      features: [
        'Real-time filter and instant search across product catalogue',
        'Interactive sliding slide-over cart with automatic total calculation',
        'Toast alerts for product addition, removal, and checkout confirmation',
        'Mobile-first responsive architecture tested across all screen resolutions'
      ],
      stack: ['HTML5', 'CSS Flexbox/Grid', 'JavaScript ES6', 'Rest API Mock'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/omnishop'
    },
    'devfolio': {
      title: 'DevFolio - Glassmorphic UI Component Library',
      category: 'UI/UX Design System',
      description: 'A reusable modular frontend component library crafted for developers, offering glassmorphic buttons, cards, modal dialogs, navigation bars, and inputs with accessible keyboard support.',
      features: [
        'Over 25+ hand-crafted UI components with copy-paste HTML/CSS snippets',
        'Fluid animations built purely with modern CSS transitions',
        'Accessible color contrast adhering to WCAG 2.1 AA standards',
        'Comprehensive documentation and live interactive playground'
      ],
      stack: ['Figma', 'CSS Custom Properties', 'HTML5 Semantic', 'JavaScript'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/devfolio-ui'
    },
    'codequiz': {
      title: 'CodeQuiz - Interactive CS Trivia & Learning App',
      category: 'EdTech App',
      description: 'An interactive computer science assessment application offering timed quizzes across C, C++, Python, Data Structures, and Web Development with detailed score breakdown and answer explanations.',
      features: [
        'Timed question rounds with visual countdown progress indicators',
        'Categorized quiz banks for BCA core subjects',
        'Comprehensive scorecard with correct answer reviews and performance analytics',
        'High-score leaderboard stored locally'
      ],
      stack: ['JavaScript ES6+', 'HTML5', 'CSS3', 'JSON Data'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/codequiz'
    },
    'weathersphere': {
      title: 'WeatherSphere - Live Global Weather App',
      category: 'API Web App',
      description: 'A weather forecasting interface that retrieves real-time temperature, humidity, wind speeds, and 5-day forecasts for any city worldwide using OpenWeather API with animated weather backgrounds.',
      features: [
        'Real-time global weather search with auto-suggest locations',
        'Dynamic weather animations based on current conditions (rain, sunny, clouds)',
        'Celsius / Fahrenheit temperature unit toggle',
        'UV index and wind speed metric gauges'
      ],
      stack: ['HTML5', 'CSS3 Glassmorphism', 'Vanilla JavaScript', 'OpenWeather API'],
      demoUrl: '#',
      githubUrl: 'https://github.com/princy-bhatt/weathersphere'
    }
  };

  const projectButtons = document.querySelectorAll('[data-project-id]');
  projectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project-id');
      const data = projectDetails[projectId];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalCategory.textContent = data.category;
      modalDesc.textContent = data.description;

      modalFeatures.innerHTML = '';
      data.features.forEach((feat) => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${feat}</span>`;
        modalFeatures.appendChild(li);
      });

      modalStack.innerHTML = '';
      data.stack.forEach((tech) => {
        const span = document.createElement('span');
        span.className = 'stack-chip';
        span.textContent = tech;
        modalStack.appendChild(span);
      });

      modalGithubBtn.href = data.githubUrl;

      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  if (modalDemoBtn) {
    modalDemoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Live preview active inside interactive portfolio!', 'info');
    });
  }
}

/* -------------------------------------------------------------------
   12. CONTACT FORM & VALIDATION
   ------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = form.querySelector('button[type="submit"]');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    // Validation
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Button loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
    submitBtn.disabled = true;

    // Simulate sending message
    setTimeout(() => {
      // Save to localStorage for demo
      const messages = JSON.parse(localStorage.getItem('pb_portfolio_messages') || '[]');
      messages.push({
        name,
        email,
        subject: subject || 'No Subject',
        message,
        date: new Date().toISOString()
      });
      localStorage.setItem('pb_portfolio_messages', JSON.stringify(messages));

      // Reset
      form.reset();
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      showToast(`Thank you ${name}! Your message has been sent to Princy Bhatt.`, 'success');
    }, 1200);
  });
}

/* -------------------------------------------------------------------
   13. TOAST NOTIFICATION UTILITY
   ------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : (type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-info');
  toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s forwards';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 3500);
}

/* -------------------------------------------------------------------
   14. BACK TO TOP BUTTON
   ------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

