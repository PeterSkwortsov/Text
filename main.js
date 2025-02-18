import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const scene = new THREE.Scene()


const gui = new GUI()
const global = {}

const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()


// const environmentMap = cubeTextureLoader.load([
//     'static/textures/box/px.png',
//     'static/textures/box/nx.png',
//     'static/textures/box/py.png',
//     'static/textures/box/ny.png',
//     'static/textures/box/pz.png',
//     'static/textures/box/nz.png',
// ])

// scene.environment = environmentMap
// scene.background = environmentMap

rgbeLoader.load('static/textures/box/brown_photostudio_01_2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = environmentMap
})

// const directionallight = new THREE.DirectionalLight(0xebfeff, Math.PI)
// directionallight.position.set(1, 0.1, 1)
// directionallight.visible = true
// scene.add(directionallight)

const ambientLight = new THREE.AmbientLight(0xffffff, 3)
ambientLight.visible = true
scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(-1.1, 2.4, 1.3)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true



const material = new THREE.MeshStandardMaterial()
// material.envMapIntensity = 3
// material.roughness = 0.17
// material.metalness = 0.07
// material.clearcoat = 0.43
// material.iridescence = 1
// material.transmission = 1
// material.thickness = 5.12
// material.ior = 1.78

global.envMapIntensity = scene.environmentIntensity

const updateAllMaterial = () => 
    {
    scene.traverse((child) => 
        {
        if (child.isMesh && child.material.isMeshStandardMaterial) 
            {
            child.material.environmentIntensity = global.environmentIntensity
            child.scale.set(2.5, 2.5, 2.5)
        }
    })
}

scene.environmentIntensity = 5

new GLTFLoader().load('static/fly/flyModel/FlightHelmet.gltf', (gltf) => {
    scene.add(gltf.scene)
    updateAllMaterial()
})


gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01)

gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.01)

    gui.add(global, 'envMapIntensity')
    .min(0)
    .max(5)
    .step(0.01)
    .onChange(updateAllMaterial)

gui.add(scene, 'backgroundBlurriness').min(0).max(2).step(0.01)


function animate() {
    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

animate()