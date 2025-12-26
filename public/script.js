document.addEventListener('DOMContentLoaded', () => {
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
                navbar.style.background = 'rgba(5, 5, 5, 0.95)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(5, 5, 5, 0.8)';
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

    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get original button text
            const originalBtnText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = 'Sending... <i class="ph ph-spinner"></i>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Prepare form data
            const formData = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                project_type: document.getElementById('project-type').value,
                budget: document.getElementById('budget').value,
                message: document.getElementById('message').value,
            };

            // Send to Backend API
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(err => { throw new Error(err.message || 'Server error'); });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Backend Success:', data.message);

                    // Show success message
                    submitBtn.innerHTML = 'Sent Successfully! <i class="ph ph-check-circle"></i>';
                    submitBtn.style.background = 'rgba(34, 197, 94, 0.2)';
                    submitBtn.style.borderColor = 'rgba(34, 197, 94, 0.5)';

                    // Reset form
                    contactForm.reset();

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                    }, 3000);
                })
                .catch(error => {
                    console.log('Submission Error:', error);

                    // Show error message
                    submitBtn.innerHTML = 'Failed! Try Again <i class="ph ph-x-circle"></i>';
                    submitBtn.style.background = 'rgba(239, 68, 68, 0.2)';
                    submitBtn.style.borderColor = 'rgba(239, 68, 68, 0.5)';

                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = '';
                        submitBtn.style.borderColor = '';
                    }, 3000);
                });
        });
    }
});

