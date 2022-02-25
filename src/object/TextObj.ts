import { Text } from "@svgdotjs/svg.js";
import { SceneControls } from "../manager/SceneControls";
import { ObjStateEnum } from "./state/ObjStateEnum";
import { _baseObj } from "./_baseObj";

export class TextObj extends _baseObj {

    public static placeholder: string = "请输入文本";

    public svgItem: Text;

    constructor() {
        super("text");
        let sceneControls = SceneControls.getIns();
        this.svgItem = sceneControls.view.plain(TextObj.placeholder);
        this.svgItem.node.style.userSelect = "none";
        // .attr({'pointer-events':'none',"dominant-baseline":'central'});
        this.svgItem.attr({ "dominant-baseline": 'hanging' });
        this.svgItem.dom = "hanging ";
        this.svgItem.node["main"] = this;
        this.svgItem.node["isBaseObj"] = true;
        this.svgItem.node["isTextObj"] = true;
        this.svgItem.fill("rgba(0,0,0,1)");
        this.svgItem.font({
            family: 'SimHei', size: 14
        })
        this.isTextObj = true;
    }

    init(name: string = null, text: string = null) {
        if (!name) {
            name = TextObj.placeholder;
        }
        if (!text) {
            text = TextObj.placeholder;
        }
        this.setState(ObjStateEnum.loading);
        this.layerName = name;
        this.svgItem.plain(text);
        this.svgItem.x(0);
        this.svgItem.y(0);
        this.setState(ObjStateEnum.loaded);
    }

    setText(val:string) {
        this.svgItem.plain(val);
        this.layerName = val;
    }

    getSave():any {
        return {
            type: this.type,
            layerName: this.layerName,

            x: this.svgItem.x(),
            y: this.svgItem.y(),

            // width: this.svgItem.width(),
            // height: this.svgItem.height(),

            text: this.svgItem.text(),
            fontFamily: this.svgItem.font("family"),
            fontSize: this.svgItem.font("size"),
            // fontWeight: this.svgItem.fontWeight(),
            // fontStyle: this.svgItem.fontStyle(),

            color: this.svgItem.fill(),
            align: this.svgItem.attr("text-anchor"),
        };
    }

    setSave(data:any) {
        this.init(data.layerName, data.text);
        this.svgItem.x(data.x);
        this.svgItem.y(data.y);
        this.svgItem.fill(data.color);
        this.svgItem.font({
            family: data.fontFamily,
            size: data.fontSize
        });
        this.svgItem.attr({
            "text-anchor": data.align
        });
    }

}
