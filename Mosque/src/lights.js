import * as THREE from 'three';
import { scene } from './scene.js';

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;

const pointLight = new THREE.PointLight(0xffaa55, 2, 50);
pointLight.position.set(0, 10, 0);
pointLight.castShadow = true;

scene.add(ambientLight, directionalLight, pointLight);

export { pointLight };
