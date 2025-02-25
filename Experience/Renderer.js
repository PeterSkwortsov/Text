import * as THREE from 'three'
import Experence from "./Experence.js";

export default class Renderer 
{

constructor() {
    this.experence = new Experence()
    this.sizes = this.experence.sizes
    this.scene = this.experence.scene
    this.canvas = this.experence.canvas
    this.camera = this.experence.camera

    this.setInstance()
}

    setInstance() {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.toneMapping = THREE.ACESFilmicToneMapping
        this.instance.toneMappingExposure = 2
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    }

    resize() 
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    update() 
    {
        this.instance.render(this.scene, this.camera.instance)
    }
    

}