document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // THEME TOGGLE LOGIC
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const html = document.documentElement;

    // Always default to light mode on refresh
    html.setAttribute('data-theme', 'light');
    localStorage.removeItem('theme'); // Clear any saved preference to ensure light mode next time too

    // Toggle theme function
    const toggleTheme = () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Desktop theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Mobile theme toggle
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // ============================================
    // MOBILE MENU LOGIC
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-links a');

    // Open mobile menu
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    const closeMobileMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ============================================
    // PRELOADER LOGIC
    // ============================================
    // Premium Preloader Logic
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.loader-progress-bar');
    const percentage = document.querySelector('.loader-percentage');

    if (preloader) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 5;
            if (progress > 100) progress = 100;

            if (progressBar) progressBar.style.width = `${progress}%`;
            if (percentage) percentage.textContent = `${Math.floor(progress)}%`;

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    // Optional: Trigger other entrance animations here
                }, 500);
            }
        }, 30); // Adjust speed here
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Scroll Progress Bar
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        scrollProgress.style.transform = `scaleX(${scrolled / 100})`;
    });

    // Enhanced Intersection Observer with stagger effect
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('aos-visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll(
        '.service-card, .project-card, .testimonial-card, .about-text, .stats-card, .faq-item, .exp-item'
    );

    animatedElements.forEach((el) => {
        el.classList.add('aos-animate');
        observer.observe(el);
    });

    document.body.classList.add('aos-ready');

    // Counter Animation for Stats
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + '+';
            }
        }, 16);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (number) {
                        stat.textContent = '0+';
                        animateCounter(stat, number);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsCard = document.querySelector('.stats-card');
    if (statsCard) {
        statsObserver.observe(statsCard);
    }

    // Parallax Effect for Hero Background
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        const handleParallax = () => {
            const scrolled = window.pageYOffset;
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        };

        let parallaxActive = false;

        const syncParallaxState = () => {
            if (window.innerWidth > 768) {
                if (!parallaxActive) {
                    window.addEventListener('scroll', handleParallax);
                    parallaxActive = true;
                    handleParallax();
                }
            } else if (parallaxActive) {
                window.removeEventListener('scroll', handleParallax);
                parallaxActive = false;
                heroBg.style.transform = '';
            }
        };

        syncParallaxState();
        window.addEventListener('resize', syncParallaxState);
    }

    // Enhanced FAQ Accordion with smooth animation
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const isActive = item.classList.contains('active');
            const answer = item.querySelector('.faq-answer');
            const icon = question.querySelector('i');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    otherAnswer.style.maxHeight = null;
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    if (otherIcon) {
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                if (icon) {
                    icon.style.transform = 'rotate(45deg)';
                }
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
                if (icon) {
                    icon.style.transform = 'rotate(0deg)';
                }
            }
        });
    });

    // Add transition to FAQ icons
    document.querySelectorAll('.faq-question i').forEach(icon => {
        icon.style.transition = 'transform 0.3s ease';
    });

    // Enhanced Smooth 3D Tilt with Glare
    const cards = document.querySelectorAll('.project-card, .service-card');

    cards.forEach(card => {
        // Add glare element
        const glare = document.createElement('div');
        glare.classList.add('card-glare');
        card.appendChild(glare);

        let bounds;
        const rotate = { x: 0, y: 0 };

        const onMouseEnter = () => {
            bounds = card.getBoundingClientRect();
            card.addEventListener('mousemove', onMouseMove);
            glare.style.opacity = '1';
        };

        const onMouseMove = (e) => {
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            // Calculate rotation (max 10 degrees)
            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            rotate.x = ((y - centerY) / centerY) * -5; // Inverted for natural feel
            rotate.y = ((x - centerX) / centerX) * 5;

            // Update glare position
            glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 80%)`;

            // Apply transform instantly
            card.style.transform = `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const onMouseLeave = () => {
            card.removeEventListener('mousemove', onMouseMove);
            rotate.x = 0;
            rotate.y = 0;
            glare.style.opacity = '0';
            // Reset transform instantly
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        };

        card.addEventListener('mouseenter', onMouseEnter);
        card.addEventListener('mouseleave', onMouseLeave);

        // Mobile click handler
        card.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                // If clicking the link icon, let it happen
                if (e.target.closest('.project-link-btn')) return;

                const isActive = card.classList.contains('active');

                // Close others
                document.querySelectorAll('.project-card.active').forEach(c => {
                    if (c !== card) c.classList.remove('active');
                });

                card.classList.toggle('active');
            }
        });
    });

    // Text reveal animation on scroll
    const textElements = document.querySelectorAll('h1, h2, h3, .hero-content p');
    textElements.forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        observer.observe(el);
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'var(--navbar-bg-scrolled)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'var(--navbar-bg)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    // Smooth reveal for logo marquee
    const marquee = document.querySelector('.logo-marquee');
    if (marquee) {
        const marqueeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0.5';
                    entry.target.style.animation = 'fadeIn 1s ease-out';
                }
            });
        }, { threshold: 0.1 });
        marqueeObserver.observe(marquee);
    }


    // Project Case Study View Toggle
    document.querySelectorAll('.view-case-study').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectCard = button.closest('.project-card');

            // Close any other active project cards
            document.querySelectorAll('.project-card.active').forEach(card => {
                if (card !== projectCard) {
                    card.classList.remove('active');
                }
            });

            // Toggle the current card
            projectCard.classList.add('active');
        });
    });

    // Close project info when clicking close button
    document.querySelectorAll('.close-project-info').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const projectCard = closeBtn.closest('.project-card');
            projectCard.classList.remove('active');
        });
    });

    // Close project info when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card') && !e.target.closest('.view-case-study')) {
            document.querySelectorAll('.project-card.active').forEach(card => {
                card.classList.remove('active');
            });
        }
    });

    // ============================================
    // EMAILJS INTEGRATION
    // ============================================

    // ============================================
    // DUAL-TAB CONTACT FORM LOGIC
    // ============================================
    const contactTabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const formTypeInput = document.getElementById('form-type');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formWarning = document.getElementById('form-warning');

    // Tab Switching Logic
    contactTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = tab.getAttribute('data-tab');

            // Update active states
            contactTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-tab`) {
                    content.classList.add('active');
                }
            });

            // Update hidden input
            formTypeInput.value = targetTab;

            // Hide warning when switching
            formWarning.classList.remove('active');
        });
    });

    // ============================================
    // CUSTOM DROPDOWN LOGIC
    // ============================================
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.custom-select-trigger');
        const options = customSelect.querySelectorAll('.custom-option');
        const hiddenInput = document.getElementById('project-type');
        const triggerText = trigger.querySelector('span');

        trigger.addEventListener('click', () => {
            customSelect.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                const text = option.textContent;

                // Update UI
                triggerText.textContent = text;
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                customSelect.classList.remove('open');

                // Update Hidden Input
                if (hiddenInput) {
                    hiddenInput.value = value;
                }
            });
        });

        // Close on click outside
        window.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // 1. Validation: Ensure only active tab is filled
            const activeTabId = formTypeInput.value;
            const enquiryFields = ['name', 'email', 'project-type', 'message'];
            const supportFields = ['support-name', 'support-email', 'support-subject', 'support-message'];

            const hasEnquiryData = enquiryFields.some(id => {
                const el = document.getElementById(id);
                return el && el.value.trim() !== '';
            });
            const hasSupportData = supportFields.some(id => {
                const el = document.getElementById(id);
                return el && el.value.trim() !== '';
            });

            // Rule: User must fill active tab and NOT the other one if content exists
            if (hasEnquiryData && hasSupportData) {
                formWarning.classList.add('active');
                return;
            }

            formWarning.classList.remove('active');

            // 2. Prepare Data based on active tab
            let formData = {};
            if (activeTabId === 'enquiry') {
                formData = {
                    form_type: 'enquiry',
                    from_name: document.getElementById('name').value,
                    from_email: document.getElementById('email').value,
                    project_type: document.getElementById('project-type').value,
                    message: document.getElementById('message').value,
                };
                if (!formData.from_name || !formData.from_email || !formData.message) {
                    alert('Please fill all enquiry fields.');
                    return;
                }
            } else {
                formData = {
                    form_type: 'support',
                    from_name: document.getElementById('support-name').value,
                    from_email: document.getElementById('support-email').value,
                    subject: document.getElementById('support-subject').value,
                    message: document.getElementById('support-message').value,
                };
                if (!formData.from_name || !formData.from_email || !formData.message) {
                    alert('Please fill all support fields.');
                    return;
                }
            }

            // Show loading state
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="ph ph-spinner"></i>';
            submitBtn.disabled = true;

            // Send to Backend API
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
                .then(response => response.json().then(data => ({ ok: response.ok, data })))
                .then(({ ok, data }) => {
                    if (!ok) throw new Error(data.message || 'Server error');

                    // Success state
                    submitBtn.innerHTML = 'Sent Successfully! <i class="ph ph-check-circle"></i>';
                    submitBtn.style.background = 'rgba(34, 197, 94, 0.2)';

                    contactForm.reset();
                    // Reset custom dropdown UI
                    if (triggerText) triggerText.textContent = 'Select project type';
                    if (hiddenInput) hiddenInput.value = '';
                    options.forEach(opt => opt.classList.remove('selected'));
                    if (options[0]) options[0].classList.add('selected');

                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Submission Error:', error);
                    submitBtn.innerHTML = 'Failed! Try Again <i class="ph ph-x-circle"></i>';
                    submitBtn.style.background = 'rgba(239, 68, 68, 0.2)';
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 3000);
                });
        });
    }
    // ============================================
    // SHOW MORE PROJECTS LOGIC
    // ============================================
    const showMoreBtn = document.getElementById('show-more-btn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');
    const projectsFooter = document.querySelector('.projects-footer');

    console.log('Show More Init:', {
        btn: !!showMoreBtn,
        hiddenCount: hiddenProjects.length,
        footer: !!projectsFooter
    });

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            console.log('Show More Clicked');
            const isHidden = !showMoreBtn.classList.contains('active');

            if (isHidden) {
                hiddenProjects.forEach((project, index) => {
                    setTimeout(() => {
                        project.classList.add('show');
                    }, index * 100);
                });
                showMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
                showMoreBtn.classList.add('active');
                if (projectsFooter) projectsFooter.style.display = 'flex';
            } else {
                hiddenProjects.forEach(project => {
                    project.classList.remove('show');
                });
                showMoreBtn.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
                showMoreBtn.classList.remove('active');

                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: 'smooth' });
                }
                if (projectsFooter) projectsFooter.style.display = 'none';
            }
        });
    }

    // Force hide initially via JS as a fallback
    hiddenProjects.forEach(p => p.classList.remove('show'));
    if (projectsFooter && hiddenProjects.length > 0) {
        projectsFooter.style.display = 'none';
    }
});

