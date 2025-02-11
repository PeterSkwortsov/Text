import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';

const gui = new GUI()
const debugObject = {}


const scene = new THREE.Scene();


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
// scene.add(planeMesh);






const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    
});

const objectToUpdate = []

const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: false
    })
)
object1.position.x = -1
object1.position.y = 1

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: false
    })
)
object2.position.x = 0
object2.position.y = 1
const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 32, 32),
    new THREE.MeshStandardMaterial({
        color: 0xff0000,
        wireframe: false
    })
)
object3.position.x = 1
object3.position.y = 1

scene.add(object1, object2, object3)

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
console.log(raycaster)



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

    object1.position.y = (Math.sin(elapsedTime) * 0.3) * 1.5
    object2.position.y = (Math.sin(elapsedTime) * 0.8) * 1.5
    object3.position.y = (Math.sin(elapsedTime) * 1.0) * 1.5

    const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(1, 0, 0);
    rayDirection.normalize()

    raycaster.set(rayOrigin, rayDirection);

    const objectsToTest = [object1, object2, object3]
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set('white');
    }  // изначально белые

    for (const intersect of intersects) {
        intersect.object.material.color.set('green');
    } // если пересечение то зеленый

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
  

    controls.update();
}

tick();