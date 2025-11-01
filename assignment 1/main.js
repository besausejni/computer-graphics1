import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// --- SCENE ---
const scene = new THREE.Scene();

// --- CAMERA ---
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(10, 8, 10);
camera.lookAt(0, 0, 0);

// --- RENDERER ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff);
renderer.shadowMap.enabled = true;
document.getElementById('scene').appendChild(renderer.domElement);

// --- LIGHTS ---
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 10, 10);
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0xeeeeee);
scene.add(ambientLight);

// --- FUNCTION TO CREATE NUMBERED TEXTURES ---
function createNumberTexture(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f5f3f2';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 120px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// --- MATERIALS ---
const mat301 = new THREE.MeshStandardMaterial({ map: createNumberTexture('301') });
const mat302 = new THREE.MeshStandardMaterial({ map: createNumberTexture('302') });
const mat801 = new THREE.MeshStandardMaterial({ map: createNumberTexture('801'), color: 0x319aeb });
const matGrass = new THREE.MeshStandardMaterial({ color: 0x2cd159 });
const matRoad = new THREE.MeshStandardMaterial({ color: 0x454745 });
const matTrunk = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const matCrown = new THREE.MeshStandardMaterial({ color: 0x0a6b0a });
const matLeaf = new THREE.MeshStandardMaterial({ color: 0x228B22 });

// --- GEOMETRIES ---
const boxS = new THREE.BoxGeometry(1, 2, 1);
const boxL = new THREE.BoxGeometry(1, 5, 1);
const roadGeo = new THREE.PlaneGeometry(1, 10);
const planeGeo = new THREE.PlaneGeometry(10, 10);

// --- MESHES: GROUND ---
const grass = new THREE.Mesh(planeGeo, matGrass);
grass.rotation.x = -Math.PI / 2;
scene.add(grass);

const road = new THREE.Mesh(roadGeo, matRoad);
road.rotation.x = -Math.PI / 2;
road.position.set(2, 0.01, 0);
scene.add(road);

const road1 = new THREE.Mesh(roadGeo, matRoad);
road1.rotation.x = -Math.PI / 2;
road1.position.set(-1.35, 0.01, 0);
road1.rotateZ(0.74);
scene.add(road1);

// --- MESHES: BUILDINGS ---
const b301 = new THREE.Mesh(boxS, mat301);
b301.rotation.x = -Math.PI / 2;
b301.position.set(3.2, 0.5, -3);
scene.add(b301);

const b302 = new THREE.Mesh(boxS, mat302);
b302.rotation.x = -Math.PI / 2;
b302.position.set(3.2, 0.5, 1);
scene.add(b302);

const b801 = new THREE.Mesh(boxL, mat801);
b801.rotation.x = -Math.PI / 2;
b801.position.set(-1, 0.5, -1.9);
b801.rotateZ(0.74);
scene.add(b801);

// --- EDGES FOR BUILDINGS AND ROADS ---
function addEdges(mesh) {
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: mesh.material.color }));
  mesh.add(line);
}
addEdges(b301);
addEdges(b302);
addEdges(b801);
addEdges(road);
addEdges(road1);

// --- FUNCTION TO CREATE TREES ---
function createTree(type = 'normal') {
    let tree;
    if(type === 'pine') {
        const trunkGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
        const trunk = new THREE.Mesh(trunkGeo, matTrunk);
        trunk.position.y = 0.5;

        const crownGeo = new THREE.ConeGeometry(0.5, 1.5, 8);
        const crown = new THREE.Mesh(crownGeo, matCrown);
        crown.position.y = 1.75;

        tree = new THREE.Group();
        tree.add(trunk);
        tree.add(crown);
    } else {
        const trunkGeo = new THREE.CylinderGeometry(0.15, 0.15, 1);
        const trunk = new THREE.Mesh(trunkGeo, matTrunk);
        trunk.position.y = 0.5;

        const crownGeo = new THREE.SphereGeometry(0.6, 12, 12);
        const crown = new THREE.Mesh(crownGeo, matLeaf);
        crown.position.y = 1.5;

        tree = new THREE.Group();
        tree.add(trunk);
        tree.add(crown);
    }
    return tree;
}

// --- PLACE 3 RANDOM TREES (bredh + drunj normalë) ---
function placeFewTrees() {
    for(let i=0; i<3; i++) {
        const type = Math.random() > 0.5 ? 'pine' : 'normal';
        const tree = createTree(type);

        let x = Math.random() * 10 - 5;
        let z = Math.random() * 10 - 5;

        // Evito ndërtesat dhe rrugët
        if((x>2 && x<3.5 && z>-4 && z<2) || (x>-2 && x<-0.5 && z>-3 && z<2)) {
            x += Math.random() > 0.5 ? 1.5 : -1.5;
            z += Math.random() > 0.5 ? 1.5 : -1.5;
        }

        tree.position.set(x, 0, z);
        scene.add(tree);
    }
}

// --- PLACE 3 ADDITIONAL NORMAL TREES ---
function placeAdditionalNormalTrees() {
    for(let i=0; i<3; i++) {
        const tree = createTree('normal');

        let x = Math.random() * 10 - 5;
        let z = Math.random() * 10 - 5;

        if((x>2 && x<3.5 && z>-4 && z<2) || (x>-2 && x<-0.5 && z>-3 && z<2)) {
            x += Math.random() > 0.5 ? 1.5 : -1.5;
            z += Math.random() > 0.5 ? 1.5 : -1.5;
        }

        tree.position.set(x, 0, z);
        scene.add(tree);
    }
}

// Vendos pemë
placeFewTrees();
placeAdditionalNormalTrees();

// --- ORBIT CONTROLS ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = true;
controls.enablePan = true;
controls.enableZoom = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI * 0.95;
controls.target.set(0, 0.5, 0);
controls.update();

// --- ANIMATION LOOP ---
function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

// --- HANDLE RESIZE ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});