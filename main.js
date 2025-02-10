import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; 
import GUI from 'lil-gui';
import { materialColor } from 'three/tsl';
import * as CANNON from 'cannon-es';


const gui = new GUI()
const debugObject = {}
debugObject.createSphery = () => {

    createSphery(
        Math.random() * 0.5,
        {
            x: Math.random() - 0.5,
            y: 2,
            z: Math.random() - 0.5 * 2
        }
    )
}
debugObject.createBox = () => {
    createBox(
        Math.random() * 0.5,
        Math.random() * 0.5,
        Math.random() * 0.5,    
     {
        x: Math.random() - 0.5 * 3,
        y: 2.5,
        z: Math.random() - 0.5 * 3
        
    }
)
}

debugObject.reset = () => {
    for (const object of objectToUpdate) {
        world.removeBody(object.body)
        scene.remove(object.mesh)
    }
}

gui.add(debugObject, 'createSphery')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')

const scene = new THREE.Scene();

const hitSound = new Audio('static/textures/metallicheskih.mp3');
const playSound = (collision) => {

    const impactStrength = collision.contact.getImpactVelocityAlongNormal();
    
    console.log(impactStrength)

    if (impactStrength > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play();
    }

    
}

const textureLoader = new THREE.TextureLoader();

const mapTexture = textureLoader.load('static/textures/one.png');

const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 3;

const canvas = document.querySelector('canvas');

const plane = new THREE.PlaneGeometry(5,5) 
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
})

plane.receiveShadow = true
plane.castShadow = true

const light = new THREE.AmbientLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 8);
pointLight.position.set(0, 2, 1.5);
scene.add(pointLight);
pointLight.castShadow = true

const planeMesh = new THREE.Mesh(plane, planeMaterial);
planeMesh.rotation.x = Math.PI / 180 * -90
planeMesh.receiveShadow = true
scene.add(planeMesh);



const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world); // оптимизация при использовании множества объектов по одной оси
world.allowSleep = true  // важно! добавляй этот параметр чтобы кэнон не просчитывал объекты без движения
world.gravity.set(0, -8.82, 0);


const defaultMaterial = new CANNON.Material('default');

const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.5
})

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial



const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0), 
    Math.PI * -0.5)
floorBody.addShape(floorShape)
world.addBody(floorBody)




const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas: canvas,
    
});

const objectToUpdate = []

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshToonMaterial({
    gradientMap: mapTexture
})

// обрати внимание на то что у нас радиус - 1, но благодаря тому что mesh.scale.set(radius, radius, radius) - поолучается рандом

const createSphery = (radius, position) => {
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)

    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape: shape,
        material: defaultMaterial,
    })
    body.position.copy(position)
    body.addEventListener('collide', playSound)

    world.addBody(body)

    objectToUpdate.push({
        mesh: mesh,
        body: body
    })
}

createSphery(0.30, {x: 0, y: 0.8, z: 0})


const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.5
})
 
const createBox = (width, height, depth, position) => {
    const mesh = new THREE.Mesh(boxGeometry, boxMaterial)

    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const body = new CANNON.Body({
        mass: 2,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial,
    })
    body.addEventListener('collide', playSound)
    body.position.copy(position)
    world.addBody(body)

    objectToUpdate.push({
        mesh: mesh,
        body: body
    })
}




const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
sizes.width = window.innerWidth;
sizes.height = window.innerHeight;

camera.aspect = sizes.width / sizes.height;


renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);

let oldElapsedTime = 0;

const clock = new THREE.Clock();

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    
})

const tick = () => {    
    const elapsedTime = clock.getElapsedTime();

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);

    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    
    world.step(1 / 60, deltaTime, 3);

    for (const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }


    controls.update();
}

tick();