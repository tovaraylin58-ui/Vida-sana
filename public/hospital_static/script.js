/**
 * ==========================================================================
 * COMPORTAMIENTO INTERACTIVO JAVASCRIPT - HOSPITAL VIDA SANA
 * Compatible de forma nativa en Chrome, Edge, Safari, Firefox y Opera.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MENÚ DE NAVEGACIÓN MÓVIL (Hamburguesa) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Cerrar el menú al hacer clic en cualquier enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });


    // --- 2. VINCULAR TARJETAS DE MÉDICOS CON FORMULARIO (UX Autofill) ---
    const bookButtons = document.querySelectorAll('.btn-book-doc');
    const formSpecialty = document.getElementById('especialidad');
    const formDoctor = document.getElementById('medico');

    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const specialty = button.getAttribute('data-specialty');
            const doctorName = button.getAttribute('data-doctor');

            if (specialty && formSpecialty) {
                formSpecialty.value = specialty;
            }

            if (doctorName && formDoctor) {
                // Pequeño timeout para permitir que la especialidad cambie
                setTimeout(() => {
                    formDoctor.value = doctorName;
                }, 50);
            }
        });
    });


    // --- 3. FORMULARIO DE CITAS Y VALIDACIÓN ---
    const appointmentForm = document.getElementById('appointmentForm');
    const formFeedback = document.getElementById('formFeedback');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitar envío automático de prueba

            // Obtener campos
            const nombre = document.getElementById('nombre').value.trim();
            const correo = document.getElementById('correo').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const especialidad = document.getElementById('especialidad').value;
            const medico = document.getElementById('medico').value;
            const fechaVal = document.getElementById('fecha').value;

            // Reiniciar estilos de retroalimentación
            formFeedback.style.display = 'none';
            formFeedback.className = 'form-feedback';

            // 1. Validar nombre largo
            if (nombre.length < 3) {
                showFeedback("Por favor ingrese su nombre y apellido completo (Mínimo 3 caracteres).", "error");
                return;
            }

            // 2. Validar correo por regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                showFeedback("Por favor ingrese una dirección de correo válida.", "error");
                return;
            }

            // 3. Validar teléfono numérico (mínimo 7 caracteres)
            const phoneRegex = /^[+]?[0-9\s-]{7,15}$/;
            if (!phoneRegex.test(telefono)) {
                showFeedback("Por favor ingrese un número telefónico de contacto válido (Mínimo 7 dígitos).", "error");
                return;
            }

            // 4. Validar fecha que no sea del pasado
            if (!fechaVal) {
                showFeedback("Por favor seleccione un día para su cita médica.", "error");
                return;
            }

            const chosenDate = new Date(fechaVal + "T00:00:00");
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (chosenDate < today) {
                showFeedback("La fecha de su consulta médica no puede ser en el pasado.", "error");
                return;
            }

            // Simulación asíncrona de envío a base de datos de salud
            showFeedback("Enviando y validando solicitud de cita con el especialista...", "loading");
            
            const submitButton = document.getElementById('submit-btn');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Procesando...";
            }

            setTimeout(() => {
                const ticketCode = "VS-PRE-" + Math.floor(100000 + Math.random() * 900000);
                
                showFeedback(`¡Solicitud de cita exitosa! Su boleto es: <strong>${ticketCode}</strong>. Un especialista le contactará por llamada en menos de 15 minutos.`, "success");
                
                // Reiniciar formulario
                appointmentForm.reset();
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = "Enviar Solicitud de Cita";
                }
            }, 1800);
        });
    }

    function showFeedback(message, type) {
        if (!formFeedback) return;
        
        formFeedback.innerHTML = message;
        formFeedback.style.display = 'block';
        
        if (type === "error") {
            formFeedback.style.backgroundColor = '#ffe3e6';
            formFeedback.style.color = '#dc3545';
            formFeedback.style.border = '1px solid #fec7cb';
        } else if (type === "loading") {
            formFeedback.style.backgroundColor = '#e8f4fd';
            formFeedback.style.color = '#0056b3';
            formFeedback.style.border = '1px solid #bce1fb';
        } else if (type === "success") {
            formFeedback.style.backgroundColor = '#d4edda';
            formFeedback.style.color = '#155724';
            formFeedback.style.border = '1px solid #c3e6cb';
        }
    }


    // --- 4. CARRUSEL DE TESTIMONIOS AUTOMÁTICO Y MANUAL ---
    const slides = document.querySelectorAll('.testimonial-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    let currentSlide = 0;
    let autoPlayInterval;

    function showSlide(index) {
        // Asegurar que el índice esté dentro del rango
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Ocultar todas las slides y quitar clase activa a los dots
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.display = 'none';
        });
        dots.forEach(dot => dot.classList.remove('active'));

        // Mostrar slide actual y encender dot correspondiente
        slides[currentSlide].style.display = 'block';
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Eventos para botones flechas
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    // Eventos para clicking dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoPlay();
        });
    });

    // Iniciar auto rotación cada 5 segundos
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    // Inicializar carrusel
    if (slides.length > 0) {
        showSlide(0);
        startAutoPlay();
    }


    // --- 5. AÑO ACTUAL AUTOMÁTICO EN FOOTER ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
