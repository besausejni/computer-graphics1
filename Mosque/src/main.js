import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { scene } from './scene.js';
import { camera } from './camera.js';
import { renderer } from './renderer.js';
import './lights.js';
import { loadModels } from './loaders.js';
import { animateDome } from './animations.js';
import './interactions.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

let dome = null;

loadModels(scene, (loadedDome) => {
  dome = loadedDome;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);

  if (dome) animateDome(dome);

  controls.update();
  renderer.render(scene, camera);
}

animate();
