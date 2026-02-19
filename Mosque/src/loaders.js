// =====================
// IMPORTET
// =====================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { scene } from './scene.js';

// =====================
// LOADERA
// =====================
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

// =====================
// TEXTURES
// =====================
const stoneTexture = textureLoader.load('/textures/stone.jpg');
const roadTexture = textureLoader.load('/textures/road.jpg');
const emissiveTexture = textureLoader.load('/textures/emissive.jpg');

stoneTexture.wrapS = stoneTexture.wrapT = THREE.RepeatWrapping;
stoneTexture.repeat.set(4, 4);

roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(8, 1);

// =====================
// FUNKSIONI KRYESOR
// =====================
function loadModels() {

  /* =====================
     GROUP – GRUPI I XHAMISË
  ===================== */
  const mosqueGroup = new THREE.Group();

  /* =====================
     MATERIALS
  ===================== */

  const wallMaterial = new THREE.MeshStandardMaterial({
    map: emissiveTexture,
    roughness: 0.6
  });

  const windowMaterial = new THREE.MeshStandardMaterial({
    map: stoneTexture,
    emissiveMap: stoneTexture,
    emissive: 0xffffff,
    emissiveIntensity: 1.3
  });

  /* =====================
     NDËRTESA KRYESORE
  ===================== */

  const extra = 0.2;
  const mainGeometry = new THREE.BoxGeometry(12 + extra, 10, 17);
  mainGeometry.translate(extra / 2, 0, -1);

  const mainBuilding = new THREE.Mesh(mainGeometry, wallMaterial);
  mainBuilding.position.y = 3.5;
  mainBuilding.castShadow = true;
  mainBuilding.receiveShadow = true;
  mosqueGroup.add(mainBuilding);

  /* =====================
     NDËRTESA ANËSORE
  ===================== */

  const sideBuilding = new THREE.Mesh(
    new THREE.BoxGeometry(10, 7, 7),
    wallMaterial
  );
  sideBuilding.position.set(-1, 3, -11);
  sideBuilding.castShadow = true;
  sideBuilding.receiveShadow = true;
  mosqueGroup.add(sideBuilding);

  /* =====================
     BOX I SIPËRM
  ===================== */

  const upperBox = new THREE.Mesh(
    new THREE.BoxGeometry(7, 8, 5),
    wallMaterial
  );
  upperBox.position.set(-1, 1, -14);
  upperBox.castShadow = true;
  upperBox.receiveShadow = true;
  mosqueGroup.add(upperBox);

  /* =====================
     HARKU I HYRJES
  ===================== */

  const entranceArch = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 2, 64, 1, false, 0, Math.PI),
    wallMaterial
  );
  entranceArch.rotation.z = Math.PI / 2;
  entranceArch.position.set(-7, 0, -9);
  entranceArch.castShadow = true;
  entranceArch.receiveShadow = true;
  mosqueGroup.add(entranceArch);

/* DRITARET */

  function createFrontWindows(gltf) {
    const offsetX = 2;
    const xPos = [-3.5, 3.5];
    const yPos = [3.2, 5.4];
    const z = 7.6;

    xPos.forEach(x => {
      yPos.forEach(y => {
        const win = gltf.scene.clone(true);
        win.scale.set(0.55, 0.55, 0.55);
        win.position.set(x, y, z);
        win.rotation.y = Math.PI;
        mosqueGroup.add(win);
      });
    });
  }

 function createSideWindows(gltf) {
  const offsetY = -2;

  
  // ANA 1 (djathtas) 3x3

  const zPosRight = [6, 1, -4];              
  const yPosRight = [3.2, 5.4, 7.6];         


  // ANA TJETËR (majtas) 2x3
  
  const zPosLeft = [1, -3];                 
  const yPosLeft = [3.2, 5.4, 7.6];          

  const baseX = 6;
  const offsetX = 0.2;
  const offsetZ = -3.5;

  const xRight = baseX + offsetX;     
  const xLeft = -(baseX + offsetX);   

 
  // ANA 1 (3x3)
  
  zPosRight.forEach((z) => {
    yPosRight.forEach((y) => {
      const win = gltf.scene.clone(true);
      win.scale.set(0.6, 0.6, 0.6);

      win.position.set(xRight, y + offsetY, z + offsetZ);
      win.rotation.y = -Math.PI / 2;
      mosqueGroup.add(win);

      const light = new THREE.PointLight(0xffb36b, 0.6, 6);
      light.position.set(xRight * 0.9, y + offsetY, z + offsetZ);
      mosqueGroup.add(light);
    });
  });

  
  // ANA TJETËR (2x3)
  
  zPosLeft.forEach((z) => {
    yPosLeft.forEach((y) => {
      const win = gltf.scene.clone(true);
      win.scale.set(0.6, 0.6, 0.6);

      win.position.set(xLeft, y + offsetY, -(z + offsetZ));
      win.rotation.y = Math.PI / 2;
      mosqueGroup.add(win);

      const light = new THREE.PointLight(0xffb36b, 0.6, 6);
      light.position.set(xLeft * 0.9, y + offsetY, -(z + offsetZ));
      mosqueGroup.add(light);
    });
  });
}

gltfLoader.load('/models/window__wooden_4_mb.glb', 
  (gltf) => { 
    createFrontWindows(gltf); 
    createSideWindows(gltf); 
  });

  /* KUPOLA KRYESORE + 3 KUPOLET E VOGLA (GLB)*/

  gltfLoader.load('/models/dome.glb', (gltf) => {

    // Kupola kryesore
    const mainDome = gltf.scene.clone(true);
    mainDome.scale.set(5, 5, 5);
    mainDome.position.set(0, 9.5, 0);

    mainDome.traverse((c) => {
      if (c.isMesh) {
        c.material = wallMaterial;
        c.castShadow = true;
        c.receiveShadow = true;
      }
    });

    mosqueGroup.add(mainDome);

    // 3 kupolat e vogla
    const domePositions = [-3.2, 0, 3.2];

    domePositions.forEach((x) => {
      const smallDome = gltf.scene.clone(true);
      smallDome.scale.set(1.2, 1.2, 1.2);
      smallDome.position.set(x - 1, 6.5, -12);

      smallDome.traverse((c) => {
        if (c.isMesh) {
          c.material = wallMaterial;
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });

      mosqueGroup.add(smallDome);
    });
  });

  /* =====================
     BAZA E KUPOLES
  ===================== */

  const domeBase = new THREE.Mesh(
    new THREE.CylinderGeometry(6, 6, 1.5, 6),
    wallMaterial
  );
  domeBase.position.y = 9;
  domeBase.castShadow = true;
  domeBase.receiveShadow = true;
  mosqueGroup.add(domeBase);

  /* =====================
     MINAREJA – GLB
  ===================== */

  gltfLoader.load('/models/marrakech-tower.glb', (gltf) => {
  const minaret = gltf.scene;

  // =====================
  // Shtojmë scale për madhësi
  // =====================
  minaret.scale.set(1, 2, 1); 

  // pozicioni
  minaret.position.set(-8, 9, -1);

  minaret.traverse((c) => {
    if (c.isMesh) {
      c.material = wallMaterial;
      c.castShadow = true;
      c.receiveShadow = true;
    }
  });

  mosqueGroup.add(minaret);
});


  // Shtojmë xhaminë në skenë
  scene.add(mosqueGroup);

  /* =====================
     MURI RRETHUES
  ===================== */

const wallHeight = 2.5;
const wallThickness = 0.5;
const wallWidth = 26;
const wallDepth = 30;
const wallY = wallHeight / 2;

const fenceWallMaterial = new THREE.MeshStandardMaterial({
  map: stoneTexture,
  roughness: 0.9
});

const frontWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
  fenceWallMaterial
);
frontWall.position.set(-1, wallY, 9);

const backWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallWidth, wallHeight, wallThickness),
  fenceWallMaterial
);
backWall.position.set(-1, wallY, -22);

const leftWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, wallDepth),
  fenceWallMaterial
);
leftWall.position.set(-14, wallY, -7.5);

const rightWall = new THREE.Mesh(
  new THREE.BoxGeometry(wallThickness, wallHeight, wallDepth),
  fenceWallMaterial
);
rightWall.position.set(12, wallY, -7.5);

scene.add(frontWall, backWall, leftWall, rightWall);


  /* =====================
     TOKA
  ===================== */

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(150, 150),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  

  /* =====================
   RRUGA
  ===================== */

  roadTexture.wrapS = roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(10, 1); 

  const roadMaterial = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: 0.6
  });

  const road = new THREE.Mesh(
    new THREE.PlaneGeometry(90, 12),
    roadMaterial
  );

  road.rotation.x = -Math.PI / 2;
  road.position.set(-7, 0.01, 15); 
  road.receiveShadow = true;

  scene.add(road);
  
  /* =====================
     DRITAT
  ===================== */

  scene.add(new THREE.AmbientLight(0x404060, 0.5));

  const moonLight = new THREE.DirectionalLight(0xffffff, 0.8);
  moonLight.position.set(15, 25, 10);
  moonLight.castShadow = true;
  scene.add(moonLight);
}

export { loadModels };
