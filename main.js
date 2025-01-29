import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { AxesHelper } from 'three';
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
console.log(RectAreaLightHelper)

const scene = new THREE.Scene();
const gui = new GUI()


const asperctRatio = innerWidth / innerHeight

// загрузчики текстур
const textureLoader = new THREE.TextureLoader()

const bakedTextures = textureLoader.load('static/teni.jpg')
const spheryTeni = textureLoader.load('static/teni.png')


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
        textMesh.position.y = 0.5
        scene.add(textMesh)
    }
)

const matcapTexture = textureLoader.load('static/27222B_677491_484F6A_5D657A-256px.png')


const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 16, 100)




const donutMaterial = new THREE.MeshMatcapMaterial(
    {
        matcap: matcapTexture,
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






const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000000);

const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,
        
    }
);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);




// renderer.shadowMap.enabled = true




// scene.fog = new THREE.Fog('black', 7, 30);





camera.position.z = 6;
camera.position.x = 0;
camera.position.y = 1;

controls.update();

// собственная геоиетрия


// scene.background = new THREE.Color('black')
// material.shininess= 1000
// const light = new THREE.AmbientLight(0xffffff, 3); // soft white light
// light.position.set(0, 4, 0)
// scene.add(light)

const pointLight = new THREE.PointLight(0xffffff, 50);
pointLight.position.set(0, 0, 0);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 100;
pointLight.shadow.mapSize.height = 100;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
// scene.add(pointLight);

// const pointLightHepler = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHepler);

const pointLight2 = new THREE.PointLight(0xffffff, 20);
pointLight2.position.set(-1, 1, 0);
pointLight2.castShadow = true;
scene.add(pointLight2);


const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 200, 1.2, 1.2);
rectAreaLight.position.set(0, 2, 0);
// rectAreaLight.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(rectAreaLight);


const box = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial(
        {
            color: 'white',
        }
    )
)

box.position.set(0, 0, 0)
box.castShadow = true
box.rotation.y = Math.PI / 3
scene.add(box)

const directionLight = new THREE.DirectionalLight(0x0000ff, 5.5)
directionLight.position.set(0, 0, 1)
scene.add(directionLight)

directionLight.shadow.mapSize.width = 1024
directionLight.shadow.mapSize.height = 1024
gui.add(directionLight, 'intensity').min(0).max(1).step(0.01)





const spotLight = new THREE.SpotLight(0xffffff, 35, 9, Math.PI * 0.15, 1.25, 1);
spotLight.position.set(0, 4, -4);
spotLight.castShadow = true;
scene.add(spotLight);


spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6

directionLight.shadow.camera.radius = 5
scene.add(spotLight)
scene.add(spotLight.target)
gui.add(spotLight.position, 'x').min(-10).max(10).step(0.1)
gui.add(spotLight.position, 'y').min(-10).max(10).step(0.1)


const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial(
        {
            map: bakedTextures,
            side: THREE.DoubleSide,
        }
    )
)
plane.position.set(0, -0.5, 0)
plane.rotation.x = Math.PI / 2
plane.receiveShadow = true

scene.add(plane)

window.addEventListener('resize', onWindowResize, false)


const sphereShadow2 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial(
        {
            color: 0x000000,
            map: spheryTeni,
            transparent: true
        }
    )
)
sphereShadow2.rotation.x = -Math.PI / 2
sphereShadow2.position.z = -1.5
sphereShadow2.position.y = plane.position.y + 0.01

scene.add(sphereShadow2)




function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const clock = new THREE.Clock()

function animate() {
  
    const elepsedTime = clock.getElapsedTime()
    box.position.x = Math.cos(elepsedTime) * 1.5
    box.position.z = Math.sin(elepsedTime) * 1.5
    box.position.y = Math.abs(Math.sin(elepsedTime)) * 2

    sphereShadow2.position.x = Math.cos(elepsedTime) * 1.5
    sphereShadow2.position.z = Math.sin(elepsedTime) * 1.5
    sphereShadow2.material.opacity = 1 - box.position.y


    rectAreaLight.rotation.x += 0.01
    renderer.render(scene, camera);
    controls.update();
    renderer.setSize(innerWidth, innerHeight);
 
}

renderer.setAnimationLoop(animate);

