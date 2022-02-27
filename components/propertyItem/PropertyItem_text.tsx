import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {PropertyTypeEnum} from "../../src/PropertyTypeEnum";
import {ColorResult, RGBColor, SketchPicker} from "react-color";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import * as React from "react";
import dynamic from "next/dynamic";
import {TextObj} from "../../src/object/TextObj";
import {EventMgr} from "../../src/manager/EventMgr";
import {EventEnum} from "../../src/events/EventEnum";
import {SceneControls} from "../../src/manager/SceneControls";

const FontList = dynamic(
    () => {
        return import("../../components/FontList");
    },
    {ssr: false}
);

export default function PropertyItem_text(props: any) {
    const [prop_txt_text, setProp_txt_text] = React.useState("");
    const [prop_txt_fontFamily, setProp_txt_fontFamily] = React.useState("SimHei");
    const [prop_txt_fontSize, setProp_txt_fontSize] = React.useState(14);
    const [displayColorPicker, setDisplayColorPickere] = React.useState(false);
    const [color, setColor] = React.useState("#000000");
    const [prop_txt_font_color, setProp_txt_font_color] = React.useState("rgba(0,0,0,1)");
    const [prop_txt_align, setProp_txt_align] = React.useState("left");

    let onTextHandleChange = (textItem: any, type: string) => {
        let selItem;
        let chaProp: any = {};

        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            selItem = objects[0];
            if (type == PropertyTypeEnum.txt_text) {
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
            } else if (type == PropertyTypeEnum.txt_align) {
                let align = textItem.value;
                let anchor = align == "right" ? "end" : align == "center" ? "middle" : "start";
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.svgItem.attr({"text-anchor": anchor});
                    }
                }
            }

            changeSelProperty();
        }
    }

    let changeSelProperty = () => {
        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let selItem = objects[0];
            if (selItem instanceof TextObj) {
                let tmpText = selItem.svgItem.text();
                if(prop_txt_text != tmpText) {
                    setProp_txt_text(tmpText);
                }
                let tmpFontFamily = selItem.svgItem.font("family");
                if(prop_txt_fontFamily != tmpFontFamily) {
                    setProp_txt_fontFamily(tmpFontFamily);
                }
                let tmpFontSize = parseFloat(selItem.svgItem.font("size"));
                if(prop_txt_fontSize != tmpFontSize) {
                    setProp_txt_fontSize(tmpFontSize);
                }
                let anchor = selItem.svgItem.attr("text-anchor");
                let tmpFontAlign = anchor == "middle" ? "center" : anchor == "end" ? "right" : "left";
                if(prop_txt_align != tmpFontAlign) {
                    setProp_txt_align(tmpFontAlign);
                }
                let rgbaStr = selItem.svgItem.fill();
                if(prop_txt_font_color != rgbaStr) {
                    setProp_txt_font_color(rgbaStr);
                }
            }

            if (selItem instanceof TextObj) {
                EventMgr.getIns().dispatchEvent(EventEnum.changeFontFamily, [prop_txt_fontFamily]);
            }
        }
    }

    let onTextHandleChange_fontFamily = (val: string, type: string) => {
        let chaProp: any = {};
        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let selItem = objects[0];
            if (type == PropertyTypeEnum.txt_family) {
                chaProp.height = parseFloat(val) - (selItem.svgItem.height() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    if (item instanceof TextObj) {
                        item.svgItem.font({family: val});
                    }
                }
            }
            changeSelProperty();
        }
    }

    let onTextHandleChange_color = (type: string, color:RGBColor) => {
        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let newColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            for (let i = 0; i < objects.length; i++) {
                let item = objects[i];
                if (item instanceof TextObj) {
                    item.svgItem.fill(newColor);
                }
            }
            setProp_txt_font_color(newColor);
        }
    }

    let handleClick_color = () => {
        setDisplayColorPickere(!displayColorPicker);
    }

    let handleClose_color = () => {
        setDisplayColorPickere(false);
    }

    let handleChange_color = (color: ColorResult) => {
        onTextHandleChange_color(PropertyTypeEnum.txt_color, color.rgb);
    }

    let getRgbaStr = (): string => {
        return prop_txt_font_color;
    }

    setTimeout(()=>{
        changeSelProperty();
    },100);

    return (<Grid
        container
        direction="column"
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
                value={prop_txt_text}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>Text：</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.txt_text);
                }}
            />
        </Grid>
        <Grid item>
            <span style={{width: "100px"}}>字体：</span>
            <FontList
                selVal={prop_txt_fontFamily}
                onChange={(val: string) => {
                    onTextHandleChange_fontFamily(val, PropertyTypeEnum.txt_family);
                }}/>
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.txt_size}
                value={prop_txt_fontSize}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>字号：</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.txt_size);
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
                handleClick_color()
            }}>
                <div style={{
                    width: '55px',
                    height: '14px',
                    borderRadius: '2px',
                    background: getRgbaStr(),
                }}/>
            </div>
            {
                displayColorPicker ? <div style={{
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
                        handleClose_color()
                    }}/>
                    <SketchPicker color={color} onChange={(color: ColorResult) => {
                        handleChange_color(color);
                    }}/>
                </div> : null
            }
        </Grid>
        <Grid item>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">对齐方式：</FormLabel>
                <RadioGroup
                    id={PropertyTypeEnum.txt_align}
                    value={prop_txt_align}
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="left"
                    name="radio-buttons-group"
                    onChange={(event) => {
                        onTextHandleChange(event.target, PropertyTypeEnum.txt_align);
                    }}
                >
                    <FormControlLabel value="left" control={<Radio />} label="left" />
                    <FormControlLabel value="center" control={<Radio />} label="center" />
                    <FormControlLabel value="right" control={<Radio />} label="right" />
                </RadioGroup>
            </FormControl>
        </Grid>
    </Grid>)
}
