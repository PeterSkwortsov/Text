import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const gui = new GUI()
const debugObject = {}


const scene = new THREE.Scene();

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath('draco/');
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null

gltfLoader.load('static/Fox/Fox.gltf', (gltf) => {
    
    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[1]).play();

    gltf.scene.scale.set(0.02, 0.02, 0.02);
    scene.add(gltf.scene)
})

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 3;

const canvas = document.querySelector('canvas');

const plane = new THREE.PlaneGeometry(5,5) 
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
})

plane.receiveShadow = true
plane.castShadow = true

const light = new THREE.AmbientLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 8);
pointLight.position.set(0, 2, 2.5);
scene.add(pointLight);
pointLight.castShadow = true

const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.rotation.x = Math.PI / 180 * -90
planeMesh.receiveShadow = true
scene.add(planeMesh);






const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    
});

const objectToUpdate = []






const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

camera.aspect = sizes.width / sizes.height;


renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);

let oldElapsedTime = 0;

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    
})

const tick = () => {    
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    mixer.update(deltaTime)


    controls.update();
}

tick();