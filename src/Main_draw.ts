import { SVG, Svg, Rect, extend as SVGextend, Element as SVGElement } from '@svgdotjs/svg.js'
import { Basic } from "./Basic";
import { PageObj } from "./display/PageObj";
import { EventEnum } from "./events/EventEnum";
import { EventMgr } from "./manager/EventMgr";
import { SceneControls } from "./manager/SceneControls";
import { MathUtils } from "./utils/MathUtils";

export class Main_draw {

    private static _instance: Main_draw;
    public static getIns(): Main_draw {
        if (!Main_draw._instance) {
            Main_draw._instance = new Main_draw();
        }
        return Main_draw._instance;
    }

    public page: PageObj;

    constructor() {
    }

    init() {
        let svgContainer = document.getElementById("svgContainer") as HTMLDivElement;
        SceneControls.getIns().init(svgContainer);
        
        EventMgr.getIns().add(EventEnum.changeCameraZoom, this.onChangeCameraZoom, this);
        this.onChangeCameraZoom(0.5);

        {
            // let spacing = 0.5 / Basic.DEFAULT_UNIT_LENGTH_c;//5毫米
            // let countX = 600;
            // let countZ = 600;
            // this.grid = new GridObj(spacing, countX, countZ);
            // this.scene.add(this.grid);
        }
        {
            this.page = new PageObj();
            //21厘米*27厘米
            this.page.setSize(210, 297);
            // this.scene.add(this.page);
        }

        window.addEventListener('resize', () => {
            // let canvas = document.getElementById("3dcanvas") as HTMLCanvasElement;
            // var SCREEN_WIDTH = canvas.parentElement.clientWidth;
            // var SCREEN_HEIGHT = canvas.parentElement.clientHeight;
            // let width = SCREEN_WIDTH / 2;
            // let height = SCREEN_HEIGHT / 2;
            // // 重新设置相机宽高比例
            // // this.camera.aspect = window.innerWidth / window.innerHeight;
            // // 更新相机投影矩阵
            // // 重新设置渲染器渲染范围
            // this.renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

            // this.camera.left = -width;
            // this.camera.right = width;
            // this.camera.top = height;
            // this.camera.bottom = -height;
            // this.camera.updateProjectionMatrix();
            SceneControls.getIns().resize();
        });
        SceneControls.getIns().resize();
    }

    onChangeCameraZoom(value: number) {
        let newValue;
        if (value < 0.5) {
            newValue = MathUtils.lerp(0.01, 0.1, value / 0.5);
        } else {
            newValue = MathUtils.lerp(0.1, 1, (value - 0.5) / 0.5);
        }
        // this.camera.zoom = newValue;
        // // console.log(value, newValue);
        // this.camera.updateProjectionMatrix();
    }
}