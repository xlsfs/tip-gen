import * as React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import {EventMgr} from '../src/manager/EventMgr';
import {EventEnum} from '../src/events/EventEnum';
import {ObjectMgr} from '../src/manager/ObjectMgr';
import {_baseObj} from '../src/object/_baseObj';
import {Basic} from '../src/Basic';
import {SceneControls} from '../src/manager/SceneControls';
import {TextObj} from '../src/object/TextObj';
import {ImageObj} from '../src/object/ImageObj';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import DeleteIcon from "@mui/icons-material/Delete";

// export default function LayerList(props: any) {
export default class LayerList extends React.Component {

    state: any;

    constructor(props: any) {
        super(props);

        this.state = {
            layerList: [...ObjectMgr.getIns().objList].reverse(),
            selectedItem: [...SceneControls.getIns().selected],
        };

        // const [layerList, setLayerList] = React.useState([...ObjectMgr.getIns().objList]);
        // const [selectedIndex, setSelectedIndex] = React.useState(null);

        EventMgr.getIns().removeByCaller(EventEnum.resetLayerList, Basic.EventObj_LayerList);
        EventMgr.getIns().add(EventEnum.resetLayerList, () => {
            // this.setState({layerList: []});
            this.setState({layerList: [...ObjectMgr.getIns().objList].reverse()});
            // setLayerList([...ObjectMgr.getIns().objList]);
        }, Basic.EventObj_LayerList);

        EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_scene2layout, Basic.EventObj_LayerList);
        EventMgr.getIns().add(EventEnum.resetSelectList_scene2layout, () => {
            this.setState({selectedItem: [...SceneControls.getIns().selected]});
            // setLayerList([...ObjectMgr.getIns().objList]);
        }, Basic.EventObj_LayerList);
    }

    handleListItemClick(
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        item: any,
    ) {
        if(event.shiftKey && this.state.selectedItem.length > 0) {//多选
            let selIdx = this.state.selectedItem.indexOf(item);
            if(selIdx === -1) {
                this.state.selectedItem.push(item);
            } else {
                this.state.selectedItem.splice(selIdx, 1);
            }
            this.setState({selectedItem: [...this.state.selectedItem]});
            EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_layer2scene, [[...this.state.selectedItem]]);
        } else {
            this.setState({selectedItem: [item]});
            EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_layer2scene, [[item]]);
        }
        // setSelectedIndex(item);
    }

    //移动到最底层
    goBottom() {
        let objList = ObjectMgr.getIns().objList;
        let selected = SceneControls.getIns().selected;
        let selArr = [];
        for (let i = 0; i < selected.length; i++) {
            let selItem = selected[i];
            let selItemIdx = objList.indexOf(selItem);
            if (selItemIdx != -1) {
                selArr.push({idx: selItemIdx, item: selItem});
            }
        }
        selArr.sort((a: any, b: any) => {
            let idx = b.idx - a.idx;//z-a
            return idx;
        });
        for (let i = 0; i < selArr.length; i++) {
            let selItemIdx = objList.indexOf(selArr[i].item);
            objList.splice(selItemIdx, 1);
            objList.unshift(selArr[i].item)
        }
        ObjectMgr.getIns().resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    //向下一层
    goDown() {
        let objList = ObjectMgr.getIns().objList;
        let selected = SceneControls.getIns().selected;
        let selArr = [];
        for (let i = 0; i < selected.length; i++) {
            let selItem = selected[i];
            let selItemIdx = objList.indexOf(selItem);
            if (selItemIdx != -1) {
                selArr.push({idx: selItemIdx, item: selItem});
            }
        }
        selArr.sort((a: any, b: any) => {
            let idx = b.idx - a.idx;//z-a
            return idx;
        });
        for (let i = 0; i < selArr.length; i++) {
            let selItem = selArr[i].item;
            let selItemIdx = objList.indexOf(selItem);
            objList.splice(selItemIdx, 1);
            if (selItemIdx - 1 < 0) {
                objList.unshift(selItem);
            } else {
                objList.splice(selItemIdx - 1, 0, selItem);
            }
        }
        ObjectMgr.getIns().resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    //向上一层
    goUp() {
        let objList = ObjectMgr.getIns().objList;
        let selected = SceneControls.getIns().selected;
        let selArr = [];
        for (let i = 0; i < selected.length; i++) {
            let selItem = selected[i];
            let selItemIdx = objList.indexOf(selItem);
            if (selItemIdx != -1) {
                selArr.push({idx: selItemIdx, item: selItem});
            }
        }
        selArr.sort((a: any, b: any) => {
            let idx = a.idx - b.idx;//a-z
            return idx;
        });
        for (let i = 0; i < selArr.length; i++) {
            let selItem = selArr[i].item;
            let selItemIdx = objList.indexOf(selItem);
            objList.splice(selItemIdx, 1);
            if (selItemIdx + 1 >= objList.length) {
                objList.push(selItem);
            } else {
                objList.splice(selItemIdx + 1, 0, selItem);
            }
        }
        ObjectMgr.getIns().resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    //移动到最顶层
    goTop() {
        let objList = ObjectMgr.getIns().objList;
        let selected = SceneControls.getIns().selected;
        let selArr = [];
        for (let i = 0; i < selected.length; i++) {
            let selItem = selected[i];
            let selItemIdx = objList.indexOf(selItem);
            if (selItemIdx != -1) {
                selArr.push({idx: selItemIdx, item: selItem});
            }
        }
        selArr.sort((a: any, b: any) => {
            let idx = a.idx - b.idx;//a-z
            return idx;
        });
        for (let i = 0; i < selArr.length; i++) {
            let selItemIdx = objList.indexOf(selArr[i].item);
            objList.splice(selItemIdx, 1);
            objList.push(selArr[i].item)
        }
        ObjectMgr.getIns().resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    //删除层
    delLayer() {
        let objList = ObjectMgr.getIns().objList;
        let selected = SceneControls.getIns().selected;
        // let selArr = [];
        for (let i = 0; i < selected.length; i++) {
            let selItem = selected[i];
            let selItemIdx = objList.indexOf(selItem);
            if (selItemIdx != -1) {
                objList.splice(selItemIdx, 1);
                selItem.remove();
                // selArr.push({idx: selItemIdx, item: selItem});
            }
        }
        SceneControls.getIns().cleanAllSel();
        ObjectMgr.getIns().resetLayer();
        EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
    }

    render() {
        return (<>
            <span>图层</span>
            <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={1}
                p={1}>
                <Grid item>
                    {<div style={{
                        pointerEvents: this.state.selectedItem.length == 0 ? "none" : "auto"
                    }}>
                        <IconButton
                            // color={this.state.selectedItem.length == 0?"#eeeeee":"#42a5f5"}
                            disabled={this.state.selectedItem.length == 0 || this.state.layerList.length < 2}
                            onClick={(event) => {
                                //移动到最顶层
                                this.goTop();
                            }}>
                            <KeyboardDoubleArrowUpIcon/>
                        </IconButton>
                        <IconButton
                            disabled={this.state.selectedItem.length == 0 || this.state.layerList.length < 2}
                            onClick={(event) => {
                                //向上一层
                                this.goUp();
                            }}>
                            <KeyboardArrowUpIcon/>
                        </IconButton>
                        <IconButton
                            disabled={this.state.selectedItem.length == 0 || this.state.layerList.length < 2}
                            onClick={(event) => {
                                //向下一层
                                this.goDown();
                            }}>
                            <KeyboardArrowDownIcon/>
                        </IconButton>
                        <IconButton
                            disabled={this.state.selectedItem.length == 0 || this.state.layerList.length < 2}
                            onClick={(event) => {
                                //移动到最底层
                                this.goBottom();
                            }}>
                            <KeyboardDoubleArrowDownIcon/>
                        </IconButton>
                        <IconButton
                            disabled={this.state.selectedItem.length == 0}
                            onClick={(event) => {
                                //删除层
                                this.delLayer();
                            }}>
                            <DeleteIcon/>
                        </IconButton>
                    </div>}
                </Grid>
            </Grid>
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 300,
                }}
            >
                {this.state.layerList.map((item: _baseObj, index: number, array: any[]) => (
                    <ListItemButton style={{padding:5}}
                        key={`section-${index}`}
                        selected={this.state.selectedItem.indexOf(item) !== -1}
                        onClick={(event) => this.handleListItemClick(event, item)}
                    >
                        {
                            (item instanceof ImageObj) && <ImageIcon fontSize="small"/>
                        }
                        {
                            (item instanceof TextObj) && <TextFieldsIcon fontSize="small"/>
                        }
                        <ListItemText primary={`${item.layerName}`}/>
                    </ListItemButton>
                ))}
            </List>
        </>);
    }
}
