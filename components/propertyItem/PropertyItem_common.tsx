import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {PropertyTypeEnum} from "../../src/PropertyTypeEnum";
import * as React from "react";
import {SceneControls} from "../../src/manager/SceneControls";

export default function PropertyItem_common() {
    const [prop_pos_x, setProp_pos_x] = React.useState(0);
    const [prop_pos_y, setProp_pos_y] = React.useState(0);

    const [prop_rot_x, setProp_rot_x] = React.useState(0);

    let clampRotate = (rotate: number) => {
        while (rotate > 180) {
            rotate = rotate - 360;
        }
        while (rotate < -180) {
            rotate = rotate + 360;
        }
        return rotate;//Math.floor(rotate * 100) / 100;
    };

    let onTextHandleChange = (textItem: any, type: string) => {
        let chaProp: any = {};

        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let selItem = objects[0];

            if (type == PropertyTypeEnum.pos_x) {
                chaProp.x = textItem.value - (selItem.svgItem.x() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.x(chaProp.x + (item.svgItem.x() as number));
                }
            } else if (type == PropertyTypeEnum.pos_y) {
                chaProp.y = textItem.value - (selItem.svgItem.y() as number);
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.y(chaProp.y + (item.svgItem.y() as number));
                }
            } else if (type == PropertyTypeEnum.rotate_x) {
                chaProp.rotX = textItem.value - selItem.svgItem.transform().rotate;
                for (let i = 0; i < objects.length; i++) {
                    let item = objects[i];
                    item.svgItem.transform({ rotate:
                        clampRotate(chaProp.rotX + item.svgItem.transform().rotate)
                    });
                }
            }

            changeSelProperty();
        }
    };

    let changeSelProperty = ()=>{
        let objects = SceneControls.getIns().selected;
        if (objects && objects[0]) {
            let selItem = objects[0];
            if(prop_pos_x != selItem.svgItem.x()){
                setProp_pos_x(Math.round((selItem.svgItem.x() as number) * 1000) / 1000);
            }
            if(prop_pos_y != selItem.svgItem.y()){
                setProp_pos_y(Math.round((selItem.svgItem.y() as number) * 1000) / 1000);
            }
            if(prop_rot_x != selItem.svgItem.transform().rotate){
                let rotX = selItem.svgItem.transform().rotate;
                rotX = clampRotate(rotX);
                rotX = Math.round(rotX * 1000) / 1000;
                setProp_rot_x( rotX);
            }
        }
    };

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
            <p style={{margin: 0}}>位置</p>
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.pos_x}
                value={prop_pos_x}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>X:</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.pos_x);
                }}
            />
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.pos_y}
                value={prop_pos_y}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>Y:</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.pos_y);
                }}
            />
        </Grid>
    </Grid>)
}
/*

        <Grid item>
            <TextField
                id={PropertyTypeEnum.rotate_x}
                value={prop_rot_x}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>旋转:</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.rotate_x);
                }}
            />
        </Grid>

 */
