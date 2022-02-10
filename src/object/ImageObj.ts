
import {Svg, Image, SVG} from "@svgdotjs/svg.js";
import { Basic } from "../Basic";
import { EventEnum } from "../events/EventEnum";
import { EventMgr } from "../manager/EventMgr";
import { SceneControls } from "../manager/SceneControls";
import { EdgesUtils } from "../utils/EdgesUtils";
import { ObjStateEnum } from "./state/ObjStateEnum";
import { _baseObj } from "./_baseObj";

export class ImageObj extends _baseObj {

    // private model: Mesh;
    // private texture: Texture;

    public svgItem: Svg;
    public image: Image;

    constructor() {
        super();
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
        this.image.load(src, (event: Event) => {
            let ww = this.image.width() as number;
            let hh = this.image.height() as number;
            this.svgItem.width(ww);
            this.svgItem.height(hh);
            this.svgItem.viewbox( {
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


    // loadedImageComplete() {

    // // this.image.width;
    // // this.image.height;
    // this.texture = new Texture();
    // this.texture.image = this.image;
    // this.texture.needsUpdate = true;
    // // this.texture = new TextureLoader().load("https://r105.threejsfundamentals.org/threejs/resources/images/wall.jpg");

    // let geo = new BufferGeometry();
    // geo.attributes.position = new BufferAttribute(new Float32Array([
    //     -.5, 0, .5, // 0
    //     .5, 0, .5, // 1
    //     .5, 0, -.5, // 2
    //     -.5, 0, -.5, // 3
    // ]), 3);
    // geo.attributes.uv = new BufferAttribute(new Uint16Array([0, 0, 1, 0, 1, 1, 0, 1]), 2);
    // geo.index = new BufferAttribute(new Uint16Array([0, 1, 2, 0, 2, 3]), 1);
    // this.model = new Mesh(geo,
    //     new MeshBasicMaterial({
    //         map: this.texture,
    //         transparent: true,
    //         // opacity: .5
    //         // vertexColors: true
    //     })
    // );

    // var edges = new EdgesGeometry(geo, Basic.DEFAULT_EDGES_THRESHOLD_ANGLE);
    // this.wireframe = EdgesUtils.createWireframeFromEdgesGeometry(edges, {
    //     color: Basic.COLOR_HOVERON_WIREFRAME_BOX,
    //     depthTest: false
    // });
    // this.wireframe.name = 'wireframeBox';
    // this.wireframe.visible = false;

    // let scale = Basic.DEFAULT_UNIT_LENGTH_p;
    // this.model.scale.set(this.image.width / scale, 1, this.image.height / scale);
    // this.add(this.model);
    // this.wireframe.scale.set(this.image.width / scale, 1, this.image.height / scale);
    // this.add(this.wireframe);
    // console.log(this.model.scale, scale);

    // }
}

// geo.attributes.color = new BufferAttribute(new Float32Array([
// 	1, 0, 0,
// 	0, 1, 0,
// 	0, 0, 1,
// 	1, 1, 0,
// ]), 3);
