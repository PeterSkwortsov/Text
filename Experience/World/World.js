import Experence from "../Experence";
import Environment from "./Environment";
import Floor from "./Floor";
import Fox from "./Fox";
export default class World 
{
    constructor () 
    {
        this.experence = new Experence()
        this.scene = this.experence.scene
        this.resources = this.experence.resources



        // const testMesh = new THREE.Mesh(
        //     new THREE.BoxGeometry(1,1,1),
        //     new THREE.MeshStandardMaterial({
        //     })
        // )
        // this.scene.add(testMesh)

        this.resources.on('ready', () => {
            this.floor = new Floor()
            this.fox = new Fox()
            this.environment = new Environment()
        })  
    }

    update() 
    {
        if (this.fox)
        this.fox.update()
    }

}