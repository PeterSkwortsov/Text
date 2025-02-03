import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { color, floor, PI } from 'three/tsl';

const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight
const textureLoader = new THREE.TextureLoader()

// галактика

const parametrs = {
    count: 3000,
    size: 0.02,
}

let geometry, material, points = null

const generatyGalaxy = () => {

    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(parametrs.count * 3)
    for (let i = 0; i < parametrs.count; i++) {

        const i3 = i * 3
        positions[i3] = (Math.random() - 0.5) * 3
        positions[i3 + 1] = (Math.random() - 0.5) * 3
        positions[i3 + 2] = (Math.random() - 0.5) * 3
    }

    geometry.setAttribute('position', 
        new THREE.BufferAttribute(positions, 3))

    material = new THREE.PointsMaterial({
        color: 'red',
        size: parametrs.size,
        opacity: 0.3,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })
    points = new THREE.Points(geometry, material)
    scene.add(points)

}

generatyGalaxy() 

gui.add(parametrs, 'count').min(100).max(10000).step(10).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'size').min(0.01).max(1.0).step(0.01).onFinishChange(generatyGalaxy)


const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
    }
);

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
// renderer.shadowMap.enabled = true





camera.position.z = 2;
camera.position.x = 0;
camera.position.y = 2.5;

controls.update();

// собственная геоиетрия


scene.background = new THREE.Color('#262837')
// material.shininess= 1000
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12); // soft white light

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)


const moonLight = new THREE.DirectionalLight('0xb9d5ff', 0.12)
moonLight.position.set(4,5,-2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(moonLight)




window.addEventListener('resize', onWindowResize, false)



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()

function animate() {
  
    const elepsedTime = clock.getElapsedTime()
    

    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

