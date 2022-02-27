import * as React from 'react';
import {Basic} from '../src/Basic';
import {EventEnum} from '../src/events/EventEnum';
import {EventMgr} from '../src/manager/EventMgr';
import {ImageObj} from '../src/object/ImageObj';
import {TextObj} from '../src/object/TextObj';
import {SceneControls} from '../src/manager/SceneControls';
import List from '@mui/material/List';
import PropertyItem_scene from "./propertyItem/PropertyItem_scene";
import PropertyItem_common from "./propertyItem/PropertyItem_common";
import PropertyItem_image from "./propertyItem/PropertyItem_image";
import PropertyItem_text from "./propertyItem/PropertyItem_text";

export default class PropertyList extends React.Component {

    state: any;

    // countries:{font:string, en:string, cn:string}[] = [];
    constructor(props: any) {
        super(props);
        this.state = {
            layerList: [...SceneControls.getIns().selected],
        };

        EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_scene2layout, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.resetSelectList_scene2layout, () => {
            setTimeout(() => {
                this.setState({layerList: [...SceneControls.getIns().selected]});
                this.changeSelProperty();
            }, 100);
        }, Basic.EventObj_resetSelectList);

        EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_layer2scene, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.resetSelectList_layer2scene, () => {
            setTimeout(() => {
                this.setState({layerList: [...SceneControls.getIns().selected]});
                this.changeSelProperty();
            }, 100);
        }, Basic.EventObj_resetSelectList);

        EventMgr.getIns().removeByCaller(EventEnum.changeSelectProperty, Basic.EventObj_resetSelectList);
        EventMgr.getIns().add(EventEnum.changeSelectProperty, () => {
            setTimeout(() => {
                this.setState({layerList: [...SceneControls.getIns().selected]});
                this.changeSelProperty();
            }, 100);
        }, Basic.EventObj_resetSelectList);
    }

    changeSelProperty() {

    }

    render() {
        return (<>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    border: '1px solid #aaa',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: "420px",
                }}
            >
            {//未选择元素
                this.state.layerList.length == 0 && <PropertyItem_scene/>
            }
            {//位置
                this.state.layerList.length > 0 && <PropertyItem_common/>
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
                (<PropertyItem_image/>)
            }
            {//文本
                this.state.layerList.length > 0 &&
                (this.state.layerList[0] instanceof TextObj) &&
                (<PropertyItem_text/>)
            }
            </List>
        </>);
    }
}
