import Experence from "../Experence";
import * as THREE from 'three'
import Resources from "../Utils/Resources";
export default class Environment {
    constructor() {

        this.experence = new Experence()
        this.scene = this.experence.scene
        this.resources = this.experence.resources

        this.setSunLight()
        this.setEnvironmentMap()
    }

    setSunLight() {
        this.spotLight = new THREE.SpotLight(0xffffff, 60)
        this.spotLight.castShadow = true
        this.spotLight.shadow.camera.far = 15
        this.spotLight.shadow.mapSize.set(1024, 1024)
        this.spotLight.position.set(3.5, 2, -1.25); 
        this.scene.add(this.spotLight)
    }

    setEnvironmentMap() {
        this.environmentMap = {}
        this.environmentMap.intensity = 0.4
        this.environmentMap.texture = this.resources.items.environmentMapTexture
        this.environmentMap.texture.encoding = THREE.sRGBEncoding

        this.scene.environment = this.environmentMap.texture

        this.setEnvironmentMap.updateMaterial = () => {
            this.scene.traverse((child) => 
            {                   
                if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
                    child.material.envMap = this.environmentMap.texture
                    child.material.envMapIntensity = this.environmentMap.intensity
                    child.material.needsUpdate = true
                }
            })
        }
        this.setEnvironmentMap.updateMaterial()

    }
}