import Experence from "../Experence";
import Environment from "./Environment";
import * as THREE from 'three'
import Resources from "../Utils/Resources";
import Floor from "./Floor";
export default class World 
{
    constructor () 
    {
        this.experence = new Experence()
        this.scene = this.experence.scene
        this.resources = this.experence.resources

        const testMesh = new THREE.Mesh(
            new THREE.BoxGeometry(1,1,1),
            new THREE.MeshStandardMaterial({
            })
        )
        this.scene.add(testMesh)

        this.resources.on('ready', () => {
            this.floor = new Floor()
            this.environment = new Environment()
        })

    }
}