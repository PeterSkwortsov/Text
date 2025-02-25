
// import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
// import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
// import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

import Experence from './Experience/Experence.js'

const experence = new Experence(document.querySelector('canvas'))


// const textureLoader = new THREE.TextureLoader()
// const rgbeLoader = new RGBELoader()
// const gltfLoader = new GLTFLoader()

// const scene = new THREE.Scene()
// const gui = new GUI()
// const global = {}


// // rgbeLoader.load('static/textures/box/brown_photostudio_01_2k.hdr', (environmentMap) => {
// //     environmentMap.mapping = THREE.EquirectangularReflectionMapping
// //     scene.background = environmentMap
// // })


// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
// camera.position.set(0, 2.3, 10)

// const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)
// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 2
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight
//     camera.updateProjectionMatrix()
//     renderer.setSize(window.innerWidth, window.innerHeight)
// })

// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableDamping = true

// const updateAllMaterial = () => {
//     scene.traverse((child) => {
//         if (child.isMesh && child.material.isMeshStandardMaterial) {
//             child.castShadow = true
//             child.receiveShadow = true
//         }
//     })
// }


// global.envMapIntensity = scene.environmentIntensity


// scene.environmentIntensity = 5

// let mixer = null


// new GLTFLoader().load('static/Fox/Fox.gltf', (gltf) => {
//     scene.add(gltf.scene)
//     gltf.scene.position.set(0, -2, 0)
//     updateAllMaterial()
//     gltf.scene.scale.set(0.05, 0.05, 0.05)

//     mixer = new THREE.AnimationMixer(gltf.scene);
//     const action = mixer.clipAction(gltf.animations[1]).play();
    
// })



// const floorColorTextureWoll = textureLoader.load('static/textures/floor/rocky_terrain_diff_1k.jpg')
// const floorNormalTextureWoll = textureLoader.load('static/textures/floor/rocky_terrain_nor_dx_1k.jpg')
// const floorAOTextureWoll = textureLoader.load('static/textures/floor/rocky_terrain_ao_1k.jpg')
// const floorRoughtnessWooll = textureLoader.load('D:/JAVA/Text/static/textures/floor/rocky_terrain_rough_1k.jpg')
// const floorDispWoll = textureLoader.load('D:/JAVA/Text/static/textures/floor/rocky_terrain_disp_1k.jpg')




// const floorWoll = new THREE.Mesh(
//     new THREE.PlaneGeometry(20, 20),
//     new THREE.MeshStandardMaterial({
//         map: floorColorTextureWoll,
//         displacementMap: floorAOTextureWoll,
//         roughness: floorNormalTextureWoll,
//         aoMap: floorAOTextureWoll,
//         roughnessMap: floorRoughtnessWooll,
//         displacementScale: 0.1
//     })
// )

// floorWoll.colorSpace = THREE.SRGBColorSpace


// floorWoll.rotation.x = -Math.PI * 0.5
// floorWoll.position.y = -2
// floorWoll.receiveShadow = true
// scene.add(floorWoll)


// const spotLight = new THREE.SpotLight(0xffffff)
// spotLight.intensity = 30
// spotLight.angle = 5.67
// spotLight.decay = 1.25
// spotLight.position.set(1.5, 9, 2); 


// spotLight.visible = true
// scene.add(spotLight)





// gui.add(spotLight, 'intensity').min(0).max(10).step(0.01)    
// gui.add(spotLight.position, 'x').min(0).max(10).step(0.01)
// gui.add(spotLight.position, 'y').min(0).max(10).step(0.01)
// gui.add(spotLight.position, 'z').min(0).max(10).step(0.01)
// gui.add(spotLight, 'distance').min(0).max(10).step(0.01)
// gui.add(spotLight, 'angle').min(0).max(10).step(0.01)
// gui.add(spotLight, 'decay').min(0).max(10).step(0.01)

// gui.add(scene, 'environmentIntensity').min(0).max(10).step(0.01)

// gui.add(renderer, 'toneMappingExposure').min(0).max(5).step(0.01)

//     gui.add(global, 'envMapIntensity')
//     .min(0)
//     .max(10)
//     .step(0.01)
   

// gui.add(scene, 'backgroundBlurriness').min(0).max(2).step(0.01)

// gui.add(renderer, 'toneMapping', {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping
// })

// gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.01)

// spotLight.castShadow = true
// gui.add(spotLight, 'castShadow')
// spotLight.shadow.camera.far = 15
// spotLight.shadow.mapSize.set(512, 512) // чем меньше разрешение (число) тем больше размытость, например 1024, 512, 256
// spotLight.shadow.normalBias = 0.05

// // const directionallightShadowHelper = new THREE.CameraHelper(directionallight.shadow.camera)
// // scene.add(directionallightShadowHelper)

// spotLight.target.position.set(0, 4, 0)
// spotLight.target.updateMatrix()





// const clock = new THREE.Clock()
// let oldElapsedTime = 0
// function animate() {
//     const elapsedTime = clock.getElapsedTime()


//     renderer.render(scene, camera)
//     requestAnimationFrame(animate)

//     const deltaTime = elapsedTime - oldElapsedTime
//     oldElapsedTime = elapsedTime

//     // mixer.update(deltaTime)

//     // updateAllMaterial()
//     // controls.update()
//     window.requestAnimationFrame(animate)

// }


// animate()

