import * as THREE from 'three';
import woodTexture from './textures/textures/Stylized_Wood_Floor_001_height.png';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(woodTexture);

texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set(2, 4);

const material = new THREE.MeshBasicMaterial({
    map: texture
});

// Ndryshojmë nga kubi tek sfera
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32), // rreze=1, 32 segmente horizontal dhe vertikal
    material
);

scene.add(sphere);

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
