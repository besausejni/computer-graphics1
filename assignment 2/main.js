import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ---------- SCENE ----------
// Krijon skenën ku do vendosen të gjitha objektet
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Sfondi i bardhë

// ---------- CAMERA ----------
// Krijon kamerën perspektive
const camera = new THREE.PerspectiveCamera(
  75, // FOV (field of view)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Afërsi minimal
  1000 // Afërsi maksimal
);
camera.position.set(12, 8, 12); // Vendos kamerën në pozicionin 3D

// ---------- RENDERER ----------
// Krijon renderer-in që do vizualizojë skenën
const renderer = new THREE.WebGLRenderer({ antialias: true }); // Antialias për skena më të buta
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Aktivizon hije
document.getElementById('scene').appendChild(renderer.domElement); // Bashkëngjit canvas në DOM

// ---------- CONTROLS ----------
// Krijon kontrolluesin për të lëvizur kamerën
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Lëvizje e butë
controls.target.set(0, 0, 0); // Qendër e fokusit të kamerës

// ---------- LIGHTS ----------
// Dritë ambientale për ndriçim të përgjithshëm
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Dritë direksionale që krijon hije
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(10, 20, 10);
scene.add(dirLight);

// ---------- TEXTURE LOADER ----------
// Krijon loader për ngarkimin e teksturave
const textureLoader = new THREE.TextureLoader();

// ---------- TEXTURES ----------
// Ngarkon teksturat për tokën, rrugën dhe ndërtesat
const grassTex = textureLoader.load('texturess/grass.jpg');
grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping; // Ripërsëritja e teksturës
grassTex.repeat.set(6, 6);

const roadTex = textureLoader.load('texturess/road.jpg');
roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
roadTex.repeat.set(1, 1);

const brickTex = textureLoader.load('texturess/brick.jpg');
const concreteTex = textureLoader.load('texturess/concrete.jpg');

// ---------- MATERIALS ----------
// Krijon materialet për objektet
const matGrass = new THREE.MeshStandardMaterial({ map: grassTex });
const matRoad = new THREE.MeshStandardMaterial({ map: roadTex });
const matBrick = new THREE.MeshStandardMaterial({ map: brickTex });
const matConcrete = new THREE.MeshStandardMaterial({ map: concreteTex });
const matGlass = new THREE.MeshStandardMaterial({
  color: 0x88ccff,
  transparent: true,
  opacity: 0.5 // Material i gjysmë-transparent
});

// ---------- GROUND ----------
// Shton tokën dhe rrugën në skenë
const grass = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), matGrass);
grass.rotation.x = -Math.PI / 2; // Rrotullon tokën për t'u shtrirë horizontalisht
scene.add(grass);

const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 3), matRoad);
road.rotation.x = -Math.PI / 2;
road.position.y = 0.01; // Pak mbi tokë për të shmangur flicker
scene.add(road);

// ---------- BUILDINGS ----------
// Krijon dy ndërtesa
const building1 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 4, 2.5), matBrick);
building1.position.set(4, 2, -4); // Pozicionon ndërtesën
scene.add(building1);

const building2 = new THREE.Mesh(new THREE.BoxGeometry(2.5, 3, 2.5), matConcrete);
building2.position.set(4, 1.5, 3);
scene.add(building2);

// ---------- GLASS WINDOW ----------
// Shto një dritare xhami në ndërtesën e parë
const glassWindow = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 0.1), matGlass);
glassWindow.position.set(0, 0.5, 1.3); // Pozicion brenda ndërtesës
building1.add(glassWindow); // Bashkëngjit si fëmijë i ndërtesës

// ---------- GLTF LOADER FUNCTION ----------
// Funksion për të ngarkuar modele GLB dhe vendosur madhësinë dhe pozicionin
const gltfLoader = new GLTFLoader();

function loadGLBModel(path, position, desiredSize = 2) {
  gltfLoader.load(
    path,
    (gltf) => {
      const obj = gltf.scene;

      // Gjeneron bounding box për madhësinë dhe qendrën
      const box = new THREE.Box3().setFromObject(obj);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      // Vendos scale për madhësinë e dëshiruar
      const scaleFactor = desiredSize / Math.max(size.x, size.y, size.z);
      obj.scale.setScalar(scaleFactor);

      // Rrotullimi për ta kthyer modelin drejt
      obj.rotation.y = Math.PI / 2; 

      // Qendron modelin dhe vendos mbi tokë
      obj.position.sub(center.multiplyScalar(scaleFactor));
      obj.position.add(new THREE.Vector3(position.x, size.y * scaleFactor / 2 + position.y, position.z));


      scene.add(obj); // Shton modelin në skenë
    },
    undefined,
    (error) => {
      console.error(`Gabim në ngarkimin e modelit: ${path}`, error);
    }
  );
}

// ---------- NGARKO MODELS ----------
// Ngarkon disa modele 3D
loadGLBModel('/models/low_poly_big_forest_tree.glb', { x: -2, y: 0, z: 3 }, 4);
loadGLBModel('/models/park_bench_stylized_handpainted_game_ready.glb', { x: -2, y: -0.3, z: -3 }, 3);

// ---------- SUN ANIMATION ----------
// Krijon një dritë pike që simulohet si diell që lëviz
const sun = new THREE.PointLight(0xffee88, 1.2, 100);
scene.add(sun);
let angle = 0;

// ---------- INTERACTION ----------
// Raycaster për të kapur klikimet mbi objektet
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects([building1, building2]); // Kontrollon ndërtesat
  if (hits.length > 0) {
    hits[0].object.material.color.set(Math.random() * 0xffffff); // Ndryshon ngjyrën
  }
});

// ---------- ANIMATION LOOP ----------
// Funksioni kryesor që renderon skenën dhe animon diellin
function animate() {
  requestAnimationFrame(animate);

  angle += 0.01;
  sun.position.set(Math.cos(angle) * 10, 10, Math.sin(angle) * 10); // Dielli rrotullohet rreth skenës

  controls.update(); // Përditëson kontrolluesit
  renderer.render(scene, camera); // Renderon skenën
}
animate();

// ---------- RESIZE ----------
// Përditëson kamerën dhe renderer-in kur ndryshon madhësia e dritares
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
