document.addEventListener("DOMContentLoaded", function () {
    const isDataComplete = JSON.parse(localStorage.getItem('isDataComplete'));

    const startButton = document.getElementById('to-form');
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Clicked to form');
        
            // Fade out audio if it exists
            if (window.audio) {
                const fadeAudio = setInterval(() => {
                    if (window.audio.volume > 0.1) {
                        window.audio.volume -= 0.1;
                    } else {
                        window.audio.volume = 0;
                        clearInterval(fadeAudio);
                    }
                }, 200);
            }

            // Add fade out effect to body
            document.body.style.transition = 'opacity 2s';
            document.body.style.opacity = 0;

            // Navigate after transition
            setTimeout(() => {
                window.location.href = 'formulario.html';
            }, 2000);
        });
    }

    // Solo muestro el resumen si tenemos datos completos
    if (isDataComplete) {

        const data = JSON.parse(localStorage.getItem('data'));

        // Mapa para determinar la entidades cósmica segun los rasgos
        const cosmicEntity = {
            "star_cluster": ['connector', 'teamwork', 'organizer', 'adaptive'],
            "wolf_rayet": ['inspirational', 'challenge', 'embrace', 'energy'],
            "nebula": ['creative', 'creative_space', 'creator', 'innovation'],
            "sun": ['leader', 'motivator', 'firm', 'resistance'],
            "moon": ['stability', 'support', 'analytical', 'reflection']
        }

        let scores = {};
        const traitValues = Object.values(data.traits)
        
        // Asigno puntuaciones según las respuestas
        for (const [entity, traits] of Object.entries(cosmicEntity)) {
            scores[entity] = traits.filter(trait => traitValues.includes(trait)).length
        }

        // Determino la entidades cósmica con más puntuaciones
        let bestMatch = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);

        // Reviso si hay empates entre entidades
        let tiedResults = Object.keys(scores).filter(key => scores[key] === scores[bestMatch]);

        // Si hay empates, selecciono uno al azar
        if (tiedResults.length > 1) {
            bestMatch = tiedResults[Math.floor(Math.random() * tiedResults.length)];
        }

        // Mapa de mensajes personalizados
        const cosmicMessages = {
            "star_cluster": `¡Serías un Cúmulo Estelar! Agrupaciones de estrellas nacidas juntas, conectadas por la gravedad y lazos invisibles. Como un cúmulo, eres un conector natural, uniendo personas y creando equipos fuertes con tu capacidad organizativa y adaptación.`,
            "wolf_rayet": `¡Serías una Estrella de Wolf-Rayet! Masiva, caliente y evolucionada, expandiendo intensos vientos estelares. Como esta estrella, irradias inspiración y energía, enfrentando desafíos con pasión y abrazando el cambio con valentía.`,
            "nebula": `¡Serías una Nebulosa! Un vasto y colorido vivero donde nacen nuevas estrellas. Como una nebulosa, tienes un espíritu creativo e innovador, generando ideas brillantes en un entorno que fomenta la imaginación y el descubrimiento.`,
            "sun": `¡Serías el Sol! La fuente de luz y energía de un sistema entero. Eres un líder nato, motivando a los demás con tu firmeza y resiliencia, manteniéndote fuerte incluso en los momentos de mayor presión.`,
            "moon": `¡Serías la Luna! Silenciosa pero influyente, guiando con su luz reflejada. Como la Luna, eres un apoyo fundamental, brindando estabilidad y reflexión, analizando cada situación antes de actuar y generando una sensación de calma en quienes te rodean.`
        };

        const summarySection = document.getElementById("summary");
        summarySection.innerHTML = `
            <h2>En hora buena ${data.name}!</h2>
            <h3>${cosmicMessages[bestMatch]}</h3>
        `;
        summarySection.classList.remove("hidden");
    }
});
