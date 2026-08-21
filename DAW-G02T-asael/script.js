/* ============================================================
   ARCHIVO JAVASCRIPT: script.js
   PROYECTO: OTO Q CAR RENTAL
   DEPENDENCIAS: Ninguna (Vanilla JavaScript puro, sin jQuery ni librerías)
   ESTRUCTURA:
     1. Evento DOMContentLoaded (wrapper general)
     2. CARRUSEL AUTOMÁTICO DEL HERO (cada 3000ms = 3s) + pause en hover + clicks en dots
     3. Toggle menú hamburguesa (móvil)
     4. Dropdowns clicables (About, EUR, English) + cierre al hacer clic fuera
     5. Toggle de botones de categoría activa (filtros)
     6. Selector "Sort By" (ordenamiento)
     7. Widgets flotantes (click listeners)
   ============================================================ */


/* ============================================================
   1. EVENTO: DOMContentLoaded (WRAPPER GENERAL)
   ---------------------------------------------
   Espera a que TODO el árbol DOM del HTML esté construido
   (todos los <div>, <img>, <button>, <a>, <select> existen ya).
   
   ¿Por qué usar esto aunque el <script> esté al final del <body>?
   BUENA PRÁCTICA:
     - Garantiza que JS NUNCA se ejecute antes de tiempo.
     - Si alguien mueve el <script> al <head> por error, sigue funcionando.
     - Es auto-documentado.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

    /* ============================================================
       2. 🎠 CARRUSEL AUTOMÁTICO DEL HERO
       ----------------------------------------
       · Cambia de imagen cada 3 segundos (3000ms).
       · Tipo de transición: FADE CRUZADO (cross-fade) 800ms.
       · Pausa automática cuando el usuario pasa el cursor (hover)
         por encima del hero (el usuario no quiere que cambie si
         está leyendo el texto o mirando una foto).
       · Reanuda la marcha cuando el cursor sale del hero.
       · Permite saltar a una foto concreta haciendo click en
         los dots/indicadores inferiores.
       · Bucle infinito: cuando llega a la última foto vuelve a 0.
       ============================================================ */

    /* ⏱️ TIEMPO ENTRE CAMBIO DE IMÁGENES: 3000ms = 3 SEGUNDOS.
       (1000ms = 1s). Si quieres más lento: 5000 (5s), más rápido 2000. */
    const CAROUSEL_INTERVAL = 3000;

    /* ---------- SELECCIÓN DE ELEMENTOS DEL DOM ---------- */
    const hero = document.querySelector('.hero');                      /* .hero = bloque entero para detectar hover */
    const slides = document.querySelectorAll('.hero-slide');          /* TODOS los <div.hero-slide> = 4 imágenes (NodeList) */
    const dots = document.querySelectorAll('.carousel-dot');          /* TODOS los botones círculo indicador (4 dots) */
    const totalSlides = slides.length;                                 /* Número TOTAL de slides: 4. Se usa para el cálculo del loop. */

    /* ---------- VARIABLES DE ESTADO DEL CARRUSEL ---------- */
    let currentSlideIndex = 0;   /* Índice numérico de la imagen VISIBLE en este momento.
                                   Empieza en 0 porque el slide 1 (index 0) tiene la clase .active en HTML.
                                   · 0 = slide 1 "Amigos en descapotable"
                                   · 1 = slide 2 "SUV de lujo"
                                   · 2 = slide 3 "Coche deportivo rojo"
                                   · 3 = slide 4 "Familia con maletas" */

    let carouselTimer = null;    /* Variable donde guardaremos el ID del setInterval.
                                   Nos sirve para poder PAUSAR el carrusel (clearInterval)
                                   cuando el usuario haga hover, y reanudarlo después. */


    /* ---------- FUNCIÓN PRINCIPAL: CAMBIAR DE SLIDE ---------- */
    /* Recibe como parámetro el NUEVO índice al que queremos ir.
       Ejemplo: si estamos en slide 0 y queremos ir al 1 → goToSlide(1) */
    function goToSlide(newIndex) {

        /* 1️⃣ QUITAMOS la clase .active al SLIDE ACTUAL y a su DOT correspondiente.
           Así se desvanece la imagen actual y el dot verde pasa a ser blanco pequeño. */
        slides[currentSlideIndex].classList.remove('active');
        dots[currentSlideIndex].classList.remove('active');

        /* 2️⃣ GUARDAMOS el nuevo índice como "currentSlideIndex" para que la próxima
           vez que se llame a goToSlide() sepan cuál era la foto visible. */
        currentSlideIndex = newIndex;

        /* 3️⃣ AGREGAMOS la clase .active al NUEVO slide y al NUEVO dot.
           Así aparece la nueva foto con fade-in y el dot se vuelve verde lima grande. */
        slides[currentSlideIndex].classList.add('active');
        dots[currentSlideIndex].classList.add('active');

        /* (Opcional) Debug: ver en consola por qué imagen vamos. Si no lo quieres, borra la línea. */
        // console.log(`🖼️  Mostrando slide ${currentSlideIndex + 1}/${totalSlides}`);
    }


    /* ---------- FUNCIÓN: SIGUIENTE SLIDE (para el autoplay) ---------- */
    /* Calcula cuál es el siguiente índice y llama a goToSlide().
       Llega al final (index 3) → vuelve a empezar (index 0). */
    function nextSlide() {
        /* Cálculo matemático del próximo índice:
           · Si currentSlideIndex + 1 < totalSlides → suma 1
           · Si ya estamos en el último (3+1 = 4 y 4 NO es < 4) → da el resto % 4 = 0 */
        const nextIndex = (currentSlideIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }


    /* ---------- FUNCIÓN: INICIAR / REANUDAR EL AUTOPLAY ---------- */
    function startCarousel() {
        /* ⚠️ IMPORTANTE: Antes de crear un setInterval NUEVO hay que borrar el anterior.
           Sin esto, al hacer hover → salir y volver a entrar, se crearían múltiples
           timers simultáneos, la imagen cambiaría 2 o más veces de golpe. CAOS. */
        if (carouselTimer !== null) {
            clearInterval(carouselTimer);
        }

        /* setInterval = ejecuta la función EN BUCLE cada X milisegundos.
           Guarda su "ID numérico" en carouselTimer, que luego usaremos para pararlo. */
        carouselTimer = setInterval(nextSlide, CAROUSEL_INTERVAL);
    }


    /* ---------- FUNCIÓN: PAUSAR EL AUTOPLAY ---------- */
    function stopCarousel() {
        clearInterval(carouselTimer);  /* Borra el intervalo. nextSlide() ya no se llama automáticamente. */
        carouselTimer = null;          /* Volvemos a ponerlo a null para el check de startCarousel() */
    }


    /* ============================================================
       2.1 EVENTOS ASOCIADOS AL CARRUSEL
       -------------------------------------------------------- */

    /* 🖱️ EVENTO CLICK EN CADA DOT / INDICADOR */
    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            /* Leemos el atributo personalizado HTML data-slide="0|1|2|3" del botón cliqueado.
               getAttribute devuelve un STRING ("1"), así que lo convertimos a NÚMERO
               con el operador unario + ("1" → 1) para usarlo en cálculos matemáticos. */
            const targetSlide = +dot.getAttribute('data-slide');

            /* 🔁 RESETEAMOS el temporizador del autoplay.
               ¿Por qué? Porque si faltaba 0.1s para que cambiara automáticamente y el
               usuario acaba de ir manualmente a otra imagen, no queremos que 0.1s después
               cambie de nuevo sin dejarle verla. Le damos los 3s completos. */
            stopCarousel();
            goToSlide(targetSlide);
            startCarousel();
        });
    });


    /* ⏸️ EVENTO: CURSOR ENTRA EN EL HERO (hover) → PAUSA el autoplay */
    if (hero) {
        hero.addEventListener('mouseenter', function () {
            stopCarousel();
            // console.log('⏸️  Carrusel PAUSADO (mouse dentro)');
        });

        /* ▶️ EVENTO: CURSOR SALE DEL HERO → REANUDA el autoplay */
        hero.addEventListener('mouseleave', function () {
            startCarousel();
            // console.log('▶️  Carrusel REANUDADO (mouse fuera)');
        });
    }


    /* 🚀 ARRANQUE INICIAL DEL CARRUSEL
       Llamamos a startCarousel() para que empiece a contar los 3 segundos
       y cambie de imagen automáticamente. Sin esta línea = el carrusel está parado. */
    startCarousel();

    /* ============================================================
       3. TOGGLE MENÚ HAMBURGUESA (MÓVIL / TABLET)
       --------------------------------------------------------
       Botón con icono fa-bars (≡) que al hacer clic:
         - Abre/cierra el panel <div id="mobileMenu">
         - Cambia el icono: ≡ ↔ ✕ (bars ↔ times)
       ============================================================ */

    /* Obtenemos referencia al BOTÓN hamburguesa mediante su ID único.
       getElementById es el selector MÁS RÁPIDO del DOM (mejor rendimiento). */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');

    /* Obtenemos referencia al PANEL del menú móvil (el que se despliega). */
    const mobileMenu = document.getElementById('mobileMenu');

    /* Verificamos que AMBOS elementos existan en el DOM antes de operar.
       (evitamos errores "Cannot read property addEventListener of null"
       si el HTML cambiara y no tuviera estos IDs). */
    if (mobileMenuBtn && mobileMenu) {

        /* Agregamos un EVENT LISTENER al botón: escucha el evento 'click'.
           Cada vez que el usuario haga clic en hamburguesa → se ejecuta la función. */
        mobileMenuBtn.addEventListener('click', function () {

            /* 🔁 TOGGLE: alterna la clase .open en el panel del menú.
               .toggle() = si NO tiene la clase → se la agrega.
                           si SÍ tiene la clase → se la quita.
               En CSS: .mobile-menu.open { display: block; } lo hace visible. */
            mobileMenu.classList.toggle('open');

            /* Cambiamos el ICONO Font Awesome dentro del botón: ≡ ↔ ✕
               Usamos querySelector('i') sobre el botón = busca <i> solo DENTRO
               del botón hamburguesa (no busca en todo el documento). */
            const icon = mobileMenuBtn.querySelector('i');

            /* Si el menú ESTÁ ABIERTO (tiene clase .open) → ponemos icono ✕ (times)
               para que el usuario pueda "cerrar" al hacer clic de nuevo. */
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');  // Quita icono ≡
                icon.classList.add('fa-times');    // Agrega icono ✕
            } else {
                /* Si el menú ESTÁ CERRADO → volvemos a icono ≡ (bars) */
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


    /* ============================================================
       4. DROPDOWNS CLICABLES (About, EUR, English)
       --------------------------------------------------------
       Por defecto los dropdowns se abren con :hover en escritorio.
       Pero en DISPOSITIVOS TÁCTILES (móvil/tablet) NO existe :hover,
       por eso agregamos comportamiento por CLICK también.
       
       Lógica:
         · Al hacer clic en un toggle:
           - Primero CIERRA TODOS los demás dropdowns abiertos
           - Luego abre/cierra SOLO el dropdown cliqueado
         · Al hacer clic FUERA de cualquier dropdown → cierra TODOS.
       ============================================================ */

    /* Seleccionamos TODOS los elementos con clase .dropdown-toggle
       (los 3: About, EUR, English).
       querySelectorAll devuelve una NodeList (similar a un array). */
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    /* Iteramos sobre CADA toggle para agregarle su propio event listener.
       Usamos forEach = método moderno (mejor legibilidad que for clásico). */
    dropdownToggles.forEach(function (toggle) {

        toggle.addEventListener('click', function (e) {
            /* e = objeto Event: contiene toda la info del click (dónde, cuándo, etc.)
               Guardamos en variable el PADRE .dropdown del toggle cliqueado.
               .closest('.dropdown') = busca hacia ARRIBA en el árbol DOM (padres, abuelos...)
               el PRIMER ancestro que tenga la clase .dropdown.
               Esto es mejor que .parentElement porque el HTML interno podría cambiar. */
            const dropdown = toggle.closest('.dropdown');

            /* Guardamos si ESTE dropdown YA ESTÁ ABIERTO antes de manipularlo.
               Importante: lo guardamos ANTES de cerrar los demás para saber qué hacer. */
            const isActive = dropdown.classList.contains('active');

            /* 🔄 PRIMERO: CERRAMOS TODOS los dropdowns existentes.
               Recorremos TODOS los .dropdown del DOM y les quitamos .active
               Así solo puede haber 1 abierto a la vez (mejor UX). */
            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('active');
            });

            /* SEGUNDO: Si ESTE dropdown NO estaba abierto (!isActive = true),
               entonces lo ABRIMOS. Si ya estaba abierto, al haberlo cerrado
               en el paso anterior queda CERRADO (toggle perfecto). */
            if (!isActive) {
                /* e.preventDefault() evita el comportamiento POR DEFECTO del <a>.
                   En el caso de "About" (un <a href="#">), sin esto el navegador
                   intentaría ir al ancla "#" y haría un salto no deseado hacia arriba. */
                e.preventDefault();

                /* Agregamos la clase .active. En CSS:
                   .dropdown.active .dropdown-menu { opacity: 1; visibility: visible; }
                   → esto muestra el submenú con efecto fade-in. */
                dropdown.classList.add('active');
            }
        });
    });


    /* ============================================================
       4.1 CIERRE DE DROPDOWNS AL HACER CLIC "FUERA"
       --------------------------------------------------------
       El usuario espera que al hacer clic en CUALQUIER LUGAR que NO sea
       un dropdown → todos los dropdowns se cierren (comportamiento estándar).
       
       Escuchamos el evento 'click' en TODO el documento.
       ============================================================ */
    document.addEventListener('click', function (e) {

        /* 🔍 Lógica de comprobación:
           e.target = el elemento MÁS INTERNO donde se hizo clic exactamente.
           .closest('.dropdown') = busca si el clic fue DENTRO de algún
           elemento con clase .dropdown (o en el propio .dropdown padre).
           
           Si !e.target.closest('.dropdown') devuelve TRUE → el clic fue
           EN UN ELEMENTO QUE NO PERTENECE A NINGÚN DROPDOWN → hay que cerrarlos. */
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('active');  // Quita la clase de "abierto" a todos
            });
        }
    });


    /* ============================================================
       5. TOGGLE DE CATEGORÍAS ACTIVAS (FILTROS)
       --------------------------------------------------------
       Botones: All Vehicles, A/C, Automatic, Compact, etc.
       
       Lógica:
         · Solo UNA categoría puede estar activa a la vez
         · Al hacer clic en una → quita .active de todas → pone .active en la cliqueada
         · También lee el atributo data-category="..." (útil para filtrar vehículos luego)
       ============================================================ */

    /* Seleccionamos TODOS los botones de categoría */
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(function (btn) {

        btn.addEventListener('click', function () {

            /* PRIMERO: Quitamos la clase .active a TODOS los botones
               (dejamos "limpio" el estado antes de marcar el nuevo). */
            categoryBtns.forEach(function (b) {
                b.classList.remove('active');
            });

            /* SEGUNDO: Agregamos .active SOLO al botón que el usuario acaba de cliqueas.
               En CSS: .category-btn.active { fondo negro, texto blanco } */
            btn.classList.add('active');

            /* ============================================================
               EJEMPLO DE CÓMO CONECTAR ESTO A UN FILTRADO REAL:
               
               Obtenemos el valor del atributo personalizado data-category
               (definido en el HTML como data-category="ac", "automatic", etc.)
               
               Este valor normalmente lo usarías para:
               a) Filtrar un array de vehículos en JS
               b) Hacer una petición fetch() a la API con ?categoria=valor
               c) Actualizar la URL con ?category=valor para deep-linking
               
               Por ahora solo lo mostramos por consola para debug.
               ============================================================ */
            const category = btn.getAttribute('data-category');
            console.log('Categoría seleccionada:', category);
        });
    });


    /* ============================================================
       6. SELECTOR "SORT BY" (ORDENAMIENTO)
       --------------------------------------------------------
       Menú <select> con opciones: Featured, Precio ↑, Precio ↓, Nombre A-Z, Z-A
       ============================================================ */

    /* Obtenemos referencia al <select> por su ID */
    const sortSelect = document.getElementById('sortSelect');

    /* Verificamos que exista antes de añadir el listener (buena práctica siempre) */
    if (sortSelect) {

        /* Evento 'change' = se dispara CUANDO EL USUARIO SELECCIONA OTRA OPCIÓN DIFERENTE.
           (a diferencia de 'click', que se dispara al abrir el menú también). */
        sortSelect.addEventListener('change', function () {

            /* sortSelect.value = el valor del atributo "value" del <option> seleccionado:
               · 'featured' | 'price-low' | 'price-high' | 'name' | 'name-reverse'
               
               Normalmente usarías este valor para:
               a) Ordenar un array .sort() en JS
               b) Hacer fetch() con ?order=price-low
               ============================================================ */
            console.log('Orden seleccionado:', sortSelect.value);
        });
    }


    /* ============================================================
       7. WIDGET FLOTANTE IZQUIERDO (DESPLEGABLE)
       --------------------------------------------------------
       · Panel colapsado por defecto.
       · En desktop: se despliega con :hover (CSS).
       · En táctil/móvil: botón toggle alterna clase .open.
       · Iconos: Refresh 🔄 | WhatsApp 📞 | TikTok 🎵 | Phone 📱
       ============================================================ */

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

    /* Seleccionamos TODOS los enlaces dentro del widget flotante */
    const widgetItems = document.querySelectorAll('.widget-item');

    widgetItems.forEach(function (item) {

        item.addEventListener('click', function (e) {

            /* Evitamos que el <a> navegue a "#" (salto arriba feo). */
            e.preventDefault();

            /* Obtenemos el atributo title="Refresh/WhatsApp/Email/Phone"
               para saber qué botón clickeó el usuario.

               En una implementación real harías:
               · Refresh →   location.reload()
               · WhatsApp →  window.open('https://wa.me/34600000000', '_blank')
               · Email →     window.location.href = 'mailto:info@otoq.com'
               · Phone →     window.location.href = 'tel:+34600000000'
               ============================================================ */
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


    /* ============================================================
       8. CAMBIO DE IDIOMA (Español / English)
       --------------------------------------------------------
       · Traducciones almacenadas en objeto translations.
       · Lee data-i18n de cada elemento y sustituye su texto.
       · Guarda selección en localStorage para persistir.
       · Idioma por defecto: español ('es').
       ============================================================ */

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
