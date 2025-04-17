document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    initMobileMenu();
    
    // FAQ accordion
    initFaqAccordion();
    
    // Scroll animations
    initScrollAnimations();
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Email subscription form
    initSubscriptionForm();
    
    // UI mockup animations
    initUIMockupAnimations();
});

// Mobile menu functionality
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navList = document.querySelector('.nav__list');
    
    if (!menuToggle || !nav || !navList) return;
    
    const mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.appendChild(navList.cloneNode(true));
    document.body.appendChild(mobileNav);
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('menu-toggle--active');
        mobileNav.classList.toggle('mobile-nav--active');
        document.body.classList.toggle('no-scroll');
        
        // Add animation to menu toggle
        const lines = menuToggle.querySelectorAll('.menu-toggle__line');
        lines.forEach(line => line.classList.toggle('menu-toggle__line--active'));
    });
    
    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileNav.querySelectorAll('.nav__link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('menu-toggle--active');
            mobileNav.classList.remove('mobile-nav--active');
            document.body.classList.remove('no-scroll');
            
            // Reset menu toggle animation
            const lines = menuToggle.querySelectorAll('.menu-toggle__line');
            lines.forEach(line => line.classList.remove('menu-toggle__line--active'));
        });
    });
    
    // Add styles for mobile nav
    const style = document.createElement('style');
    style.textContent = `
        .mobile-nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            background-color: var(--color-background);
            box-shadow: var(--shadow-lg);
            padding: var(--spacing-xl) var(--spacing-lg);
            z-index: 99;
            transition: right 0.3s ease;
            overflow-y: auto;
        }
        
        .mobile-nav--active {
            right: 0;
        }
        
        .mobile-nav .nav__list {
            display: flex;
            flex-direction: column;
            gap: var(--spacing-lg);
        }
        
        .mobile-nav .nav__item {
            width: 100%;
        }
        
        .mobile-nav .nav__link {
            display: block;
            padding: var(--spacing-sm) 0;
            font-size: 1.2rem;
        }
        
        .no-scroll {
            overflow: hidden;
        }
        
        .menu-toggle--active {
            z-index: 100;
        }
        
        .menu-toggle__line--active:nth-child(1) {
            transform: translateY(8px) rotate(45deg);
        }
        
        .menu-toggle__line--active:nth-child(2) {
            opacity: 0;
        }
        
        .menu-toggle__line--active:nth-child(3) {
            transform: translateY(-8px) rotate(-45deg);
        }
    `;
    document.head.appendChild(style);
}

// FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq__item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        const answer = item.querySelector('.faq__answer');
        
        if (!question || !answer) return;
        
        // Add initial aria attributes for accessibility
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
        
        question.addEventListener('click', () => {
            // Toggle current FAQ item
            const isActive = item.classList.toggle('faq__item--active');
            
            // Update aria attributes
            question.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            answer.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            
            // Close other items (optional - for accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('faq__item--active')) {
                    otherItem.classList.remove('faq__item--active');
                    
                    const otherQuestion = otherItem.querySelector('.faq__question');
                    const otherAnswer = otherItem.querySelector('.faq__answer');
                    
                    if (otherQuestion && otherAnswer) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.setAttribute('aria-hidden', 'true');
                    }
                }
            });
        });
    });
}

// Scroll animations using IntersectionObserver
function initScrollAnimations() {
    // Select elements that should animate on scroll
    const sections = [
        ...document.querySelectorAll('.benefits__item'),
        ...document.querySelectorAll('.how-it-works__step'),
        ...document.querySelectorAll('.pricing__card'),
        document.querySelector('.subscribe__inner'),
        ...document.querySelectorAll('.faq__item')
    ].filter(el => el !== null);
    
    // Initialize Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add in-view class instead of directly setting opacity
                entry.target.classList.add('in-view');
                
                // If the element has fade-in class, set opacity to 1
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.style.opacity = '1';
                }
                
                // Don't unobserve to allow for animations when scrolling back up
                // observer.unobserve(entry.target);
            } else if (entry.boundingClientRect.top > window.innerHeight) {
                // Only remove the in-view class if scrolling up (element is below viewport)
                // This keeps animations visible when scrolling back down
                entry.target.classList.remove('in-view');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate
    sections.forEach(element => {
        observer.observe(element);
    });
    
    // Add staggered animation delays for grouped elements
    document.querySelectorAll('.benefits__item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    document.querySelectorAll('.pricing__card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    document.querySelectorAll('.faq__item').forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add shine effect to Hero section on load
    setTimeout(() => {
        const heroImage = document.querySelector('.hero__image');
        if (heroImage) {
            heroImage.classList.add('shine-effect');
        }
    }, 1000);
    
    // Observe section titles for scaleInX animation
    const sectionTitles = document.querySelectorAll('.section-title');
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-title');
                titleObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    sectionTitles.forEach(title => {
        titleObserver.observe(title);
    });
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Email subscription form functionality
function initSubscriptionForm() {
    const form = document.getElementById('subscribe-form');
    const messageEl = document.getElementById('subscribe-message');
    
    if (!form || !messageEl) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        
        if (!emailInput || !emailInput.value.trim()) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Simulate API call with timeout
        messageEl.textContent = 'Submitting...';
        messageEl.className = 'subscribe__message';
        
        setTimeout(() => {
            // Clear the input
            emailInput.value = '';
            
            // Show success message
            showMessage('Thank you for subscribing!', 'success');
        }, 1000);
    });
    
    function showMessage(message, type) {
        messageEl.textContent = message;
        messageEl.className = `subscribe__message subscribe__message--${type}`;
        
        // Clear message after a while
        setTimeout(() => {
            messageEl.textContent = '';
            messageEl.className = 'subscribe__message';
        }, 5000);
    }
}

// UI mockup animations for the How It Works section
function initUIMockupAnimations() {
    const mockupSteps = document.querySelectorAll('.how-it-works__step');
    
    if (!mockupSteps.length) return;
    
    // Initial check to see if any steps are in view when the page loads
    checkMockupsInView();
    
    // Add scroll event listener with debounce for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            checkMockupsInView();
        });
    });
    
    // Function to check which mockups are in view
    function checkMockupsInView() {
        mockupSteps.forEach(step => {
            const rect = step.getBoundingClientRect();
            const isInView = (
                rect.top >= 0 &&
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
            );
            
            if (isInView) {
                step.classList.add('in-view');
            } else if (rect.top > window.innerHeight) {
                // Only remove the class if the element is below the viewport
                // This keeps the animation visible when scrolling up
                step.classList.remove('in-view');
            }
        });
    }
    
    // Add interactive behavior to UI elements
    addInteractiveBehavior();
    
    function addInteractiveBehavior() {
        // Make clothes tabs interactive
        const clothesTabs = document.querySelectorAll('.clothes-mockup__tab');
        clothesTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                clothesTabs.forEach(t => t.classList.remove('clothes-mockup__tab--active'));
                // Add active class to the clicked tab
                tab.classList.add('clothes-mockup__tab--active');
            });
        });
        
        // Make clothing items interactive
        const clothesItems = document.querySelectorAll('.clothes-mockup__item');
        clothesItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('selected');
                
                // Toggle a selected state with a different background
                if (item.classList.contains('selected')) {
                    item.style.backgroundColor = '#d4d0ff';
                    item.style.border = '2px solid var(--color-primary)';
                } else {
                    item.style.backgroundColor = '#e6e6e6';
                    item.style.border = 'none';
                }
            });
        });
        
        // Make try-on button interactive
        const tryOnBtn = document.querySelector('.result-mockup__btn');
        if (tryOnBtn) {
            tryOnBtn.addEventListener('click', () => {
                const resultImage = document.querySelector('.result-mockup__image--result');
                if (resultImage) {
                    // Simulate the loading of a new try-on result
                    resultImage.style.transition = 'opacity 0.3s ease';
                    resultImage.style.opacity = '0.3';
                    
                    setTimeout(() => {
                        // Change the color to simulate a new outfit
                        const outfit = resultImage.querySelector('::after');
                        const randomColor = getRandomPastelColor();
                        resultImage.style.setProperty('--outfit-color', randomColor);
                        resultImage.style.opacity = '1';
                    }, 500);
                }
            });
        }
    }
    
    // Helper function to generate random pastel colors
    function getRandomPastelColor() {
        const hue = Math.floor(Math.random() * 360);
        return `hsl(${hue}, 70%, 80%)`;
    }
} 