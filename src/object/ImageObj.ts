import {Svg, Image, SVG, namespaces} from "@svgdotjs/svg.js";
import {SceneControls} from "../manager/SceneControls";
import {ObjStateEnum} from "./state/ObjStateEnum";
import {_baseObj} from "./_baseObj";

export class ImageObj extends _baseObj {

    // private model: Mesh;
    // private texture: Texture;

    public svgItem: Svg;
    public image: Image;
    public imageData: string;

    private vboxWidth: number;
    private vboxHeight: number;

    constructor() {
        super("image");
        this.svgItem = SVG();

        this.svgItem.node["main"] = this;
        this.svgItem.node["isBaseObj"] = true;
        this.svgItem.node["isImageObj"] = true;
        this.svgItem.attr('preserveAspectRatio', 'none');
        this.image = this.svgItem.image();
        this.image.node["main"] = this;
        this.image.node["isBaseObj"] = true;
        this.image.node["isImageObj"] = true;
        let sceneControls = SceneControls.getIns();
        sceneControls.view.add(this.svgItem);
        this.isImageObj = true;
    }

    init(name: string, src: string) {
        this.setState(ObjStateEnum.loading);
        this.layerName = name;
        this.imageData = src;
        this.image.load(src, (event: Event) => {
            let ww = this.image.width() as number;
            let hh = this.image.height() as number;

            this.vboxWidth = ww;
            this.vboxHeight = hh;

            this.svgItem.width(ww);
            this.svgItem.height(hh);

            this.svgItem.viewbox({
                x: 0,
                y: 0,
                width: ww,
                height: hh
            });
        });
        this.setState(ObjStateEnum.loaded);
        // this.image.src = src;
        // this.image.onload = () => {
        //     // console.log(this.image, this.image.height, this.image.width);
        //     console.log(this.image.width, this.image.height);
        //     // this.loadedImageComplete();
        //     this.setState(ObjStateEnum.loaded);
        // };
    }

    getSave(): any {

        return {
            type: this.type,
            layerName: this.layerName,

            x: this.svgItem.x(),
            y: this.svgItem.y(),

            vboxWidth: this.vboxWidth,
            vboxHeight: this.vboxHeight,

            width: this.svgItem.width(),
            height: this.svgItem.height(),

            image: this.imageData,
        };
    }

    setSave(data: any) {
        this.layerName = data.layerName;

        this.svgItem.x(data.x);
        this.svgItem.y(data.y);

        this.svgItem.width(data.width);
        this.svgItem.height(data.height);

        this.svgItem.viewbox({
            x: 0,
            y: 0,
            width: data.vboxWidth,
            height: data.vboxHeight
        });

        this.imageData = data.image;

        this.image.load(this.imageData, (event: Event) => {
            let ww = this.image.width() as number;
            let hh = this.image.height() as number;

            this.vboxWidth = ww;
            this.vboxHeight = hh;

            this.svgItem.width(ww);
            this.svgItem.height(hh);

            this.svgItem.viewbox({
                x: 0,
                y: 0,
                width: ww,
                height: hh
            });
        });
    }
}

// geo.attributes.color = new BufferAttribute(new Float32Array([
// 	1, 0, 0,
// 	0, 1, 0,
// 	0, 0, 1,
// 	1, 1, 0,
// ]), 3);
