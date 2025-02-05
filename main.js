import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';

const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight
const textureLoader = new THREE.TextureLoader()

// галактика

const parametrs = {
    count: 3000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    pandomnessPower: 3,
    insideColor: '#ff0000',
    outsideColor: '#00ff00'
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

    const colors = new Float32Array(parametrs.count * 3)
    const colorInside = new THREE.Color(parametrs.insideColor)
    const colorOutside = new THREE.Color(parametrs.outsideColor)
    colorInside.lerp(colorOutside, 0.5)

    
    for (let i = 0; i < parametrs.count; i++) {

        const radius = Math.random() * parametrs.radius
        const spinAngle = radius * parametrs.spin
        const branchesAngle = (i % parametrs.branches) / parametrs.branches * Math.PI * 2

        const randomnessX = Math.pow(Math.random(), parametrs.pandomnessPower) * (Math.random() < 0.5 ? 0.3 : -0.3)
        const randomnessY = Math.pow(Math.random(), parametrs.pandomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomnessZ = Math.pow(Math.random(), parametrs.pandomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        const i3 = i * 3
        positions[i3] = Math.cos(branchesAngle + spinAngle) * radius + randomnessX
        positions[i3 + 1] = randomnessY
        positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * radius + randomnessZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parametrs.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', 
        new THREE.BufferAttribute(positions, 3))

    geometry.setAttribute('color', 
        new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        color: 'white',
        size: parametrs.size,
        opacity: 0.3,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    points = new THREE.Points(geometry, material)
    scene.add(points)

}

generatyGalaxy() 

gui.add(parametrs, 'count').min(100).max(100000).step(100).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'branches').min(2).max(20).step(1).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'spin').min(-5).max(5).step(0.001).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'randomness').min(0).max(2).step(0.001).onFinishChange(generatyGalaxy)
gui.add(parametrs, 'pandomnessPower').min(1).max(10).step(0.001).onFinishChange(generatyGalaxy)
gui.addColor(parametrs, 'insideColor').onFinishChange(generatyGalaxy)
gui.addColor(parametrs, 'outsideColor').onFinishChange(generatyGalaxy)


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


scene.background = new THREE.Color('black')




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()
window.addEventListener('resize', onWindowResize, true)

function animate() {
  
    const elepsedTime = clock.getElapsedTime()
    

    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

