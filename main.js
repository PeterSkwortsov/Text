import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { color, floor, PI } from 'three/tsl';

const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight
const textureLoader = new THREE.TextureLoader()

const energy = textureLoader.load('static/textures/energy.png')

// материал
const patrclesGeometry = new THREE.BufferGeometry();
const count = 1500

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    colors[i] = Math.random()
    positions[i] = (Math.random() - 0.5) * 10
}

patrclesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

patrclesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// частицы
const patrclesMaterial = new THREE.PointsMaterial()
patrclesMaterial.size = 0.5
// patrclesMaterial.color = new THREE.Color('#b9d5ff')
patrclesMaterial.sizeAttenuation = true
patrclesMaterial.alphaMap = energy
patrclesMaterial.transparent = true
// patrclesMaterial.alphaTest = 0.001
patrclesMaterial.depthWrite = false
// patrclesMaterial.blending = THREE.AdditiveBlending
patrclesMaterial.vertexColors = true

const patrcles = new THREE.Points(patrclesGeometry, patrclesMaterial)
scene.add(patrcles)

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
scene.add(cube)

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
    }
);

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
// renderer.shadowMap.enabled = true





camera.position.z = 4;
camera.position.x = 0;
camera.position.y = 1.5;

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
    

    // patrcles.rotation.x = elepsedTime * 0.25
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = patrclesGeometry.attributes.position.array[i3]
        patrclesGeometry.attributes.position.array[i3 + 1] = Math.sin(elepsedTime + x) 
        
    }

    patrclesGeometry.attributes.position.needsUpdate = true
    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

