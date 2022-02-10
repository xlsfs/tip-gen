import { ImageObj } from "../object/ImageObj";
import { Main_draw } from "../Main_draw";
import { _baseObj } from "../object/_baseObj";
import { TextObj } from "../object/TextObj";
import { SceneControls } from "./SceneControls";
import { EventMgr } from "./EventMgr";
import { EventEnum } from "../events/EventEnum";

export class ObjectMgr {
    private static _instance: ObjectMgr = null;
    public static getIns(): ObjectMgr {
        if (!ObjectMgr._instance) {
            ObjectMgr._instance = new ObjectMgr();
        }
        return ObjectMgr._instance;
    }

    constructor() {
        console.log(this);
    }

    public objList: _baseObj[] = [];

    addImage(file: File): ImageObj {
        if (!file) return null;

        let item = new ImageObj();
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = (evt: any)=> {
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
}
