import * as React from 'react';
import { useRef, useState } from 'react'
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { EventMgr } from '../src/manager/EventMgr';
import { EventEnum } from '../src/events/EventEnum';
import { ObjectMgr } from '../src/manager/ObjectMgr';
import { _baseObj } from '../src/object/_baseObj';
import { Basic } from '../src/Basic';
import { SceneControls } from '../src/manager/SceneControls';
import { TextObj } from '../src/object/TextObj';
import { ImageObj } from '../src/object/ImageObj';

// export default function LayerList(props: any) {
export default class LayerList extends React.Component {

  handleListItemClick:Function;
  state:any;
  constructor(props: any) {
    super(props);
    
    this.state = {
      layerList: [...ObjectMgr.getIns().objList],
      selectedItem: [...SceneControls.getIns().selected],
    };
    
    // const [layerList, setLayerList] = React.useState([...ObjectMgr.getIns().objList]);
    // const [selectedIndex, setSelectedIndex] = React.useState(null);

    this.handleListItemClick = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      item: any,
    ) => {
      this.setState({ selectedItem: [item] });
      EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_layer2scene, [[item]]);
      // setSelectedIndex(item);
    };
    EventMgr.getIns().removeByCaller(EventEnum.resetLayerList, Basic.EventObj_LayerList);
    EventMgr.getIns().add(EventEnum.resetLayerList, () => {
      this.setState({ layerList: [...ObjectMgr.getIns().objList] });
      // setLayerList([...ObjectMgr.getIns().objList]);
    }, Basic.EventObj_LayerList);
    
    EventMgr.getIns().removeByCaller(EventEnum.resetSelectList_scene2layout, Basic.EventObj_LayerList);
    EventMgr.getIns().add(EventEnum.resetSelectList_scene2layout, () => {
      this.setState({ selectedItem: [...SceneControls.getIns().selected] });
      // setLayerList([...ObjectMgr.getIns().objList]);
    }, Basic.EventObj_LayerList);
  }

  render() {
    return (
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
          <ListItemButton
            key={`section-${index}`}
            selected={this.state.selectedItem.indexOf(item) !== -1}
            onClick={(event) => this.handleListItemClick(event, item)}
          >
            {
              (item instanceof ImageObj) && <ImageIcon />
            }
            {
              (item instanceof TextObj) && <TextFieldsIcon />
            }
            <ListItemText primary={`${item.layerName}`} />
          </ListItemButton>
        ))}
      </List>
    );
  }
}
