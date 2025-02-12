import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/UnrealBloomPass.js';

let scene, camera, renderer, galaxy;
let composer, bloomPass

// Inicializa la escena
function init() {
    // Escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color("black");

    // Cámara
    const fov = 50;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.01;
    const far = 1000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0.5, 0);

    // Renderizador
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Cargar el modelo de la galaxia
    const loader = new GLTFLoader();
    loader.load('./models/galaxy/scene.gltf', function (gltf) {
        galaxy = gltf.scene;
        galaxy.position.set(-1.4, -1.5, 1.4);
        scene.add(galaxy);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update(); // Permite movimientos de la cámara
    controls.target.set(0, 0, 0); // Establece el centro de la rotación en el origen
    controls.minDistance = 0.7;  // Distancia mínima permitida
    controls.maxDistance = 3; // Distancia máxima permitida

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const screenSize = new THREE.Vector2(window.innerWidth, window.innerHeight)
    bloomPass = new UnrealBloomPass(screenSize, 1.5, 1.5, 0);
    composer.addPass(bloomPass);

    animate();
}


let angle = 0; // Ángulo inicial
const radius = 2; // Definir el radio de la órbita

// Animación de la galaxia
function animate() {
    requestAnimationFrame(animate);

    // Movimiento circular en X-Z
    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);

    camera.lookAt(0, 0, 0); // Mirar siempre al centro

    angle += 0.002; // Velocidad de rotación

    // renderer.render(scene, camera);
    composer.render();
}

// Manejo de redimensionamiento
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar escena
init();