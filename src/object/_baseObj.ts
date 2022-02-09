import { Element } from "@svgdotjs/svg.js";
import { ObjStateEnum } from "./state/ObjStateEnum";

export class _baseObj  {

    protected state = ObjStateEnum.waitLoad;

    // protected wireframe: Mesh;

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

    constructor () {
        this.isBaseObj = true;
    }

    setLayer(idx:number) {
        
    }

    // getSel() { }

    setSel(sel: boolean) {
        if(sel) {
            this.svgItem.node.style.outline = '2px solid blue';
        } else {
            this.svgItem.node.style.outline = null;
        }
    }
}