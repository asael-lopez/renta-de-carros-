// Se ejecuta cuando todo el DOM está cargado
document.addEventListener('DOMContentLoaded', function () {

    // Tiempo entre slides del carrusel (3s)
    const CAROUSEL_INTERVAL = 3000;

    // Elementos del carrusel
    const hero = document.querySelector('.hero');                     
    const slides = document.querySelectorAll('.hero-slide');          
    const dots = document.querySelectorAll('.carousel-dot');          
    const totalSlides = slides.length;                                

    // Solo arranca el carrusel si hay slides y dots
    if (totalSlides > 0 && dots.length > 0) {

        let currentSlideIndex = 0;   // slide actual
        let carouselTimer = null;    // timer del autoplay

        // Cambia a un slide concreto
        function goToSlide(newIndex) {
            slides[currentSlideIndex].classList.remove('active');
            dots[currentSlideIndex].classList.remove('active');

            currentSlideIndex = newIndex;

            slides[currentSlideIndex].classList.add('active');
            dots[currentSlideIndex].classList.add('active');
        }

        // Pasa al siguiente slide (con loop)
        function nextSlide() {
            const nextIndex = (currentSlideIndex + 1) % totalSlides;
            goToSlide(nextIndex);
        }

        // Arranca el autoplay
        function startCarousel() {
            if (carouselTimer !== null) {
                clearInterval(carouselTimer);
            }
            carouselTimer = setInterval(nextSlide, CAROUSEL_INTERVAL);
        }

        // Para el autoplay
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

    }

    // ========== Menú móvil (hamburguesa) ==========
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
    // ========== Dropdowns del nav (Empresa, Idiomas, etc) ==========
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

    // ========== Botones de categorías (si existen) ==========
    const categoryBtns = document.querySelectorAll('.category-btn');

    if (categoryBtns.length) {
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
    }

    // Selector de ordenación
    const sortSelect = document.getElementById('sortSelect');

    if (sortSelect) {
        sortSelect.addEventListener('change', function () {
            console.log('Orden seleccionado:', sortSelect.value);
        });
    }

    // ========== Detalles de la flota ==========
    const fleetDetailsOverlay = document.getElementById('fleetDetailsOverlay');
    const fleetDetailsClose = document.getElementById('fleetDetailsClose');
    const fleetDetailsImage = document.getElementById('fleetDetailsImage');
    const fleetDetailsTitle = document.getElementById('fleetDetailsTitle');
    const fleetDetailsExample = document.getElementById('fleetDetailsExample');
    const fleetDetailsSpecs = document.getElementById('fleetDetailsSpecs');
    const fleetDetailsButtons = document.querySelectorAll('.cat-card-details-btn');

    function closeFleetDetails() {
        if (!fleetDetailsOverlay) return;
        fleetDetailsOverlay.classList.remove('open');
        fleetDetailsOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('fleet-modal-open');
    }

    if (fleetDetailsOverlay && fleetDetailsButtons.length) {
        fleetDetailsButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const card = button.closest('.rent-category-card');
                const title = card.querySelector('.cat-card-title');
                const example = card.querySelector('.cat-card-example');
                const image = card.querySelector('.cat-card-image');
                const specs = card.querySelectorAll('.cat-spec-item');

                fleetDetailsTitle.textContent = title ? title.textContent.trim() : 'Vehículo';
                fleetDetailsExample.textContent = example ? example.textContent.trim() : '';
                fleetDetailsImage.src = image ? image.src : '';
                fleetDetailsImage.alt = image ? image.alt : fleetDetailsTitle.textContent;
                fleetDetailsSpecs.innerHTML = '';

                specs.forEach(function (spec) {
                    const item = document.createElement('li');
                    item.innerHTML = spec.innerHTML;
                    fleetDetailsSpecs.appendChild(item);
                });

                fleetDetailsOverlay.classList.add('open');
                fleetDetailsOverlay.setAttribute('aria-hidden', 'false');
                document.body.classList.add('fleet-modal-open');
                fleetDetailsClose.focus();
            });
        });

        fleetDetailsClose.addEventListener('click', closeFleetDetails);
        fleetDetailsOverlay.addEventListener('click', function (event) {
            if (event.target === fleetDetailsOverlay) closeFleetDetails();
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeFleetDetails();
        });
    }

    // ========== Widget flotante (derecha) ==========
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

    // ========== Multi-idioma (ES / EN) ==========
    const translations = {
        es: {
            pageTitle: "Alquiler SantaLucía - Elige tu Vehículo",
            pageTitleAutos: "Alquiler SantaLucía - Carros de Renta",
            pageTitleLogin: "SantaLucía Alquiler - Mi Cuenta",
            logoSub: "ALQUILER",
            home: "Inicio",
            ourFleet: "Nuestra Flota",
            offices: "Oficinas",
            company: "Empresa",
            whoWeAre: "Quiénes Somos",
            ourTeam: "Nuestro Equipo",
            workWithUs: "Trabaja con Nosotros",
            languages: "Idiomas",
            myAccount: "Mi Cuenta",
            fleet: "FLOTA",
            chooseVehicle: "ELIGE TU VEHÍCULO",
            rentalCars: "CARROS DE RENTA",
            availableFleet: "NUESTRA FLOTA DISPONIBLE",
            allVehicles: "Todos los Vehículos",
            ac: "Aire Acondicionado",
            automatic: "Automático",
            manual: "Manual",
            compact: "Compacto",
            hybrid: "Híbrido",
            intermediate: "Intermedio",
            luxury: "Lujo",
            mini: "Mini / Económico",
            minivan: "Minivan",
            passenger: "Furgoneta Pasajeros",
            station: "Familiar",
            suv: "SUV",
            available: "DISPONIBLE",
            notAvailable: "NO DISPONIBLE",
            categoryCompact: "Compacto",
            categorySUV: "SUV",
            categoryLuxury: "Lujo",
            categoryMini: "Económico",
            categoryMinivan: "Minivan",
            categoryIntermediate: "Intermedio",
            categoryStation: "Familiar",
            categoryHybrid: "Híbrido",
            categoryPassenger: "Furgoneta",
            passengers4: "4 Pasajeros",
            passengers5: "5 Pasajeros",
            passengers7: "7 Pasajeros",
            passengers9: "9 Pasajeros",
            acYes: "A/C",
            automaticYes: "Automático",
            manualYes: "Manual",
            luggage1: "1 Maleta",
            luggage2: "2 Maletas",
            luggage3: "3 Maletas",
            luggage4: "4 Maletas",
            luggage5: "5 Maletas",
            luggage6: "6 Maletas",
            luggage8: "8 Maletas",
            perDay: "/día",
            whatsappBtn: "WhatsApp",
            sortBy: "Ordenar por:",
            sortFeatured: "Destacados",
            sortPriceLow: "Precio: Menor a Mayor",
            sortPriceHigh: "Precio: Mayor a Menor",
            sortNameAZ: "Nombre A-Z",
            sortNameZA: "Nombre Z-A",
            rentalOptionsTitle: "Opciones de alquiler de autos",
            makeReservation: "Realizar una reserva",
            filters: "Filtros",
            vehicleType: "Tipo de vehículo",
            cars: "Autos",
            trucks: "Camiones",
            vans: "Vans",
            suvFull: "Vehículos utilitarios deportivos (SUV)",
            passengers: "PASAJEROS",
            transmission: "Transmisión",
            priceRange: "Rango de precios",
            vehicleCategoryOptions: "94 opciones de categoría de vehículo",
            country: "PAÍS:",
            countryName: "ESPAÑA",
            carsCategory: "Autos",
            catCompact: "Compacto",
            catCompactExample: "Nissan Versa o similar",
            catConvertible: "Descapotable compacto",
            catConvertibleExample: "Mazda Miata RF o similar",
            catSpecialCompact: "Compacto especial",
            catSpecialCompactExample: "Fiat 500 o similar",
            catEconomy: "Económico",
            catEconomyExample: "Hyundai i10 o similar",
            catMidsizeSUV: "SUV Mediano",
            catMidsizeSUVExample: "Kia Sportage o similar",
            catLuxuryCategory: "Lujo",
            catLuxuryExample: "BMW Serie 3 o similar",
            viewDetails: "Ver detalles",
            imageNotAvailable: "Imagen no disponible",
            welcomeBack: "¡Bienvenido de nuevo!",
            loginSubtitle: "Accede a tu cuenta para gestionar tus reservas",
            loginTab: "Iniciar Sesión",
            registerTab: "Crear Cuenta",
            emailLabel: "Correo electrónico",
            passwordLabel: "Contraseña",
            fullNameLabel: "Nombre completo",
            phoneLabel: "Teléfono",
            rememberMe: "Recordarme",
            forgotPassword: "¿Olvidaste tu contraseña?",
            loginBtn: "Iniciar Sesión",
            orLoginWith: "O inicia sesión con",
            acceptTerms: "Acepto los términos y condiciones",
            registerBtn: "Crear Cuenta",
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
            pageTitleAutos: "SantaLucía Rental - Rental Cars",
            pageTitleLogin: "SantaLucía Rental - My Account",
            logoSub: "RENTAL",
            home: "Home",
            ourFleet: "Our Fleet",
            offices: "Offices",
            company: "Company",
            whoWeAre: "Who We Are",
            ourTeam: "Our Team",
            workWithUs: "Work With Us",
            languages: "Languages",
            myAccount: "My Account",
            fleet: "FLEET",
            chooseVehicle: "CHOOSE YOUR VEHICLE",
            rentalCars: "RENTAL CARS",
            availableFleet: "OUR AVAILABLE FLEET",
            allVehicles: "All Vehicles",
            ac: "Air Conditioning",
            automatic: "Automatic",
            manual: "Manual",
            compact: "Compact",
            hybrid: "Hybrid",
            intermediate: "Intermediate",
            luxury: "Luxury",
            mini: "Mini / Economy",
            minivan: "Minivan",
            passenger: "Passenger Van",
            station: "Station Wagon",
            suv: "SUV",
            available: "AVAILABLE",
            notAvailable: "NOT AVAILABLE",
            categoryCompact: "Compact",
            categorySUV: "SUV",
            categoryLuxury: "Luxury",
            categoryMini: "Economy",
            categoryMinivan: "Minivan",
            categoryIntermediate: "Intermediate",
            categoryStation: "Station Wagon",
            categoryHybrid: "Hybrid",
            categoryPassenger: "Van",
            passengers4: "4 Passengers",
            passengers5: "5 Passengers",
            passengers7: "7 Passengers",
            passengers9: "9 Passengers",
            acYes: "A/C",
            automaticYes: "Automatic",
            manualYes: "Manual",
            luggage1: "1 Bag",
            luggage2: "2 Bags",
            luggage3: "3 Bags",
            luggage4: "4 Bags",
            luggage5: "5 Bags",
            luggage6: "6 Bags",
            luggage8: "8 Bags",
            perDay: "/day",
            whatsappBtn: "WhatsApp",
            sortBy: "Sort by:",
            sortFeatured: "Featured",
            sortPriceLow: "Price: Low to High",
            sortPriceHigh: "Price: High to Low",
            sortNameAZ: "Name A-Z",
            sortNameZA: "Name Z-A",
            rentalOptionsTitle: "Car rental options",
            makeReservation: "Make a Reservation",
            filters: "Filters",
            vehicleType: "Vehicle type",
            cars: "Cars",
            trucks: "Trucks",
            vans: "Vans",
            suvFull: "Sport utility vehicles (SUV)",
            passengers: "PASSENGERS",
            transmission: "Transmission",
            priceRange: "Price range",
            vehicleCategoryOptions: "94 vehicle category options",
            country: "COUNTRY:",
            countryName: "SPAIN",
            carsCategory: "Cars",
            catCompact: "Compact",
            catCompactExample: "Nissan Versa or similar",
            catConvertible: "Compact Convertible",
            catConvertibleExample: "Mazda Miata RF or similar",
            catSpecialCompact: "Special Compact",
            catSpecialCompactExample: "Fiat 500 or similar",
            catEconomy: "Economy",
            catEconomyExample: "Hyundai i10 or similar",
            catMidsizeSUV: "Midsize SUV",
            catMidsizeSUVExample: "Kia Sportage or similar",
            catLuxuryCategory: "Luxury",
            catLuxuryExample: "BMW 3 Series or similar",
            viewDetails: "View details",
            imageNotAvailable: "Image not available",
            welcomeBack: "Welcome back!",
            loginSubtitle: "Sign in to your account to manage your reservations",
            loginTab: "Sign In",
            registerTab: "Create Account",
            emailLabel: "Email address",
            passwordLabel: "Password",
            fullNameLabel: "Full name",
            phoneLabel: "Phone",
            rememberMe: "Remember me",
            forgotPassword: "Forgot your password?",
            loginBtn: "Sign In",
            orLoginWith: "Or sign in with",
            acceptTerms: "I accept the terms and conditions",
            registerBtn: "Create Account",
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

    // Aplica el idioma elegido y lo guarda en localStorage
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

    // Año actual en el footer
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Idioma por defecto (recordado en localStorage)
    const initialLang = localStorage.getItem('preferredLang') || 'es';
    applyLanguage(initialLang);

    // ========== Login / Perfil de usuario ==========
    (function () {
        // Usuario logueado (de sessionStorage, lo escribe login-registro.html)
        var usuario = null;
        try { usuario = sessionStorage.getItem('usuario') || null; } catch (e) { usuario = null; }

        var accountBtn = document.getElementById('accountBtn');
        var profileContainer = document.getElementById('profileContainer');
        var profileToggle = document.getElementById('profileToggle');
        var profileDropdown = document.getElementById('profileDropdown');
        var logoutBtn = document.getElementById('logoutBtn');

        var profileAvatarHeader = document.getElementById('profileAvatarHeader');
        var profileAvatarDropdown = document.getElementById('profileAvatarDropdown');
        var profileAvatarEdit = document.getElementById('profileAvatarEdit');
        var profileUsernameBadge = document.getElementById('profileUsernameBadge');
        var profileDropdownUsername = document.getElementById('profileDropdownUsername');

        var editProfileBtn = document.getElementById('editProfileBtn');
        var profileModalOverlay = document.getElementById('profileModalOverlay');
        var profileModal = document.getElementById('profileModal');
        var closeProfileModal = document.getElementById('closeProfileModal');
        var avatarInput = document.getElementById('avatarInput');
        var editProfileForm = document.getElementById('editProfileForm');
        var editName = document.getElementById('editName');
        var editEmail = document.getElementById('editEmail');
        var editPhone = document.getElementById('editPhone');

        var profileMenuItems = document.querySelectorAll('.profile-menu-item[data-action]');

        // --- Guarda / recupera datos de usuario en localStorage ---
        function getUserKey(email) {
            return 'user_data_' + btoa(unescape(encodeURIComponent(email || ''))).replace(/=/g, '');
        }

        // Carga datos del usuario desde localStorage
        function loadUserData(email) {
            if (!email) return null;
            try {
                var raw = localStorage.getItem(getUserKey(email));
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        // Guarda datos del usuario en localStorage
        function saveUserData(email, data) {
            if (!email) return;
            try {
                localStorage.setItem(getUserKey(email), JSON.stringify(data));
            } catch (e) {}
        }

        // Devuelve los datos actuales (o un obj por defecto)
        function getCurrentUserData() {
            if (!usuario) return null;
            var existing = loadUserData(usuario);
            if (existing) return existing;
            var atIdx = usuario.indexOf('@');
            var displayName = atIdx > 0 ? usuario.substring(0, atIdx) : usuario;
            displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();
            return {
                email: usuario,
                name: displayName,
                phone: '',
                avatar: ''
            };
        }

        // --- Pinta el avatar (o icono por defecto) ---
        function renderAvatar(avatarData, avatarEl) {
            if (!avatarEl) return;
            avatarEl.innerHTML = '';
            if (avatarData) {
                var img = document.createElement('img');
                img.src = avatarData;
                img.alt = 'Avatar';
                avatarEl.appendChild(img);
            } else {
                var icon = document.createElement('i');
                icon.className = 'fas fa-user default-avatar-icon';
                avatarEl.appendChild(icon);
            }
        }

        // Pinta los 3 avatares a la vez (header, dropdown, modal)
        function renderAllAvatars(userData) {
            var avatar = userData ? userData.avatar : '';
            renderAvatar(avatar, profileAvatarHeader);
            renderAvatar(avatar, profileAvatarDropdown);
            renderAvatar(avatar, profileAvatarEdit);
        }

        // Saca el nombre visible del usuario (si no hay nombre, usa el email)
        function getDisplayName(userData) {
            if (!userData) return 'Usuario';
            if (userData.name && userData.name.trim()) return userData.name.trim();
            var atIdx = (userData.email || '').indexOf('@');
            var emailPart = atIdx > 0 ? userData.email.substring(0, atIdx) : (userData.email || 'Usuario');
            return emailPart.charAt(0).toUpperCase() + emailPart.slice(1).toLowerCase();
        }

        // Pinta nombre + avatares en el header
        function renderProfileInfo() {
            var userData = getCurrentUserData();
            var displayName = getDisplayName(userData);
            var badgeName = displayName.length > 10 ? displayName.substring(0, 9) + '…' : displayName;

            if (profileUsernameBadge) profileUsernameBadge.textContent = badgeName;
            if (profileDropdownUsername) profileDropdownUsername.textContent = displayName;
            renderAllAvatars(userData);
        }

        // Si no hay usuario en páginas protegidas, redirige al login
        var path = (window.location.pathname.split('/').pop() || '').toLowerCase();
        var isProtectedPage = path === 'index.html' || path === 'autos.html' || path === '';

        if (!usuario && isProtectedPage) {
            window.location.replace('login-registro.html');
            return;
        }

        // Usuario logueado: oculta "Mi Cuenta", muestra perfil
        if (usuario && profileContainer) {
            if (accountBtn) accountBtn.style.display = 'none';
            profileContainer.style.display = '';
            renderProfileInfo();
        }

        // --- Abre / cierra el dropdown del perfil ---
        function closeProfileDropdown() {
            if (profileContainer) profileContainer.classList.remove('open');
            if (profileToggle) profileToggle.setAttribute('aria-expanded', 'false');
        }

        if (profileToggle) {
            profileToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var isOpen = profileContainer.classList.toggle('open');
                profileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });
        }

        document.addEventListener('click', function (e) {
            if (profileContainer && !profileContainer.contains(e.target)) {
                closeProfileDropdown();
            }
            if (profileDropdown && !profileDropdown.contains(e.target) && !profileToggle.contains(e.target)) {
                closeProfileDropdown();
            }
        });

        // --- Acciones de los items del menú del perfil ---
        if (profileMenuItems) {
            profileMenuItems.forEach(function (item) {
                item.addEventListener('click', function () {
                    var action = item.getAttribute('data-action');
                    closeProfileDropdown();
                    var messages = {
                        profile: 'Sección "Mi perfil" — aquí puedes ver tus datos personales.',
                        comments: 'Sección "Comentarios" — aquí aparecerán tus comentarios.',
                        notifications: 'Sección "Notificaciones" — aquí verás tus alertas.',
                        requests: 'Sección "Solicitudes" — aquí gestionarás tus solicitudes.',
                        lists: 'Sección "Mis listas" — aquí guardarás tus listas personalizadas.',
                        saved: 'Sección "Guardado" — aquí verás los elementos guardados.',
                        history: 'Sección "Historial" — aquí aparece tu historial de reservas.'
                    };
                    alert(messages[action] || 'Próximamente...');
                });
            });
        }

        // --- Cerrar sesión ---
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                try { sessionStorage.removeItem('usuario'); } catch (e) {}
                closeProfileDropdown();
                window.location.replace('login-registro.html');
            });
        }

        // --- Modal de edición de perfil ---
        // Carga los datos en el modal y lo abre
        function openEditModal() {
            var userData = getCurrentUserData();
            if (editName) editName.value = userData.name || '';
            if (editEmail) editEmail.value = userData.email || '';
            if (editPhone) editPhone.value = userData.phone || '';
            renderAvatar(userData.avatar, profileAvatarEdit);
            if (profileModalOverlay) profileModalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            closeProfileDropdown();
        }

        // Cierra el modal
        function closeEditModal() {
            if (profileModalOverlay) profileModalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }

        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function (e) {
                e.preventDefault();
                openEditModal();
            });
        }

        if (closeProfileModal) {
            closeProfileModal.addEventListener('click', closeEditModal);
        }

        if (profileModalOverlay) {
            profileModalOverlay.addEventListener('click', function (e) {
                if (e.target === profileModalOverlay) closeEditModal();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && profileModalOverlay && profileModalOverlay.style.display === 'flex') {
                closeEditModal();
            }
        });

        // --- Subida de foto de perfil (preview + validación 5MB) ---
        var currentAvatarData = '';

        if (avatarInput) {
            avatarInput.addEventListener('change', function (e) {
                var file = e.target.files && e.target.files[0];
                if (!file) return;

                if (!file.type.startsWith('image/')) {
                    alert('Por favor, selecciona un archivo de imagen válido.');
                    return;
                }

                if (file.size > 5 * 1024 * 1024) {
                    alert('La imagen es demasiado grande. Máximo 5MB.');
                    return;
                }

                var reader = new FileReader();
                reader.onload = function (event) {
                    currentAvatarData = event.target.result;
                    renderAvatar(currentAvatarData, profileAvatarEdit);
                    renderAvatar(currentAvatarData, profileAvatarHeader);
                    renderAvatar(currentAvatarData, profileAvatarDropdown);
                };
                reader.onerror = function () {
                    alert('No se pudo cargar la imagen. Inténtalo de nuevo.');
                };
                reader.readAsDataURL(file);
            });
        }

        // --- Guarda la edición de perfil en localStorage ---
        if (editProfileForm) {
            editProfileForm.addEventListener('submit', function (e) {
                e.preventDefault();
                var userData = getCurrentUserData();
                var newName = editName ? editName.value.trim() : '';
                var newPhone = editPhone ? editPhone.value.trim() : '';

                userData.name = newName || getDisplayName(userData);
                userData.phone = newPhone;
                if (currentAvatarData) {
                    userData.avatar = currentAvatarData;
                }

                saveUserData(usuario, userData);
                renderProfileInfo();
                closeEditModal();

                var btn = editProfileForm.querySelector('.profile-save-btn');
                if (btn) {
                    var originalText = btn.textContent;
                    btn.textContent = '¡Guardado!';
                    btn.style.background = '#16a34a';
                    setTimeout(function () {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 1400);
                }
            });
        }

    })();

});