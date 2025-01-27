import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { AxesHelper } from 'three';
const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight

// загрузчики текстур
const textureLoader = new THREE.TextureLoader()

const fontLoader = new FontLoader()
const matcapTexture2 = textureLoader.load('static/3B3C3F_DAD9D5_929290_ABACA8-256px.png')

fontLoader.load(
    'static/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello THREE!',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 22,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 10
            }
        )
        
        textGeometry.center()

         const textMaterial = new THREE.MeshMatcapMaterial(
            {
                wireframe: false,
                 matcap: matcapTexture2
            }
        )



        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(textMesh)
    }
)

const matcapTexture = textureLoader.load('static/27222B_677491_484F6A_5D657A-256px.png')


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100)
const donutMaterial = new THREE.MeshMatcapMaterial(
    {
        matcap: matcapTexture
    }
)

console.time('donuts')
    for (let i = 0; i < 100; i++) {
       
        const donut = new THREE.Mesh(donutGeometry, donutMaterial)

        donut.position.x = (Math.random() - 0.5) * 10
        donut.position.y = (Math.random() - 0.5) * 10
        donut.position.z = (Math.random() - 0.5) * 10

        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scalr = Math.random()
        donut.scale.set(scalr, scalr, scalr)

        scene.add(donut)
    }


console.timeEnd('donuts')






const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
        
    }
);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);




// renderer.shadowMap.enabled = true




scene.fog = new THREE.Fog('black', 7, 30);





camera.position.z = 5;
camera.position.x = 0;
camera.position.y = 0;
controls.update();

// собственная геоиетрия


// scene.background = new THREE.Color('black')
// material.shininess= 1000

const light = new THREE.AmbientLight(
    new THREE.Color(0x000000),
    15.0
)
scene.add(light)


const hemiLight = new THREE.SpotLight(0xffffff, 650);
hemiLight.position.set(2, 8, 4);
hemiLight.angle = 4
hemiLight.distance = 15
const spotLightHelper = new THREE.SpotLightHelper(hemiLight);
scene.add(hemiLight)
// scene.add(spotLightHelper)
// scene.add(spotLightHelper)
// hemiLight.decay = 2
hemiLight.castShadow = true
hemiLight.receiveShadow = true




window.addEventListener('resize', onWindowResize, false)

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}


function animate() {
  

    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

