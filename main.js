
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'




const textureLoader = new THREE.TextureLoader()


const scene = new THREE.Scene()



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.set(0, 2.3, 5)

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





const geometry = new THREE.PlaneGeometry(1,1,32,32)
const material = new THREE.RawShaderMaterial({
    vertexShader: `
    uniform mat4 projectionMatrix;
    uniform mat4 viewMatrix;
    uniform mat4 modelMatrix;

    attribute vec3 position;

    void main() 
    {
        gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    precision mediump float;

    void main() 
    {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
    `
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)




const clock = new THREE.Clock()
let oldElapsedTime = 0
function animate() {
    const elapsedTime = clock.getElapsedTime()


    renderer.render(scene, camera)

    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime


    window.requestAnimationFrame(animate)

}


animate()

