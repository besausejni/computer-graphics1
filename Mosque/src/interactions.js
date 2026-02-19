import { pointLight } from './lights.js';

window.addEventListener('click', () => {
  pointLight.intensity =
    pointLight.intensity === 2 ? 0.5 : 2;
});
