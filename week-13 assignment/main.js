import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(800, 600);
document.getElementById("scene").appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
    75,
    renderer.domElement.width / renderer.domElement.height,
    0.1,
    100
);
camera.position.set(1, 0, 5);
scene.add(camera);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const raycaster = new THREE.Raycaster();
raycaster.near = 0.0;
raycaster.far = 100;

const mouse = new THREE.Vector2();
const cubes = [];

let lastSelectedCube = null;
let lastColor = null;

// UI ELEMENT
const infoPanel = document.getElementById("cubeInfo");
infoPanel.innerText = "Click a cube to see its information here.";

// Create random cubes
for (let i = 0; i < 20; i++) {
    const w = randBetween(0.3, 1.2);
    const h = randBetween(0.3, 1.2);
    const d = randBetween(0.3, 1.2);

    const geo = new THREE.BoxGeometry(w, h, d);
    const mat = new THREE.MeshStandardMaterial({
        color: getRandomColor()
    });

    const cube = new THREE.Mesh(geo, mat);

    cube.position.set(
        randBetween(-4, 4),
        randBetween(-3, 3),
        randBetween(-5, 0)
    );

    scene.add(cube);
    cubes.push(cube);
}

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(4, 5, 3);
scene.add(light);

// Mouse click
window.addEventListener("click", (event) => {

    const rect = renderer.domElement.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const hits = raycaster.intersectObjects(cubes);

    if (hits.length > 0) {

        const selected = hits[0].object;

        // Remove highlight from old cube
        if (lastSelectedCube && lastSelectedCube !== selected) {
            lastSelectedCube.material.color.set(lastColor);
            lastSelectedCube.scale.set(1, 1, 1);
        }

        // Store new selected cube
        lastSelectedCube = selected;
        lastColor = selected.material.color.getHex();

        // Highlight cube
        selected.material.color.set(0xffff00);
        selected.scale.set(1.2, 1.2, 1.2);

        // Show info
        infoPanel.innerHTML =
            `Cube selected:<br>
             Position: (${selected.position.x.toFixed(2)}, 
                        ${selected.position.y.toFixed(2)}, 
                        ${selected.position.z.toFixed(2)})<br>
             Size: (${selected.geometry.parameters.width.toFixed(2)},
                    ${selected.geometry.parameters.height.toFixed(2)},
                    ${selected.geometry.parameters.depth.toFixed(2)})`;

    } else {
        // Clicked empty space
        if (lastSelectedCube) {
            lastSelectedCube.material.color.set(lastColor);
            lastSelectedCube.scale.set(1, 1, 1);
            lastSelectedCube = null;
        }

        infoPanel.innerText = "No object selected.";
    }
});

window.addEventListener('resize', () => {
    const width = renderer.domElement.clientWidth;
    const height = renderer.domElement.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

function animate() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

// Utility random functions
function randBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomColor() {
    return Math.random() * 0xffffff;
}

