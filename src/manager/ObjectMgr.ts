import {ImageObj} from "../object/ImageObj";
import {Main_draw} from "../Main_draw";
import {_baseObj} from "../object/_baseObj";
import {TextObj} from "../object/TextObj";
import {SceneControls} from "./SceneControls";
import {EventMgr} from "./EventMgr";
import {EventEnum} from "../events/EventEnum";
import * as exceljs from "exceljs";

export class ObjectMgr {
    private static _instance: ObjectMgr = null;

    public static getIns(): ObjectMgr {
        if (!ObjectMgr._instance) {
            ObjectMgr._instance = new ObjectMgr();
        }
        return ObjectMgr._instance;
    }

    constructor() {
        // console.log(this);
    }

    public objList: _baseObj[] = [];

    addImage(file: File): ImageObj {
        if (!file) return null;

        let item = new ImageObj();
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (evt: any) => {
            if (evt.target.readyState !== FileReader.DONE) return;
            item.init(file.name, fileReader.result as string);
            this.resetLayer();
        }

        // Main_draw.getIns().scene.add(item);
        this.objList.push(item);
        this.resetLayer();
        return item;
    }

    addText(str: string = null) {
        let item = new TextObj();
        item.init(str, str);
        this.objList.push(item);
        this.resetLayer();
        return item;
    }

    getSave() {
        let out = [];
        for (let i = 0; i < this.objList.length; i++) {
            out.push(this.objList[i].getSave());
        }
        return out;
    }

    setSave(list: any[]) {
        this.objList = [];
        for (let i = 0; i < list.length; i++) {
            let item = list[i];
            let obj = null;
            if (item.type == "image") {
                obj = new ImageObj();
            } else if (item.type == "text") {
                obj = new TextObj();
            }
            obj.setSave(item);
            this.objList.push(obj);
        }

        SceneControls.getIns().cleanAllSel();
        this.resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    resetLayer() {
        let _y = 0;
        let _gap = 1;
        let sceneControls = SceneControls.getIns();
        for (let i = 0; i < this.objList.length; i++) {
            let item = this.objList[i];
            sceneControls.view.node.appendChild(item.svgItem.node);
            // item.setLayer((_y + _gap) * i);
        }
        EventMgr.getIns().dispatchEvent(EventEnum.resetLayerList);
    }

    findNode_text(node: Node, out: Node[] = null): Node[] {
        if (!out) out = [];
        for (let i = 0; i < node.childNodes.length; i++) {
            if (node.childNodes.item(i).nodeType != 3 && node.childNodes.item(i).nodeType != 4) {
                let child = node.childNodes.item(i);
                if (node.childNodes.item(i).nodeName == "text") {
                    out.push(child);
                } else if (child.childNodes) {
                    this.findNode_text(child, out);
                } else {
                    break;
                }
            }
        }
        return out;
    }

    getRealTextPlaceholder(val: string) {
        let valArr = [];
        let valStr = val;
        while (true) {
            let startIdx = valStr.indexOf("{{");
            if (startIdx != -1) {
                if (startIdx != 0) {
                    valArr.push({
                        type: "string",
                        val: valStr.substring(0, startIdx)
                    });
                }
                let tmpValStr = valStr.substring(startIdx + 2);
                let endIdx = tmpValStr.indexOf("}}");
                if (endIdx == 0) {
                    valArr.push({
                        type: "string",
                        val: "{{}}"
                    });
                    valStr = tmpValStr.substring(endIdx + 2);
                } else if (endIdx == -1) {
                    valArr.push({
                        type: "string",
                        val: "{{" + tmpValStr
                    });
                    break;
                } else {
                    let placeholder = tmpValStr.substring(0, endIdx);
                    //???{{}}??????????????????
                    //?????????????????????????????????????????????????????????
                    //????????????????????????{{F,2}}//????????????????????????????????????
                    let placeholderArr = placeholder.split(",");
                    if (placeholderArr.length == 2) {
                        let fix = parseInt(placeholderArr[1]);
                        if (fix + "" == placeholderArr[1]) {
                            valArr.push({
                                type: "placeholder",
                                val: placeholderArr[0],
                                isNum: true,
                                fixed: fix
                            });
                        } else {
                            valArr.push({
                                type: "placeholder",
                                val: placeholder,
                                isNum: false
                            });
                        }
                    } else {
                        valArr.push({
                            type: "placeholder",
                            val: placeholder,
                            isNum: false
                        });
                    }
                    valStr = tmpValStr.substring(endIdx + 2);
                }
            } else if (valStr.length > 0) {
                valArr.push({
                    type: "string",
                    val: valStr
                });
                break;
            } else {
                break;
            }
        }
        return valArr;
    }

    getRealText(outData: any[], row: exceljs.Row) {
        let out = "";
        for (let i = 0; i < outData.length; i++) {
            let item = outData[i];
            if (item.type == "string") {
                out += item.val;
            } else if (item.type == "placeholder") {
                let val = row.getCell(item.val).value;
                if(!!val["result"]){
                    val = val["result"];
                }
                if (item.isNum) {
                    let fix = item.fixed;
                    val = Math.floor(parseFloat(val + "") * Math.pow(10, item.fixed)) + "";
                    val = val.substring(0, val.length - item.fixed) + "." + val.substring(val.length - item.fixed);
                }
                if (!(val+"")) {
                    console.log("placeholder not found:", item.val, "row:", row.number);
                }
                out += val;
            }
        }
        return out;
    }

}
