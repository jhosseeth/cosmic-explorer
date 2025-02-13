document.addEventListener("DOMContentLoaded", function () {
    const isDataComplete = JSON.parse(localStorage.getItem('isDataComplete')); // Obtener datos guardados

    // 🚀 CONFIGURACIÓN DEL CANVAS PARA EL EFECTO HIPERESPACIAL
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let isAnimating = true; // Controla si la animación está activa
    let animationFrameId; // Almacena el requestAnimationFrame

    const stars = [];
    const numStars = 350;
    const speedMultiplier = 14; // 🚀 Velocidad ajustada
    const minDistanceFromCenter = 150; // ✨ Evita saturación en el centro

    // 🎨 Colores sutiles con más azuladas, pero casi blancas
    const colors = [
        "rgba(255, 252, 250, 0.9)",  // Blanco cálido
        "rgba(255, 255, 255, 0.9)",  // Blanco puro
        "rgba(245, 250, 255, 0.9)",  // Blanco con leve tono azul
        "rgba(230, 240, 255, 0.9)",  // Azul pálido, casi blanco
        "rgba(250, 245, 255, 0.9)"   // Blanco con un ligero magenta
    ];

    function generateStar() {
        let x, y, distance;
        do {
            x = Math.random() * canvas.width - canvas.width / 2;
            y = Math.random() * canvas.height - canvas.height / 2;
            distance = Math.sqrt(x * x + y * y);
        } while (distance < minDistanceFromCenter);

        return {
            x: x,
            y: y,
            z: Math.random() * canvas.width,
            baseSpeed: Math.random() * 3 + speedMultiplier, // Base de velocidad
            color: colors[Math.floor(Math.random() * colors.length)]
        };
    }

    for (let i = 0; i < numStars; i++) {
        stars.push(generateStar());
    }

    function animateStars() {
        if (!isAnimating) return; // Si isAnimating es false, no ejecuta más frames

        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        for (let star of stars) {
            let speedFactor = star.z / canvas.width; // 📌 Factor para dar profundidad
            let speed = star.baseSpeed * (1 - speedFactor); // 🔹 Más lento en la periferia

            star.z -= speed;
            if (star.z <= 0) {
                Object.assign(star, generateStar());
            }

            let sx = (star.x / star.z) * canvas.width;
            let sy = (star.y / star.z) * canvas.height;
            let size = Math.max((1 - star.z / canvas.width) * 2, 0.2); // 🔻 Tamaño más reducido

            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        animationFrameId = requestAnimationFrame(animateStars);
    }

    function stopAnimation() {
        isAnimating = false;
        cancelAnimationFrame(animationFrameId); // Detiene el requestAnimationFrame
    }

    animateStars();

    window.audio = new Audio();
    window.audio.src = (isDataComplete) ? './sounds/message.mp3' : './sounds/main.mp3';

    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.addEventListener('click', () => {
            document.getElementById('loading-screen').classList.add('hide');
            document.getElementById('title').classList.remove('hidden');
            document.getElementById('msg').classList.remove('hidden');
            document.getElementById('to-form').classList.remove('hidden');

            // Reproduce el audio
            window.audio.loop = true;
            window.audio.volume = 0.5;
            window.audio.play().catch(error => console.error('Error al reproducir audio:', error));
            
            // Detiene la animación del fondo estelar
            setTimeout(() => {
                stopAnimation();
            }, 1500); // 1.5 seconds delay
        });
    }
});