document.addEventListener("DOMContentLoaded", function () {
    // Obtengo los datos del formulario
    const params = new URLSearchParams(window.location.search);
    const data = {
        name: params.get("name"),
        traits: {
            impact: params.get("impact"),
            environment: params.get("environment"),
            change: params.get("change"),
            quality: params.get("quality"),
            role: params.get("role")
        }
    }

    // Check if all required data is present
    const isDataComplete = data.name && 
        Object.values(data.traits).every(trait => trait !== null && trait !== "");

    // Only show summary if we have complete data
    if (isDataComplete) {

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

    // Always hide loading screen and show content
    document.getElementById("loading-screen").classList.add("hidden");
});
