import {SVG, Svg, Rect, extend as SVGextend, Element as SVGElement, G} from '@svgdotjs/svg.js'
import {EventEnum} from '../events/EventEnum';
import {_baseObj} from "../object/_baseObj";
import {EventMgr} from './EventMgr';
import {ObjectMgr} from "./ObjectMgr";
import {Basic} from "../Basic";

export class SceneControls {

    private static _instance: SceneControls;

    public static getIns(): SceneControls {
        if (!SceneControls._instance) {
            SceneControls._instance = new SceneControls();
        }
        return SceneControls._instance;
    }

    private dom: HTMLElement = null;
    public scene: Svg;//整个场景
    public sceneBg: Rect;//整个场景的背景
    public view: Svg;//可用区域
    public viewBg: Rect;//可用背景
    private _view_width = 800;//可用区域宽度
    public get view_width() {
        return this._view_width;
    }

    public set view_width(w) {
        this._view_width = w;
        this.view.width(w);
    }

    private _view_height = 400;//可用区域高度
    public get view_height() {
        return this._view_height;
    }

    public set view_height(h) {
        this._view_height = h;
        this.view.height(h);
    }

    public _sceneName = Basic.defaultSceneName;
    public get sceneName() {
        if(!!this._sceneName) {
            this._sceneName = Basic.defaultSceneName;
        }
        return this._sceneName;
    }
    public set sceneName(name) {
        if (!!name) {
            name = Basic.defaultSceneName;
        }
        name = name.trim();
        if (!!name) {
            name = Basic.defaultSceneName;
        }
        this._sceneName = name;
    }

    public selected: _baseObj[] = [];

    constructor() {

    }

    init(dom: HTMLElement) {
        this.dom = dom;

        let _w = this.dom.clientWidth;
        let _h = this.dom.clientHeight;

        this.scene = SVG().size("100%", "100%");
        this.sceneBg = this.scene.rect().size("100%", "100%").attr({fill: '#f0f0f0'});

        this.view = SVG().size(100, 100);

        this.viewBg = this.view.rect().size("100%", "100%").attr({fill: '#ffffff'});
        this.view_width = 800;
        this.view_height = 400;

        this.scene.add(this.view);

        this.scene.addTo(dom);
        console.log(this.scene);

        dom.addEventListener('mousedown', this.onMouseDown.bind(this));
        dom.addEventListener('mousemove', this.onMouseMove.bind(this));
        dom.addEventListener('mouseup', this.onMouseUp.bind(this));

        EventMgr.getIns().add(EventEnum.resetSelectList_layer2scene, this.onResetSelectList, this);

        // this.controls = new OrbitControls( camera, dom );
        // this.controls.mouseButtons.LEFT = MOUSE.PAN;
        // this.controls.mouseButtons.RIGHT = MOUSE.ROTATE;
        // this.controls.touches.ONE = TOUCH.PAN;
        // this.controls.touches.TWO = TOUCH.DOLLY_ROTATE;
        // this.controls.enableRotate = false;
        // this.controls.enableZoom = false;
        // this.mouse = new Vector2();
        // this.raycaster = new Raycaster();
    }

    public posX = 0;//[-100, 100]
    public posY = 0;
    public beforePosX = 0;//[-100, 100]
    public beforePosY = 0;

    downPos: number[] = [-1, -1];
    isMouseDown = false;
    isDownObj = false;

    onMouseDown(event: MouseEvent) {

        this.downPos[0] = event.clientX;
        this.downPos[1] = event.clientY;
        this.beforePosX = this.posX;
        this.beforePosY = this.posY;
        this.isMouseDown = true;

        let target: any = event.target;
        if (target && this.selected.length > 0 && target.isBaseObj) {
            let selItem = target.main as _baseObj;
            let isDownItem = false;
            for (let i = 0; i < this.selected.length; i++) {
                let item: any = this.selected[i];
                if (item == selItem) {
                    isDownItem = true;
                }
                item.svgItem.beforePosX = item.svgItem.x();
                item.svgItem.beforePosY = item.svgItem.y();
            }
            if (isDownItem) {
                this.isDownObj = true;
                ;
            }
        }

        //     let intersection = this.getIntersections(event);
        //     if(intersection) {
        //         this.controls.enabled = false;
        //     } else {
        //         this.controls.enabled = true;
        //     }
    }

    onMouseMove(event: MouseEvent) {
        if (!this.isMouseDown) return;

        let chaX = this.downPos[0] - event.clientX;
        let chaY = this.downPos[1] - event.clientY;
        if (this.isDownObj && this.selected.length > 0) {//拖动对象
            for (let i = 0; i < this.selected.length; i++) {
                let item: any = this.selected[i];
                item.svgItem.x(item.svgItem.beforePosX - chaX);
                item.svgItem.y(item.svgItem.beforePosY - chaY);
                // console.log("onMouseMove",item.svgItem.beforePosX - chaX,item.svgItem.x());
                // console.log("onMouseMove",item.svgItem.beforePosY - chaY,item.svgItem.y());
            }
            Basic.changSelectProperty = true;
            EventMgr.getIns().dispatchEvent(EventEnum.changeSelectProperty);
        } else {//拖动舞台

            let containerBasePos = [this.dom.clientWidth / 2, this.dom.clientHeight / 2];

            this.posX = this.beforePosX - (chaX / containerBasePos[0]) * 100;
            this.posY = this.beforePosY - (chaY / containerBasePos[1]) * 100;

            this.resize();
        }
    }

    onMouseUp(event: MouseEvent) {
        //     this.controls.enabled = true;
        this.isMouseDown = false;
        let isDownObj = this.isDownObj;
        this.isDownObj = false;

        if (Math.abs(this.downPos[0] - event.clientX) < 10 &&
            Math.abs(this.downPos[1] - event.clientY) < 10) {

        } else {
            return;
        }

        if (isDownObj && this.selected.length > 0) {//拖动对象
        } else {//拖动舞台
            let isChangSelect = false;
            this.resize();
            let target: any = event.target;
            if (target && target.isBaseObj) {
                let selItem = target.main as _baseObj;
                event.stopPropagation();
                if (event.shiftKey) {
                    let selIdx = this.selected.indexOf(selItem);
                    if (selIdx !== -1) {
                        selItem.setSel(false);
                        this.selected.splice(selIdx, 1);
                    } else {
                        selItem.setSel(true);
                        this.selected.push(selItem);
                    }
                    isChangSelect = true;
                } else {
                    if (this.selected.length == 1) {
                        let selIdx = this.selected.indexOf(selItem);
                        if (selIdx !== -1) {

                        } else {
                            this.cleanAllSel();

                            selItem.setSel(true);
                            this.selected.push(selItem);
                            isChangSelect = true;
                        }
                    } else {
                        if (this.selected.length > 1) {
                            this.cleanAllSel();
                        }
                        selItem.setSel(true);
                        this.selected.push(selItem);
                        isChangSelect = true;
                    }
                }
                console.log(this.selected);
            } else {
                if (event.shiftKey) {
                } else if (this.selected.length > 0) {
                    this.cleanAllSel();
                    isChangSelect = true;
                }
            }
            if (isChangSelect) {
                EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
            }
        }
    }

    cleanAllSel() {
        if (this.selected.length > 0) {
            for (let i = 0; i < this.selected.length; i++) {
                let item = this.selected[i];
                item.setSel(false);
            }
            this.selected.length = 0;
        }
    }

    onResetSelectList(selItems: any[]) {
        console.log("EventEnum.resetSelectList_layer2scene onResetSelectList", selItems);
        if (this.selected.length > 0) {
            for (let i = 0; i < this.selected.length; i++) {
                let item = this.selected[i];
                item.setSel(false);
            }
            this.selected.length = 0;
        }

        for (let i = 0; i < selItems.length; i++) {
            selItems[i].setSel(true);
            this.selected.push(selItems[i]);
        }
    }

    onClickObj(event: PointerEvent, obj: _baseObj) {

    }

    getSave() {
        let out = {
            attribute: {
                name: this.sceneName,
                view: {
                    width: this.view_width,
                    height: this.view_height,
                }
            },
            list: ObjectMgr.getIns().getSave()
        }
        return out;
    }

    cleanScene() {
        this.cleanAllSel();
        let objList = ObjectMgr.getIns().objList;
        objList.length = 0;
    }

    setSave(attribute:any, list:any[]) {
        this.sceneName = attribute.name;
        this.view_width = attribute.view.width;
        this.view_height = attribute.view.height;
        ObjectMgr.getIns().setSave(list);
    }

    resize() {
        // this.scene.width(this.dom.clientWidth);
        // this.scene.height(this.dom.clientHeight);
        // this.sceneBg.width(this.dom.clientWidth);
        // this.sceneBg.height(this.dom.clientHeight);

        let containerBasePos = [this.dom.clientWidth / 2, this.dom.clientHeight / 2];
        let svgBasePos = [this.view_width / 2, this.view_height / 2];

        let chaW = containerBasePos[0] - svgBasePos[0];
        let chaH = containerBasePos[1] - svgBasePos[1];
        this.view.x(chaW + containerBasePos[0] * this.posX / 100);
        this.view.y(chaH + containerBasePos[1] * this.posY / 100);
    }

}
