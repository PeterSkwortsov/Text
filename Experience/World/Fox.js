import Experence from "../Experence";
import * as THREE from 'three'
import Time from "../Utils/Time";
export default class Fox {
    constructor() 
    {
        this.experence = new Experence()
        this.scene = this.experence.scene
        this.resources = this.experence.resources
        this.time = this.experence.time
        this.debug = this.experence.debug

        console.log(this.debug)

        this.resources = this.resources.items.foxModel

        this.setModel()
        this.setAnimation()
    }

    setModel() {
        this.model = this.resources.scene
        this.model.scale.set(0.02, 0.02, 0.02)
        this.model.position.set(0,-0.5,0)
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh) 
            {
                child.castShadow = true
            }
        })
    }

    setAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.action = this.animation.mixer.clipAction(this.resources.animations[0])
        this.animation.action.play()
    }

    update() 
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}