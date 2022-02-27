import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {PropertyTypeEnum} from "../../src/PropertyTypeEnum";
import * as React from "react";
import {SceneControls} from "../../src/manager/SceneControls";

export default function PropertyItem_common() {
    const [prop_pos_x, setProp_pos_x] = React.useState(0);
    const [prop_pos_y, setProp_pos_y] = React.useState(0);

    let onTextHandleChange = (textItem: any, type: string) => {
        let chaProp: any = {};

        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let selItem = objects[0];

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
            }

            changeSelProperty();
        }
    };

    let changeSelProperty = ()=>{
        let objects = SceneControls.getIns().selected;
        if (objects && objects[0]) {
            let selItem = objects[0];
            if(prop_pos_x != selItem.svgItem.x()){
                setProp_pos_x(selItem.svgItem.x() as number);
            }
            if(prop_pos_y != selItem.svgItem.y()){
                setProp_pos_y(selItem.svgItem.y() as number);
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
