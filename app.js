import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarField.js"
const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 100;
scene.add(earthGroup);


const controls = new OrbitControls(camera, renderer.domElement)
const detail = 12;

const loader = new THREE.TextureLoader(); 
const geometry = new THREE.IcosahedronGeometry(1.0, detail);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/earthmap1k.jpg"),
    specularMap: loader.load("./assets/earthspec1k.jpg"),
    bumpMap: loader.load("./assets/earthbump1k.jpg"),
    bumpScale: 0.04,
})

const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshBasicMaterial({
    // color: 0xffffff,
    // transparent: true,
    // opacity: 0.5,
    map: loader.load("./assets/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending,
})
const lightsMesh = new THREE.Mesh(geometry, lightsMat);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./assets/earthcloudmaptrans.jpg"),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.2,
    // blending: THREE.CustomBlending,
    // blendSrc: THREE.SrcAlphaFactor,
    // blendDst: THREE.OneMinusSrcAlphaFactor,
    // blendEquation: THREE.AddEquation,
});
const cloudsMesh = new THREE.Mesh(geometry, cloudsMat);
cloudsMesh.scale.setScalar(1.02);
earthGroup.add(cloudsMesh);

const stars = getStarfield({numStars: 2000});
scene.add(stars)

// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
// scene.add(hemiLight)

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-2, 0.5, 1.5)
scene.add(sunlight)

function animate() {
    requestAnimationFrame(animate);
    lightsMesh.rotation.y += 0.002;
    earthMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animate();