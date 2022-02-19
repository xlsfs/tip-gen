import * as React from 'react';
import {Basic} from '../src/Basic';
import {EventEnum} from '../src/events/EventEnum';
import {EventMgr} from '../src/manager/EventMgr';
import {ObjectMgr} from '../src/manager/ObjectMgr';
import {ImageObj} from '../src/object/ImageObj';
import {TextObj} from '../src/object/TextObj';
import {PropertyTypeEnum} from '../src/PropertyTypeEnum';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {SceneControls} from '../src/manager/SceneControls';
import {SketchPicker} from 'react-color';
import dynamic from "next/dynamic";

const FontList = dynamic(
    () => {
        return import("../components/FontList");
    },
    {ssr: false}
);
export default class PropertyList extends React.Component {

    state: any;

    // countries:{font:string, en:string, cn:string}[] = [];
    constructor(props: any) {
        super(props);
        this.state = {
            displayColorPicker: false,
            prop_txt_color: {
                r: '0',
                g: '0',
                b: '0',
                a: '1',
            },

            layerList: [...ObjectMgr.getIns().objList],

            prop_pos_x: 0,
            prop_pos_y: 0,

            prop_img_width: 0,
            prop_img_height: 0,

            prop_txt_text: 14,
            prop_txt_fontFamily: "SimHei",
            prop_txt_fontSize: 14,

            prop_scene_width: SceneControls.getIns().view_width,
            prop_scene_height: SceneControls.getIns().view_height,

        };

        EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_scene2layout, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.resetSelectList_scene2layout, () => {
            this.setState({layerList: [...SceneControls.getIns().selected]});
            this.changeSelProperty();
        }, Basic.EventObj_resetSelectList);
``
        EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_layer2scene, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.resetSelectList_layer2scene, () => {
            this.setState({layerList: [...SceneControls.getIns().selected]});
            this.changeSelProperty();
        }, Basic.EventObj_resetSelectList);

        EventMgr.getIns().removeByCaller(EventEnum.changeSelectProperty, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.changeSelectProperty, () => {
            this.changeSelProperty();
        }, Basic.EventObj_resetSelectList);

    }

    changeSelProperty() {
        if (this.state.layerList && this.state.layerList[0]) {
            let selItem = this.state.layerList[0];
            let propObj: any = {
                prop_pos_x: selItem.svgItem.x(),
                prop_pos_y: selItem.svgItem.y()
            };
            if (selItem instanceof ImageObj) {
                propObj.prop_img_width = selItem.svgItem.width();
                propObj.prop_img_height = selItem.svgItem.height();
            }
            if (selItem instanceof TextObj) {
                propObj.prop_txt_text = selItem.svgItem.text();
                propObj.prop_txt_fontFamily = selItem.svgItem.font("family");
                propObj.prop_txt_fontSize = selItem.svgItem.font("size");

                let rgbaStr = selItem.svgItem.fill();
                rgbaStr = rgbaStr.replace("rgba", "");
                rgbaStr = rgbaStr.replace("(", "");
                rgbaStr = rgbaStr.replace(")", "");
                let rgbaArr = rgbaStr.split(",");
                propObj.prop_txt_color = {
                    r: rgbaArr[0] + '',
                    g: rgbaArr[1] + '',
                    b: rgbaArr[2] + '',
                    a: rgbaArr[3] + '',
                };
            }
            this.setState(propObj);

            if (selItem instanceof TextObj) {
                EventMgr.getIns().dispatchEvent(EventEnum.changeFontFamily, [propObj.prop_txt_fontFamily]);
            }
        }
    }

    getRgbaStr(): string {
        let color = this.state.prop_txt_color;
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    }

    onSceneTextHandleChange(textItem: any, type: string) {
        if (type == PropertyTypeEnum.scene_width) {
            let sceneWidth = parseInt(textItem.value);
            if(sceneWidth > 1) {
            } else {
                sceneWidth = 1;
            }
            this.setState({
                prop_scene_width: sceneWidth
            });
            SceneControls.getIns().view_width = sceneWidth;
        } else if (type == PropertyTypeEnum.scene_height) {
            let sceneHeight = parseInt(textItem.value);
            if(sceneHeight > 1) {
            } else {
                sceneHeight = 1;
            }
            this.setState({
                prop_scene_height: sceneHeight
            });
            SceneControls.getIns().view_height = sceneHeight;
        }
    }

    onTextHandleChange(textItem: any, type: string) {

        let selItem;
        let chaProp: any = {};

        let objects = this.state.layerList;
        if (objects.length > 0) {
            selItem = objects[0];

            if (type == PropertyTypeEnum.pos_x) {
                chaProp.x = parseFloat(textItem.value) - (selItem.svgItem.x() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.x(chaProp.x + (item.svgItem.x() as number));
                }
            } else if (type == PropertyTypeEnum.pos_y) {
                chaProp.y = parseFloat(textItem.value) - (selItem.svgItem.y() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.y(chaProp.y + (item.svgItem.y() as number));
                }
            } else if (type == PropertyTypeEnum.img_width) {
                chaProp.width = parseFloat(textItem.value) - (selItem.svgItem.width() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.width(chaProp.width + (item.svgItem.width() as number));
                }
            } else if (type == PropertyTypeEnum.img_height) {
                chaProp.height = parseFloat(textItem.value) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.height(chaProp.height + (item.svgItem.height() as number));
                }
            } else if (type == PropertyTypeEnum.txt_text) {
                chaProp.height = parseFloat(textItem.value) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.setText(textItem.value);
                    }
                }
                setTimeout(()=>{
                    EventMgr.getIns().dispatchEvent(EventEnum.resetLayerList);
                },0);
            } else if (type == PropertyTypeEnum.txt_family) {
                chaProp.height = parseFloat(textItem.value) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.svgItem.font({family: textItem.value});
                    }
                }
            } else if (type == PropertyTypeEnum.txt_size) {
                chaProp.height = parseFloat(textItem.value) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.svgItem.font({size: textItem.value});
                    }
                }
            }

            this.changeSelProperty();
        }
    }

    onTextHandleChange_fontFamily(val: string, type: string) {
        let selItem;
        let chaProp: any = {};
        let objects = this.state.layerList;
        if (objects.length > 0) {
            selItem = objects[0];
            if (type == PropertyTypeEnum.txt_family) {
                chaProp.height = parseFloat(val) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.svgItem.font({family: val});
                    }
                }
            }
            this.changeSelProperty();
        }
    }

    onTextHandleChange_color(type: string) {
        let selItem;

        let objects = this.state.layerList;
        if (objects.length > 0) {
            selItem = objects[0];
            let color = this.state.prop_txt_color;
            let newColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            for (let i = 0; i < objects.length; i++) {
                let item = objects[i];
                if (item instanceof TextObj) {
                    item.svgItem.fill(newColor);
                }
            }
        }
    }

    handleClick_color() {
        this.setState({displayColorPicker: !this.state.displayColorPicker});
    }

    handleClose_color() {
        this.setState({displayColorPicker: false});
    }

    handleChange_color(color: any) {
        this.setState({prop_txt_color: color.rgb});
        this.onTextHandleChange_color(PropertyTypeEnum.txt_color);
    }

    render() {
        return (<>
            {//未选择元素
                this.state.layerList.length == 0 &&
                (<Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    p={1}>
                    <Grid item>
                        <p>舞台属性</p>
                    </Grid>
                    <Grid item>
                        <p style={{margin: 0}}>舞台尺寸(像素)</p>
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.scene_width}
                            value={this.state.prop_scene_width}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>宽:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onSceneTextHandleChange(event.target, PropertyTypeEnum.scene_width);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.scene_height}
                            value={this.state.prop_scene_height}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>高:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onSceneTextHandleChange(event.target, PropertyTypeEnum.scene_height);
                            }}
                        />
                    </Grid>

                </Grid>)
            }
            {//位置
                this.state.layerList.length > 0 &&
                (<Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    p={1}>
                    <Grid item>
                        <p style={{margin: 0}}>位置</p>
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.pos_x}
                            value={this.state.prop_pos_x}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>X:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.pos_x);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.pos_y}
                            value={this.state.prop_pos_y}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>Y:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.pos_y);
                            }}
                        />
                    </Grid>
                </Grid>)
            }
            {//旋转
                // this.state.layerList.length > 0 &&
                // <p></p>
            }
            {//缩放
                // this.state.layerList.length > 0 &&
                // <p></p>
            }
            {//图片
                this.state.layerList.length > 0 &&
                (this.state.layerList[0] instanceof ImageObj) &&
                (<Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    p={1}>
                    <Grid item>
                        <p style={{margin: 0}}>图片</p>
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.img_width}
                            value={this.state.prop_img_width}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>Width:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.img_width);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.img_height}
                            value={this.state.prop_img_height}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>Height:</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.img_height);
                            }}
                        />
                    </Grid>
                </Grid>)
            }
            {//文本
                this.state.layerList.length > 0 &&
                (this.state.layerList[0] instanceof TextObj) &&
                (<Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1}
                    p={1}>
                    <Grid item>
                        <p style={{margin: 0}}>文本框</p>
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.txt_text}
                            value={this.state.prop_txt_text}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>Text：</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.txt_text);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <span style={{width: "100px"}}>字体：</span>
                        <FontList
                            selVal={this.state.prop_txt_fontFamily}
                            onChange={(val: string) => {
                                this.onTextHandleChange_fontFamily(val, PropertyTypeEnum.txt_family);
                            }}/>
                    </Grid>
                    <Grid item>
                        <TextField
                            id={PropertyTypeEnum.txt_size}
                            value={this.state.prop_txt_fontSize}
                            hiddenLabel
                            size="small"
                            variant="standard"
                            InputProps={{
                                startAdornment: (
                                    <span style={{width: "100px"}}>字号：</span>
                                )
                            }}
                            onChange={(event) => {
                                this.onTextHandleChange(event.target, PropertyTypeEnum.txt_size);
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <span style={{width: "100px", float: 'left',}}>Color：</span>
                        <div style={{
                            // padding: '5px',
                            background: '#fff',
                            borderRadius: '1px',
                            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                            display: 'inline-block',
                            cursor: 'pointer',
                        }} onClick={() => {
                            this.handleClick_color()
                        }}>
                            <div style={{
                                width: '55px',
                                height: '14px',
                                borderRadius: '2px',
                                background: this.getRgbaStr(),
                            }}/>
                        </div>
                        {
                            this.state.displayColorPicker ? <div style={{
                                position: 'absolute',
                                zIndex: '2',
                            }}>
                                <div style={{
                                    position: 'fixed',
                                    top: '0px',
                                    right: '0px',
                                    bottom: '0px',
                                    left: '0px',
                                }} onClick={() => {
                                    this.handleClose_color()
                                }}/>
                                <SketchPicker color={this.state.color} onChange={(color: any) => {
                                    this.handleChange_color(color);
                                }}/>
                            </div> : null
                        }
                    </Grid>
                </Grid>)
            }
        </>);
    }
}
