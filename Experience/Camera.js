import Experence from "./Experence.js";
import * as THREE from 'three'
import{OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'



export default class Camra 
{
    constructor(experence)
    {

        this.experence = new Experence()
        this.sizes = this.experence.sizes
        this.scene = this.experence.scene
        this.canvas = this.experence.canvas

        this.setInstance()
        this.setOrbitControl()

        
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            100)
        this.instance.position.set(1,2,1)
        this.scene.add(this.instance)
    }

    setOrbitControl() 
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enabled = true
    }

    resize() 
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update() {
        this.controls.update()
    }
}