// Inicializar Mermaid
mermaid.initialize({ startOnLoad: true, theme: 'default' });

// Cargar contenido de clase
async function loadClase(claseNum) {
    const contentArea = document.getElementById('content-area');

    // Mostrar loading
    contentArea.innerHTML = '<div class="loading"></div><p>Cargando contenido...</p>';

    try {
        const response = await fetch(`clases/clase${claseNum}.html`);
        if (!response.ok) throw new Error('Clase no encontrada');

        const content = await response.text();
        contentArea.innerHTML = content;

        // Re-inicializar Mermaid para los nuevos diagramas
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Actualizar clase activa en el menú
        updateActiveLink(claseNum);

    } catch (error) {
        contentArea.innerHTML = `
            <article class="lesson-content">
                <h1>Error al cargar el contenido</h1>
                <p>No se pudo cargar la clase ${claseNum}. Por favor, intenta nuevamente.</p>
                <p class="text-muted">${error.message}</p>
            </article>
        `;
    }
}

// Actualizar enlace activo
function updateActiveLink(claseNum) {
    // Remover todas las clases activas
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.classList.remove('active');
    });

    // Agregar clase activa al enlace seleccionado
    const activeLink = document.querySelector(`[data-clase="${claseNum}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Event listeners para los enlaces de la sidebar
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.sidebar a[data-clase]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const claseNum = link.getAttribute('data-clase');
            loadClase(claseNum);

            // Guardar en localStorage
            localStorage.setItem('lastClase', claseNum);
        });
    });

    // Cargar última clase vista o la primera
    const lastClase = localStorage.getItem('lastClase');
    if (lastClase) {
        loadClase(lastClase);
    }
});

// Navegación con teclado
document.addEventListener('keydown', (e) => {
    const currentClase = parseInt(localStorage.getItem('lastClase') || '0');

    if (e.key === 'ArrowRight' && currentClase < 16) {
        loadClase(currentClase + 1);
    } else if (e.key === 'ArrowLeft' && currentClase > 1) {
        loadClase(currentClase - 1);
    }
});

// Smooth scroll para anclas
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});
