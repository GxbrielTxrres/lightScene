import DisableControls from "/Users/GTorr/OneDrive/Desktop/modules/disableControls";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import "./style.css";

const btn = document.querySelector(".btn");

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const params = {
  color: 0xff2ccc,
};

// Canvas
const canvas = document.querySelector("canvas");
const textureLoader = new THREE.TextureLoader();
const displacementMap = textureLoader.load("/textures/door/height.jpg");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const dirLight = new THREE.DirectionalLight(0xff2ccc, 0.5);
dirLight.position.set(1, 0.25, 0);

const hemiLight = new THREE.HemisphereLight("red", "blue", 0.3);

const pointLight = new THREE.PointLight(0xffff00, 0.5, 10, 2);

const rectAreaLight = new THREE.RectAreaLight(0xfff000, 5, 1, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(0, 0, 0);
pointLight.position.set(1, 0.5, 1);
scene.add(dirLight, hemiLight, pointLight, rectAreaLight);

const dirLightFolder = gui.addFolder("Directional Light");
const dirLightPosFolder = dirLightFolder.addFolder("Position");
dirLightPosFolder.add(dirLight.position, "x").min(0).max(1).step(0.01);
dirLightPosFolder.add(dirLight.position, "y").min(0).max(1).step(0.01);
dirLightPosFolder.add(dirLight.position, "z").min(0).max(1).step(0.01);

const dirLightTweaks = dirLightFolder.addFolder("Tweaks");
dirLightTweaks.add(dirLight, "intensity").min(0).max(10).step(0.01);

dirLightTweaks.addColor(params, "color").onChange(() => {
  dirLight.color.set(params.color);
});
dirLightTweaks.add(dirLight, "visible");

const hemiLightFolder = gui.addFolder("Hemisphere Light");
const hemiLightPosFolder = hemiLightFolder.addFolder("Position");
hemiLightPosFolder.add(hemiLight.position, "x").min(0).max(1).step(0.01);
hemiLightPosFolder.add(hemiLight.position, "y").min(0).max(1).step(0.01);
hemiLightPosFolder.add(hemiLight.position, "z").min(0).max(1).step(0.01);

const hemiLightTweaks = hemiLightFolder.addFolder("Tweaks");
hemiLightTweaks.add(hemiLight, "intensity").min(0).max(1).step(0.01);
hemiLightTweaks.addColor(params, "color").onChange(() => {
  hemiLight.color.set(params.color);
});
hemiLightTweaks.add(hemiLight, "visible");

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial({
  roughness: 0.4,
  displacementScale: 0,
  wireframe: true,
});
material.displacementMap = displacementMap;

const materialTweaks = gui.addFolder("Material Tweaks");
materialTweaks.addColor(params, "color").onChange(() => {
  material.color.set(params.color);
});
// materialTweaks.add(material, "roughness").min(0).max(1).step(0.01);
// materialTweaks.add(material, "metalness").min(0).max(1).step(0.01);
material.transparent = true;
materialTweaks.add(material, "opacity").min(0).max(1).step(0.01);
// materialTweaks.add(material, "displacementScale").min(0).max(5).step(0.01);
// materialTweaks.add(material, "displacementBias").min(0).max(5).step(0.01);
// materialTweaks.add(material, "wireframe");
// console.log(material);
// Objects
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-1.5, 0, 0);
camera.lookAt(torus);

// Controls
const controls = new OrbitControls(camera, canvas);
DisableControls(controls, false, false, false, false);
// controls.listenToKeyEvents(window);
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let t = [
  pointLight.add(camera),
  hemiLight.add(camera),
  sphere.add(camera),
  torus.add(camera),
  cube.add(camera),
  rectAreaLight.add(camera),
];

let i = 0;
btn.onclick = function change() {
  let x = t[i++];
  i === t.length ? (i = 0) : null;
  return x.add(camera), camera.updateProjectionMatrix();
};
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  pointLight.position.y = Math.sin(elapsedTime / 2);
  pointLight.position.x = Math.cos(elapsedTime / 2);

  hemiLight.position.y = Math.sin(elapsedTime);
  hemiLight.position.x = Math.cos(elapsedTime);
  hemiLight.intensity = Math.sin(elapsedTime / 2) * 2;

  material.displacementScale = Math.cos(elapsedTime);
  material.displacementBias = Math.cos(elapsedTime / 2);

  material.metalness = Math.cos(elapsedTime);
  material.roughness = Math.sin(elapsedTime / 2);
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
