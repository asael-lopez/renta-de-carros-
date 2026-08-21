document.addEventListener('DOMContentLoaded', function () {

    const CAROUSEL_INTERVAL = 3000;

    const hero = document.querySelector('.hero');                     
    const slides = document.querySelectorAll('.hero-slide');          
    const dots = document.querySelectorAll('.carousel-dot');          
    const totalSlides = slides.length;                                

    let currentSlideIndex = 0;   
    let carouselTimer = null;    

    function goToSlide(newIndex) {
        slides[currentSlideIndex].classList.remove('active');
        dots[currentSlideIndex].classList.remove('active');

        currentSlideIndex = newIndex;

        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');
    }

    function nextSlide() {
        const nextIndex = (currentSlideIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    function startCarousel() {
        if (carouselTimer !== null) {
            clearInterval(carouselTimer);
        }
        carouselTimer = setInterval(nextSlide, CAROUSEL_INTERVAL);
    }

    function stopCarousel() {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const targetSlide = +dot.getAttribute('data-slide');

            stopCarousel();
            goToSlide(targetSlide);
            startCarousel();
        });
    });

    if (hero) {
        hero.addEventListener('mouseenter', function () {
            stopCarousel();
        });

        hero.addEventListener('mouseleave', function () {
            startCarousel();
        });
    }

    startCarousel();

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');

            const icon = mobileMenuBtn.querySelector('i');

            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            const dropdown = toggle.closest('.dropdown');
            const isActive = dropdown.classList.contains('active');

            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('active');
            });

            if (!isActive) {
                e.preventDefault();
                dropdown.classList.add('active');
            }
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('active');
            });
        }
    });

    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            categoryBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            console.log('Categoría seleccionada:', category);
        });
    });

    const sortSelect = document.getElementById('sortSelect');

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            console.log('Orden seleccionado:', sortSelect.value);
        });
    }

    const floatingWidget = document.getElementById('floatingWidget');
    const widgetToggle = document.getElementById('widgetToggle');

    if (floatingWidget && widgetToggle) {
        widgetToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            floatingWidget.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!floatingWidget.contains(e.target)) {
                floatingWidget.classList.remove('open');
            }
        });
    }

    const widgetItems = document.querySelectorAll('.widget-item');

    widgetItems.forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();

            const title = item.getAttribute('title');
            console.log('Widget clickeado:', title);

            if (title === 'Refrescar' || title === 'Refresh') {
                location.reload();
            } else if (title === 'Teléfono') {
                window.location.href = 'tel:+34900123456';
            } else if (title === 'WhatsApp') {
                window.open('https://wa.me/34600000000', '_blank');
            } else if (title === 'TikTok') {
                window.open('https://www.tiktok.com/@alquilersantalucia?is_from_webapp=1&sender_device=pc', '_blank', 'noopener,noreferrer');
            }
        });
    });

    const translations = {
        es: {
            pageTitle: "Alquiler SantaLucía - Elige tu Vehículo",
            logoSub: "ALQUILER",
            vehicles: "Vehículos",
            locations: "Ubicaciones",
            about: "Nosotros",
            ourStory: "Nuestra Historia",
            team: "Equipo",
            careers: "Empleos",
            languages: "Idiomas",
            fleet: "FLOTA",
            chooseVehicle: "ELIGE TU VEHÍCULO",
            allVehicles: "Todos los Vehículos",
            ac: "Aire Acondicionado",
            automatic: "Automático",
            compact: "Compacto",
            hybrid: "Híbrido",
            intermediate: "Intermedio",
            luxury: "Lujo",
            mini: "Mini / Económico",
            minivan: "Minivan",
            passenger: "Furgoneta Pasajeros",
            station: "Familiar",
            suv: "SUV",
            sortBy: "Ordenar por:",
            sortFeatured: "Destacados",
            sortPriceLow: "Precio: Menor a Mayor",
            sortPriceHigh: "Precio: Mayor a Menor",
            sortNameAZ: "Nombre A-Z",
            sortNameZA: "Nombre Z-A",
            footerTagline: "Alquiler de vehículos con la mejor flota y atención personalizada. Muévete con libertad, estilo y confianza.",
            footerQuickLinks: "Enlaces Rápidos",
            footerOffers: "Ofertas",
            footerServices: "Servicios",
            footerLongTerm: "Alquiler Largo Plazo",
            footerCorporate: "Corporativos",
            footerDelivery: "Entrega a Domicilio",
            footerAirport: "Recogida Aeropuerto",
            footerInsurance: "Seguros",
            footerAssistance: "Asistencia 24/7",
            footerContact: "Contacto",
            footerAddress: "Av. Principal 123, Centro, Madrid, España",
            footerSchedule: "Lun-Sáb: 08:00 - 20:00",
            footerPayWith: "Paga con:",
            footerCopy: "SantaLucía Alquiler. Todos los derechos reservados.",
            footerPrivacy: "Privacidad",
            footerTerms: "Términos y Condiciones",
            footerCookies: "Política de Cookies"
        },
        en: {
            pageTitle: "SantaLucía Rental - Choose Your Vehicle",
            logoSub: "RENTAL",
            vehicles: "Vehicles",
            locations: "Locations",
            about: "About",
            ourStory: "Our Story",
            team: "Team",
            careers: "Careers",
            languages: "Languages",
            fleet: "FLEET",
            chooseVehicle: "CHOOSE YOUR VEHICLE",
            allVehicles: "All Vehicles",
            ac: "Air Conditioning",
            automatic: "Automatic",
            compact: "Compact",
            hybrid: "Hybrid",
            intermediate: "Intermediate",
            luxury: "Luxury",
            mini: "Mini / Economy",
            minivan: "Minivan",
            passenger: "Passenger Van",
            station: "Station Wagon",
            suv: "SUV",
            sortBy: "Sort by:",
            sortFeatured: "Featured",
            sortPriceLow: "Price: Low to High",
            sortPriceHigh: "Price: High to Low",
            sortNameAZ: "Name A-Z",
            sortNameZA: "Name Z-A",
            footerTagline: "Vehicle rental with the best fleet and personalized service. Move with freedom, style, and confidence.",
            footerQuickLinks: "Quick Links",
            footerOffers: "Offers",
            footerServices: "Services",
            footerLongTerm: "Long Term Rental",
            footerCorporate: "Corporate",
            footerDelivery: "Home Delivery",
            footerAirport: "Airport Pickup",
            footerInsurance: "Insurance",
            footerAssistance: "24/7 Roadside Assistance",
            footerContact: "Contact",
            footerAddress: "123 Main Street, Downtown, Madrid, Spain",
            footerSchedule: "Mon-Sat: 08:00 - 20:00",
            footerPayWith: "Pay with:",
            footerCopy: "SantaLucía Rental. All rights reserved.",
            footerPrivacy: "Privacy Policy",
            footerTerms: "Terms and Conditions",
            footerCookies: "Cookie Policy"
        }
    };

    function applyLanguage(lang) {
        const dict = translations[lang] || translations.es;

        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) {
                el.textContent = dict[key];
            }
        });

        document.documentElement.setAttribute('lang', lang);

        localStorage.setItem('preferredLang', lang);
    }

    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedLang = link.getAttribute('data-lang');
            applyLanguage(selectedLang);
        });
    });

    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    const initialLang = localStorage.getItem('preferredLang') || 'es';
    applyLanguage(initialLang);

});