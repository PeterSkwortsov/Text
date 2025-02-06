import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { materialColor } from 'three/tsl';
import gsap from 'gsap';
import CANNON from 'cannon';

const gui = new GUI()


const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();

const mapTexture = textureLoader.load('static/textures/one.png');

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
pointLight.position.set(0, 2, 1.5);
scene.add(pointLight);
pointLight.castShadow = true

const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.rotation.x = Math.PI / 180 * -90
planeMesh.receiveShadow = true
scene.add(planeMesh);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshToonMaterial({
        color: 0xffffff,
        emissiveIntensity: 0.2, 
        gradientMap: mapTexture,
    })
)
sphere.position.set(0, 1, 0)
sphere.castShadow = true
scene.add(sphere);

const world = new CANNON.World();
world.gravity.set(0, -8.82, 0);

const sphereShape = new CANNON.Sphere(0.3);
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 5, 0),
    shape: sphereShape
})

world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0), 
    Math.PI * -0.5)
floorBody.addShape(floorShape)
world.addBody(floorBody)




const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    
});
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


const tick = () => {    
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const deltaTime = elapsedTime - oldElapsedTime;
oldElapsedTime = elapsedTime;

world.step(1 / 60, deltaTime, 3);
sphere.position.copy(sphereBody.position);



controls.update();
}

tick();