import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { color, floor, PI } from 'three/tsl';

const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight

// загрузчики текстур
const textureLoader = new THREE.TextureLoader()

const doorTexturesAO = textureLoader.load('static/textures/door/wooden_garage_door_ao_1k.jpg')
const doorTexturesAlpha = textureLoader.load('static/textures/door/wooden_garage_door_arm_1k.jpg')
const doorTexturesAmbient = textureLoader.load('static/textures/door/wooden_garage_door_diff_1k.jpg')
const doorTexturesHeight = textureLoader.load('static/textures/door/wooden_garage_door_disp_1k.jpg')
const doorTexturesNormal = textureLoader.load('static/textures/door/wooden_garage_door_nor_gl_1k.jpg')
const doorTexturesMetallnes = textureLoader.load('static/textures/door/wooden_garage_door_rough_1k.jpg')


const bricksTextureColor = textureLoader.load('static/textures/brik/red_brick_diff_1k.jpg')
const bricksTextureOcclusion = textureLoader.load('static/textures/brik/red_brick_arm_1k.jpg')
const bricksTextureNormal = textureLoader.load('static/textures/brik/red_brick_nor_gl_1k.jpg')
const bricksTextureRoughness = textureLoader.load('static/textures/brik/red_brick_rough_1k.jpg')

const floorTextures = textureLoader.load('static/textures/grass/rocky_terrain_02_diff_1k.jpg')
const floorTexturesAo = textureLoader.load('static/textures/grass/rocky_terrain_02_ao_1k.jpg')
const floorTexturesDiff = textureLoader.load('static/textures/grass/rocky_terrain_02_mask_1k.jpg')
const floorTexturesMask = textureLoader.load('static/textures/grass/rocky_terrain_02_mask_1k.jpg')
const floorTexturesNormsl = textureLoader.load('static/textures/grass/rocky_terrain_02_nor_gl_1k.jpg')
const floorTexturesRought = textureLoader.load('static/textures/grass/rocky_terrain_02_rough_1k.jpg')


const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
    }
);

document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
// renderer.shadowMap.enabled = true
scene.fog = new THREE.Fog('#262837', 3, 19);





camera.position.z = 6;
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


const doorLight = new THREE.PointLight('#ff7d46', 1.5, 7)
doorLight.position.set(0, 2.4, 2.7)

// const doorLightHelper = new THREE.PointLightHelper(doorLight)
// scene.add(doorLightHelper)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshStandardMaterial(
        {
            side: THREE.DoubleSide,
            map: floorTextures,
            aoMap: floorTexturesAo,
            normalMap: floorTexturesNormsl,
            roughnessMap: floorTexturesRought
        }
    )
)

plane.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array, 2)
)



plane.position.set(0, -0.01, 0)
plane.rotation.x = Math.PI / 2
plane.receiveShadow = true

scene.add(plane)

window.addEventListener('resize', onWindowResize, false)


const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial(
        {
            map: bricksTextureColor,
            aoMap: bricksTextureNormal,
            roughnessMap: bricksTextureRoughness,
            transparent: true,
            metalnessMap: bricksTextureOcclusion,


        }
    )
)
walls.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)


walls.position.y = 1.25
house.add(walls)
house.add(doorLight)


const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial(
        {
            color: '#b35f45',
        }
    )
)
roof.position.y = 3
roof.rotation.y = Math.PI / 4
house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 2),
    new THREE.MeshStandardMaterial(
        {
            map: doorTexturesAmbient,
            transparent: false,
            alphaMap: doorTexturesAO,
            aoMap: doorTexturesAO, 
            displacementMap: doorTexturesHeight,
            displacementScale: 0.1,
            normalMap: doorTexturesNormal,
            metalnessMap: doorTexturesMetallnes,
            roughnessMap: doorTexturesAlpha
        }

    )
)

door.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)

house.add(door)
door.position.y = 1.01
door.position.z = 1.97


const bushGeometry = new THREE.SphereGeometry(0.8, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(1.1, 0.2, 2.4)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.7, 0.1, 2.3)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-1.5, 0.2, 2.3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.1, 2.6)

house.add(bush1, bush2, bush3, bush4)

const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    color: '#b2b6d1'
})

for (let i = 0; i < 60; i++) {
    const angale = Math.random() * Math.PI * 2 
    const radius = 4 + Math.random() * 8
    const x = Math.sin(angale) * radius
    const z = Math.cos(angale) * radius
    
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.rotation.y = (Math.random() - 0.5) * 1
    grave.rotation.z = (Math.random() - 0.5) * 0.3
    grave.position.set(x,0.3,z)
    const widthGrave = 0.7 + Math.random() * 1.5 
    const heightGrave = 1 + Math.random() * 2.5 
    grave.scale.set(widthGrave, heightGrave, 0.9)
    grave.castShadow = true
    graves.add(grave)
}


const ghost1 = new THREE.PointLight('red', 2, 3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('blue', 2, 5)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('green', 2, 3)
scene.add(ghost3)



function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

renderer.shadowMap.enabled = true
moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true
plane.receiveShadow = true

renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()

function animate() {
  
    const elepsedTime = clock.getElapsedTime()
    console.log(elepsedTime)

    const ghotAngle = elepsedTime * 0.5
    ghost1.position.x = Math.cos(ghotAngle) * 4
    ghost1.position.z = Math.sin(ghotAngle) * 5
    ghost1.position.y = Math.sin(ghotAngle * 3)
    
    
    const ghotAngle2 = -elepsedTime * 0.32
    ghost2.position.x = Math.cos(ghotAngle2) * 5
    ghost2.position.z = Math.sin(ghotAngle2) * 5
    ghost2.position.y = Math.sin(ghotAngle2 * 4) + Math.sin(ghotAngle2 * 2.5)

    const ghotAngle3 = - elepsedTime * 0.18
    ghost3.position.x = Math.cos(ghotAngle3) * (4 + Math.sin(elepsedTime))   
    ghost3.position.z = Math.sin(ghotAngle3) * (4 + Math.sin(elepsedTime))
    ghost3.position.y = Math.sin(ghotAngle3 * 3) + Math.sin(elepsedTime * 2)




    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

