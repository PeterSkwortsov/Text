import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

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
const pointer = new THREE.Vector2();


// window.addEventListener('pointermove', (event) => {
//     pointer.x = (event.clientX / sizes.width) * 2 - 1;
//     pointer.y = -(event.clientY / sizes.height) * 2 + 1;
// })

const gltfLoader = new GLTFLoader();
let model = null
gltfLoader.load('static/Fox/Fox.gltf', (gltf) => {

    model = gltf.scene
    gltf.scene.scale.set(0.02, 0.02, 0.02);
    model.position.set(0, -1, -2)
    scene.add(model)
})

function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.scale.set(0.5, 0.5, 0.5)
    }
}

window.addEventListener('click', () => {
    if (model) {
    model.scale.set(0.03, 0.03, 0.03);
    } else {
        model.scale.set(0.01, 0.01, 0.01);
    }
})




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
let currentIntersect = null

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

    window.addEventListener('mousemove', onPointerMove);


    

    raycaster.setFromCamera(pointer, camera);

    // const objectsToTest = [object1, object2, object3]
    // const intersects = raycaster.intersectObjects(objectsToTest);

    // for (const object of objectsToTest) {
    //         object.material.color.set('white');
    // }


    // for (const intersect of intersects) {
    //     intersect.object.material.color.set('green');
    //     // intersect.object.scale.set(0.2, 0.2, 0.2)
    // }



    // if(intersects.length) {
    //     if (!currentIntersect) {
    //         console.log('pointer enter')
    //         intersects.forEach((intersect) => {
    //             intersect.object.scale.set(0.2, 0.2, 0.2)
    //         })

    //     }
    //     currentIntersect = intersects[0]
    // } 
    // else {
    //     if (currentIntersect) {
    //         console.log('pointer leave')
    //         intersects.forEach((event) => {
    //             event.object.reset()
    //             event.object.scale.set(1.2, 1.2, 1.2)
    //         })
    //     }
    //     currentIntersect = null
    // }



    // if (model) {
    //     const modelIntersect = raycaster.intersectObject(model)
    //     if (modelIntersect.length = 0) {
    //         console.log('model intersect')
    //     }
    //     else {
    //         '0'
    //     }
      
    // }
   

    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;
  
    // mixer.update(deltaTime)
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

}

tick();