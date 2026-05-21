/**
 * MECHAS HAIR - Premium Website Scripts
 * Dynamic interactivity, hair calculator, and social media showcase.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const navToggle = document.getElementById('nav-toggle-btn');
    const navbar = document.getElementById('main-navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navbar.classList.remove('active');
                
                // Active link tracking
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    // Header styling on scroll
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // ACCORDION FAQ
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                currentItem.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // PRICING CRITERIA TABS
    // ==========================================================================
    const criteriaTabs = document.querySelectorAll('.criteria-tab');
    const criteriaPanels = document.querySelectorAll('.criteria-panel');

    criteriaTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            criteriaTabs.forEach(item => item.classList.remove('active'));
            criteriaPanels.forEach(panel => panel.classList.remove('active'));

            tab.classList.add('active');
            const activePanel = document.getElementById(`criteria-${target}`);
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // INTERACTIVE HAIR SIMULATOR (CALCULATOR)
    // ==========================================================================
    const lengthSlider = document.getElementById('hair-length');
    const lengthValDisplay = document.getElementById('length-val-display');
    const simulatorForm = document.getElementById('simulator-form');
    const stepPanes = document.querySelectorAll('.sim-step-pane');
    const stepIndicators = document.querySelectorAll('.step-indicator');

    // Update length display as slider moves
    if (lengthSlider && lengthValDisplay) {
        lengthSlider.addEventListener('input', (e) => {
            lengthValDisplay.textContent = e.target.value;
        });
    }

    // Step navigation
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = btn.getAttribute('data-next');
            goToStep(nextStep);
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = btn.getAttribute('data-prev');
            goToStep(prevStep);
        });
    });

    // Active state toggling for radio card selectors (Step 1)
    const optionCards = document.querySelectorAll('.option-card');
    optionCards.forEach(card => {
        card.addEventListener('click', () => {
            optionCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    function goToStep(stepNum) {
        // Hide all panes
        stepPanes.forEach(pane => pane.classList.remove('active'));
        // Show target pane
        document.getElementById(`pane-${stepNum}`).classList.add('active');

        // Update step indicators
        stepIndicators.forEach((ind, index) => {
            const indicatorStep = parseInt(ind.getAttribute('data-step'));
            ind.classList.remove('active', 'completed');
            
            if (indicatorStep < stepNum) {
                ind.classList.add('completed');
            } else if (indicatorStep === parseInt(stepNum)) {
                ind.classList.add('active');
            }
        });
    }

    // Calculator calculation logic
    const btnCalculate = document.getElementById('btn-calculate-hair');
    if (btnCalculate) {
        btnCalculate.addEventListener('click', () => {
            // 1. Gather all inputs
            const hairType = document.querySelector('input[name="hair-type"]:checked').value;
            const hairLength = parseInt(document.getElementById('hair-length').value);
            const hairColor = document.getElementById('hair-color').value;
            const hairChemistry = document.getElementById('hair-chemistry').value;

            // 2. Pricing Algorithm
            // Base price scales quadratically/linearly with length (longer hair = much more value per gram)
            let basePricePerGram = 0.5; // starting factor
            
            if (hairLength < 35) {
                basePricePerGram = 0.8;
            } else if (hairLength < 45) {
                basePricePerGram = 1.3;
            } else if (hairLength < 55) {
                basePricePerGram = 2.0;
            } else if (hairLength < 65) {
                basePricePerGram = 2.8;
            } else if (hairLength < 75) {
                basePricePerGram = 3.6;
            } else {
                basePricePerGram = 4.8;
            }

            // Estimate weight based on typical length of a cut ponytail (150g average)
            const typicalWeightGrams = 140 + (hairLength - 30) * 1.5; // estimation of volume

            let estimatedBase = basePricePerGram * typicalWeightGrams;

            // Multipliers based on properties
            let typeMultiplier = 1.0;
            if (hairType === 'Liso') typeMultiplier = 1.15;
            if (hairType === 'Ondulado') typeMultiplier = 1.1;

            let colorMultiplier = 1.0;
            if (hairColor === 'Loiro') colorMultiplier = 1.6;
            if (hairColor === 'Ruivo') colorMultiplier = 1.5;
            if (hairColor === 'Castanho') colorMultiplier = 1.15;
            if (hairColor === 'Colorido') colorMultiplier = 0.7; // color-processed has lower yield

            let chemistryMultiplier = 1.0;
            if (hairChemistry === 'Nenhum') chemistryMultiplier = 1.35; // virgem premium
            if (hairChemistry === 'ComQuimica') chemistryMultiplier = 0.95;
            if (hairChemistry === 'Descolorido') chemistryMultiplier = 0.75;

            // Calculate final estimate
            const finalEstimate = estimatedBase * typeMultiplier * colorMultiplier * chemistryMultiplier;
            
            // Generate range
            const minRange = Math.round((finalEstimate * 0.8) / 10) * 10;
            const maxRange = Math.round((finalEstimate * 1.25) / 10) * 10;

            // Display in result pane
            const priceRangeDisplay = document.getElementById('price-range-display');
            priceRangeDisplay.textContent = `${minRange.toLocaleString('pt-BR')} - ${maxRange.toLocaleString('pt-BR')}`;

            // 3. WhatsApp Message generation
            const whatsappNumber = "5555981004034"; // Fictional or custom number
            const whatsappText = `Olá Mechas Hair! Fiz a simulação de avaliação de cabelo no site. Seguem os dados:\n\n` + 
                                 `✨ *Tipo:* ${hairType}\n` +
                                 `📏 *Comprimento:* ${hairLength} cm\n` +
                                 `🎨 *Cor:* ${hairColor}\n` +
                                 `🧪 *Química:* ${hairChemistry === 'Nenhum' ? 'Não, cabelo Virgem!' : hairChemistry === 'ComQuimica' ? 'Progressiva/Química leve' : 'Luzes/Descolorido'}\n` +
                                 `💰 *Estimativa Gerada:* R$ ${minRange} - R$ ${maxRange}\n\n` +
                                 `Gostaria de agendar uma avaliação física/por foto para prosseguir com a venda. Como devo fazer?`;
            
            const encodedText = encodeURIComponent('Olá, vim pelo site, gostaria de fazer uma avaliação gratuita com a Mechas Hair.');
            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedText}`;

            const btnWhatsAppSim = document.getElementById('send-whatsapp-simulation');
            if (btnWhatsAppSim) {
                btnWhatsAppSim.setAttribute('href', whatsappLink);
            }

            // Go to step 4
            goToStep(4);
        });
    }

    // Restart simulator
    const btnRestart = document.getElementById('btn-restart-simulator');
    if (btnRestart) {
        btnRestart.addEventListener('click', () => {
            // Reset form
            simulatorForm.reset();
            if (lengthSlider && lengthValDisplay) {
                lengthValDisplay.textContent = "50";
            }
            // Active state resets on Step 1 card
            optionCards.forEach((c, idx) => {
                c.classList.remove('active');
                if (idx === 0) c.classList.add('active');
            });
            // Go to step 1
            goToStep(1);
        });
    }

    // ==========================================================================
    // GALLERY MASONRY FILTERS
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add to current
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    item.style.animation = 'scaleIn 0.4s ease forwards';
                } else {
                    if (item.classList.contains(filterValue)) {
                        item.style.display = 'block';
                        item.style.animation = 'scaleIn 0.4s ease forwards';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });

            const galleryTrack = document.getElementById('masonry-gallery');
            if (galleryTrack) galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
        });
    });

    const galleryTrack = document.getElementById('masonry-gallery');
    const galleryPrev = document.querySelector('.gallery-nav-prev');
    const galleryNext = document.querySelector('.gallery-nav-next');

    const scrollGallery = (direction) => {
        if (!galleryTrack) return;
        const visibleItem = Array.from(galleryItems).find(item => item.style.display !== 'none');
        const itemWidth = visibleItem ? visibleItem.getBoundingClientRect().width : 300;
        galleryTrack.scrollBy({ left: direction * (itemWidth + 24) * 2, behavior: 'smooth' });
    };

    if (galleryPrev) galleryPrev.addEventListener('click', () => scrollGallery(-1));
    if (galleryNext) galleryNext.addEventListener('click', () => scrollGallery(1));

    // ==========================================================================
    // TESTIMONIALS CAROUSEL
    // ==========================================================================
    const testimonialsTrack = document.getElementById('testimonials-carousel');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.querySelector('.testimonial-nav-prev');
    const testimonialNext = document.querySelector('.testimonial-nav-next');

    const scrollTestimonials = (direction) => {
        if (!testimonialsTrack) return;
        const cardWidth = testimonialCards[0] ? testimonialCards[0].getBoundingClientRect().width : 420;
        testimonialsTrack.scrollBy({ left: direction * (cardWidth + 30), behavior: 'smooth' });
    };

    if (testimonialPrev) testimonialPrev.addEventListener('click', () => scrollTestimonials(-1));
    if (testimonialNext) testimonialNext.addEventListener('click', () => scrollTestimonials(1));

    // ==========================================================================
    // BEFORE / AFTER TRANSFORMATION COMPARISON
    // ==========================================================================
    const comparisonCards = document.querySelectorAll('.comparison-card');

    comparisonCards.forEach(card => {
        const slider = card.querySelector('.comparison-slider');
        const afterWrap = card.querySelector('.comparison-after-wrap');
        const afterImg = card.querySelector('.comparison-after');
        if (!slider) return;

        const updateComparison = () => {
            const value = Math.max(1, Number(slider.value));
            card.style.setProperty('--position', `${value}%`);
            if (afterWrap) afterWrap.style.width = `${value}%`;
            if (afterImg) afterImg.style.width = `${10000 / value}%`;
        };

        slider.addEventListener('input', updateComparison);
        updateComparison();
    });

    // ==========================================================================
    // IMAGE LIGHTBOX MODAL
    // ==========================================================================
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close-btn');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.getAttribute('data-src');
            const titleText = item.querySelector('h4').textContent;
            const descText = item.querySelector('p').textContent;

            if (lightbox && lightboxImg && lightboxCaption) {
                lightbox.style.display = 'block';
                lightboxImg.src = imgSrc;
                lightboxCaption.innerHTML = `<strong>${titleText}</strong><br>${descText}`;
                document.body.style.overflow = 'hidden'; // Lock scrolling
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Unlock scrolling
        });
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close lightbox on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ==========================================================================
    // DYNAMIC INTERSECTION REVEAL ON SCROLL
    // ==========================================================================
    const revealElements = document.querySelectorAll('.step-card, .benefit-item, .criteria-card, .testimonial-card, .location-info, .location-detail-card, .location-visual');

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(25px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        revealOnScroll.observe(el);
    });

});



