import Experence from "../Experence";
import * as THREE from 'three'
export default class World 
{
    constructor () 
    {
        this.experence = new Experence()
        this.scene = this.experence.scene

        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshBasicMaterial({
                wireframe: true
            })
        )
        this.scene.add(testMesh)

    }
}