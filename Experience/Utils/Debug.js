
import * as dat from 'lil-gui'
import { GUI } from 'dat.gui'
export default class Debug {
    constructor() {
        this.active = window.location.hash === '#debug'

        if (this.active)
        {
            this.ui = new dat.GUI()
        }
    
    }
}