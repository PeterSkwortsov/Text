import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { materialColor } from 'three/tsl';
import gsap from 'gsap';


const gui = new GUI()
const parametrs = {
    materialColor: '#ffeded'
}

gui.addColor(parametrs, 'materialColor').onChange(() => {
    material.color.set(parametrs.materialColor)
    particlesMaterial.color.set(parametrs.materialColor)
})

const scene = new THREE.Scene();

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('canvas');
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    
});
renderer.setSize(window.innerWidth, window.innerHeight);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

})


const objectDistence = 3

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('static/textures/one.png');
gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshToonMaterial({
    color: materialColor,
    gradientMap: gradientTexture
})



const mesh1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    material
);
const mesh2 = new THREE.Mesh(
    new THREE.TorusGeometry(6, 2, 16, 100), 
    material
);
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
);

mesh1.position.y = objectDistence * 0;
mesh2.position.y = - objectDistence * 1;
mesh3.position.y = - objectDistence * 2;

mesh1.position.x = 0.2
mesh2.position.x = 0.5;
mesh3.position.x = -0.5;

mesh1.scale.set(0.7, 0.7, 0.7);
mesh2.scale.set(0.1, 0.1, 0.1);
mesh3.scale.set(0.6, 0.6, 0.6);

mesh3.visible= true

scene.add(mesh1, mesh2, mesh3);
const sectionMeshes = [mesh1, mesh2, mesh3];

const particlesCount = 200;
const position = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    position[i * 3 + 0] = (Math.random() - 0.5) * 10;
    position[i * 3 + 1] = objectDistence * 0.5 - Math.random() * objectDistence * sectionMeshes.length;
    position[i * 3 + 2] = (Math.random() - 0.5) * 10;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

const particlesMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,

});

scene.add(new THREE.Points(particlesGeometry, particlesMaterial));

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(1,4, 0);
scene.add(directionalLight);

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newSection = Math.round(scrollY / sizes.height);
    if (newSection !== currentSection) {
        currentSection = newSection;
        
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            y: '+=6',
            x: '+=3',
            z: '+=1.5',
            repeat: 0
        })

    }
})

let cursor = {
    x: 0,
    y: 0
}

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = event.clientY / sizes.height - 0.5;
})


camera.position.z = 6;
const clock = new THREE.Clock();
let previovsTime = 0;
const tick = () => {    
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previovsTime;
    previovsTime = elapsedTime;

    camera.position.y = -scrollY / sizes.height * objectDistence;
  

    const parallaxX = cursor.x * 0.7
    const parallaxY = -cursor.y * 0.7

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 2 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 2 * deltaTime

    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.2;
    }
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();