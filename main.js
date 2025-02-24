import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'


const scene = new THREE.Scene()


const gui = new GUI()
const global = {}

const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()


rgbeLoader.load('static/textures/box/brown_photostudio_01_2k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    environmentMap.colorSpace = THREE.SRGBColorSpace
    
    scene.background = environmentMap
  
   
})

const holyDount = new THREE.Mesh(
    new THREE.TorusGeometry(8, 0.5),
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(10, 10, 10),
    })
)
holyDount.position.set(0, 0, 0)
holyDount.layers.enable(1)
scene.add(holyDount)

const cubeRendererTarget = new THREE.WebGLRenderTarget(256,
    {
        type: THREE.HalfFloatType
    }
)


scene.environment = cubeRendererTarget.texture

const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRendererTarget)
cubeCamera.layers.set(1)

// const directionallight = new THREE.DirectionalLight(0xebfeff, Math.PI)
// directionallight.position.set(1, 0.1, 1)
// directionallight.visible = true
// scene.add(directionallight)

// const ambientLight = new THREE.AmbientLight(0xffffff, 3)
// ambientLight.visible = true
// scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2.3, 10)

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
            child.scale.set(10, 10, 10)
        }
    })
}

scene.environmentIntensity = 5

new GLTFLoader().load('static/fly/flyModel/FlightHelmet.gltf', (gltf) => {
    scene.add(gltf.scene)
    gltf.scene.position.set(0, -2, 0)
    updateAllMaterial()
})


gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01)

gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.01)

    gui.add(global, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.01)
    .onChange(updateAllMaterial)

gui.add(scene, 'backgroundBlurriness').min(0).max(2).step(0.01)










const clock = new THREE.Clock()
function animate() {
    const elapsedTime = clock.getElapsedTime()

    if (holyDount) {
        holyDount.rotation.x = Math.sin(elapsedTime) * 2
        cubeCamera.update(renderer, scene)
    }


    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)

}


animate()

