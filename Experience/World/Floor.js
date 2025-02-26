import Experence from "../Experence";
import * as THREE from 'three'
export default class Floor {
    constructor () {
        this.experence = new Experence()
        this.scene = this.experence.scene
        this.resources = this.experence.resources
        
        this.setGeometry()
        this.setTexture()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
        this.geometry = new THREE.CircleGeometry(5,64)
    }
    setTexture() {
        this.textures = {}
        this.textures.normal = this.resources.items.grassNormalTexture
        this.textures.normal.encoding = THREE.sRBGEcoding
        this.textures.normal.repeat.set(1.5, 1.5)
        this.textures.normal.wrapS = THREE.RepeatWrapping
        this.textures.normal.wrapT = THREE.RepeatWrapping

        this.textures.color = this.resources.items.grassColorTexture
        this.textures.color.encoding = THREE.sRBGEcoding
        this.textures.color.repeat.set(1.5, 1.5)
        this.textures.color.wrapS = THREE.RepeatWrapping
        this.textures.color.wrapT = THREE.RepeatWrapping
    }
    setMaterial() {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal
        })
    }
    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotation.x = -Math.PI /2
        this.mesh.position.y = -0.5
        this.mesh.receiveShadow = true
        this.scene.add(this.mesh)
    }
    
}