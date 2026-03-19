import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

/**
 * This helper creates the environmental lighting and sky model. By separating
 * it from the main application class we keep the app orchestration readable for
 * beginners who are learning how scene setup differs from frame-by-frame logic.
 */
export function createEnvironment(scene: THREE.Scene): void {
  scene.background = new THREE.Color('#cddfef');
  scene.fog = new THREE.FogExp2('#b6cfdf', 0.015);

  const sky = new Sky();

  sky.scale.setScalar(10_000);

  const skyMaterialUniforms = sky.material.uniforms as {
    turbidity: { value: number };
    rayleigh: { value: number };
    mieCoefficient: { value: number };
    mieDirectionalG: { value: number };
    sunPosition: { value: THREE.Vector3 };
  };

  skyMaterialUniforms.turbidity.value = 7;
  skyMaterialUniforms.rayleigh.value = 2.8;
  skyMaterialUniforms.mieCoefficient.value = 0.005;
  skyMaterialUniforms.mieDirectionalG.value = 0.82;
  skyMaterialUniforms.sunPosition.value.setFromSphericalCoords(1, 1.1, Math.PI * 0.15);

  const hemisphereLight = new THREE.HemisphereLight('#cde8ff', '#5f4c3f', 1.5);
  const directionalSunLight = new THREE.DirectionalLight('#fff3d5', 3.5);

  directionalSunLight.position.set(8, 14, 4);
  directionalSunLight.castShadow = true;
  directionalSunLight.shadow.mapSize.set(2048, 2048);
  directionalSunLight.shadow.camera.near = 0.5;
  directionalSunLight.shadow.camera.far = 60;
  directionalSunLight.shadow.camera.left = -20;
  directionalSunLight.shadow.camera.right = 20;
  directionalSunLight.shadow.camera.top = 20;
  directionalSunLight.shadow.camera.bottom = -20;

  scene.add(sky, hemisphereLight, directionalSunLight);
}
