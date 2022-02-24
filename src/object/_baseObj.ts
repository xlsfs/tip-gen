import { Element } from "@svgdotjs/svg.js";
import { ObjStateEnum } from "./state/ObjStateEnum";

export class _baseObj  {

    protected state = ObjStateEnum.waitLoad;

    // protected wireframe: Mesh;

    public type: string;

    public getState () {
        return this.state;
    }
    public setState (val:string) {
        this.state = val;
    }

    public svgItem: Element;

    public layerName:string;

    public isBaseObj = true;
    public isTextObj = false;
    public isImageObj = false;

    constructor (type:string) {
        this.isBaseObj = true;
        this.type = type;
    }

    remove() {
        this.svgItem.remove();
    }

    // getSel() { }

    setSel(sel: boolean) {
        if(sel) {
            this.svgItem.node.style.outline = '2px solid blue';
        } else {
            this.svgItem.node.style.outline = null;
        }
    }

    getSave():any {
        return null;
    }
}
