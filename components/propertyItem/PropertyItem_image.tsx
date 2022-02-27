import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {PropertyTypeEnum} from "../../src/PropertyTypeEnum";
import * as React from "react";
import {ImageObj} from "../../src/object/ImageObj";
import {SceneControls} from "../../src/manager/SceneControls";

export default function PropertyItem_image(props: any) {
    const [prop_img_width, setProp_img_width] = React.useState(0);
    const [prop_img_height, setProp_img_height] = React.useState(0);

    let onTextHandleChange = (textItem: any, type: string) => {

        let chaProp: any = {};

        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
            let selItem = objects[0];
            if (type == PropertyTypeEnum.img_width) {
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
            }

            changeSelProperty();
        }
    };

    let changeSelProperty = () => {
        let objects = SceneControls.getIns().selected;
        if (objects && objects[0]) {
            let selItem = objects[0];
            if (selItem instanceof ImageObj) {
                let tmpWidth = selItem.svgItem.width() as number;
                if(prop_img_width != tmpWidth) {
                    setProp_img_width(tmpWidth);
                }
                let tmpHeight = selItem.svgItem.height() as number;
                if(prop_img_height != tmpHeight) {
                    setProp_img_height(tmpHeight);
                }
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
            <p style={{margin: 0}}>图片</p>
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.img_width}
                value={prop_img_width}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>Width:</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.img_width);
                }}
            />
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.img_height}
                value={prop_img_height}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>Height:</span>
                    )
                }}
                onChange={(event) => {
                    onTextHandleChange(event.target, PropertyTypeEnum.img_height);
                }}
            />
        </Grid>
    </Grid>)
}
