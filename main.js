import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'


const textureLoader = new THREE.TextureLoader()
const rgbeLoader = new RGBELoader()
const gltfLoader = new GLTFLoader()

const scene = new THREE.Scene()
const gui = new GUI()
const global = {}


rgbeLoader.load('static/textures/box/brown_photostudio_01_2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
})


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2.3, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 2
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const updateAllMaterial = () => {
    scene.traverse((child) => {
        if (child.isMesh && child.material.isMeshStandardMaterial) {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}


global.envMapIntensity = scene.environmentIntensity


scene.environmentIntensity = 5

new GLTFLoader().load('public/burger.glb', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.position.set(0, -3.2, 1)
    // updateAllMaterial()
    // gltf.scene.scale.set(10, 10, 10)
})


const floorColorTexture = textureLoader.load('static/textures/energy.png')
const floorNormalTexture = textureLoader.load('static/textures/floor/weathered_brown_planks_disp_1k.png')
const floorAOTexture = textureLoader.load('static/textures/floor/weathered_brown_planks_ao_1k.jpg')
const floorRougnessTexture = textureLoader.load('static/textures/floor/weathered_brown_planks_arm_1k.jpg')

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        normalMap: floorNormalTexture,
        aoMap: floorAOTexture,
        roughnessMap: floorRougnessTexture
    })
)
floor.rotation.x = -Math.PI * 0.5
floor.position.y = -2
floor.receiveShadow = true
scene.add(floor)

floorColorTexture.colorSpace = THREE.SRGBColorSpace // улучшает цветопередачу


const floorColorTextureWoll = textureLoader.load('static/textures/energy.png')
const floorNormalTextureWoll = textureLoader.load('static/textures/brick/castle_brick_07_rough_1k.jpg')
const floorAOTextureWoll = textureLoader.load('static/textures/brick/castle_brick_07_disp_1k.png')
const floorMetalnesWooll = textureLoader.load('static/textures/brick/castle_brick_07_disp_1k.png')

floorColorTextureWoll.colorSpace = THREE.SRGBColorSpace



const floorWoll = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 10),
    new THREE.MeshStandardMaterial({
        map: floorColorTextureWoll,
        displacementMap: floorAOTextureWoll,
        roughness: floorNormalTextureWoll,
        aoMap: floorAOTextureWoll
    })
)

floorWoll.position.set(0,2,-3.5)
scene.add(floorWoll)


const directionallight = new THREE.DirectionalLight(0xffffff, 8)
directionallight.position.set(5, 0.1, 1)
directionallight.visible = true
scene.add(directionallight)
// const directionallightHelper = new THREE.DirectionalLightHelper(directionallight, 5)
// scene.add(directionallightHelper)

const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

gui.add(directionallight, 'intensity').min(0).max(10).step(0.01)    
gui.add(directionallight.position, 'x').min(0).max(10).step(0.01)
gui.add(directionallight.position, 'y').min(0).max(10).step(0.01)
gui.add(directionallight.position, 'z').min(0).max(10).step(0.01)


gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01)

gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.01)

    gui.add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.01)
   

gui.add(scene, 'backgroundBlurriness').min(0).max(2).step(0.01)

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})

gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01)

directionallight.castShadow = true
gui.add(directionallight, 'castShadow')
directionallight.shadow.camera.far = 15
directionallight.shadow.mapSize.set(512, 512) // чем меньше разрешение (число) тем больше размытость, например 1024, 512, 256
directionallight.shadow.normalBias = 0.05

// const directionallightShadowHelper = new THREE.CameraHelper(directionallight.shadow.camera)
// scene.add(directionallightShadowHelper)

directionallight.target.position.set(0, 4, 0)
directionallight.target.updateMatrix()




const clock = new THREE.Clock()
function animate() {
    const elapsedTime = clock.getElapsedTime()


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
    updateAllMaterial()
}


animate()

