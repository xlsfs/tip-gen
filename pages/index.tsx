import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import * as React from 'react';
import { useEffect, useState } from 'react'
import { Main_draw } from '../src/Main_draw'
import { EventMgr } from '../src/manager/EventMgr'
import { EventEnum } from '../src/events/EventEnum'
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import { ObjectMgr } from '../src/manager/ObjectMgr'
import LayerList from '../components/LayerList'
import PropertyList from '../components/PropertyList'
import * as exceljs from 'exceljs';
import Canvg from 'canvg';
import {SceneControls} from "../src/manager/SceneControls";
import {Basic} from "../src/Basic";
import AlertLay from '../components/AlertLay';

const Home: NextPage = () => {

  useEffect(() => {
    // @ts-ignore
    window.Basic = Basic;
    // @ts-ignore
    window.sceneControls = SceneControls.getIns();
    // @ts-ignore
    window.objectMgr = ObjectMgr.getIns();
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });

    let imgFileInput = document.getElementById("btn_loadImgFile") as HTMLInputElement;
    imgFileInput.addEventListener('change', (e: any) => {
      // console.log(e.target);
      if (e.target && e.target.files && e.target.files.length > 0) {
        ObjectMgr.getIns().addImage(e.target.files[0]);
      }
      imgFileInput.value = null;
    });

    let xlsFileInput = document.getElementById("btn_loadExcelFile") as HTMLInputElement;
    xlsFileInput.addEventListener('change', (e: any) => {
      // console.log(e.target);
      if (e.target && e.target.files && e.target.files.length > 0) {
        EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow);
        // ObjectMgr.getIns().addImage(e.target.files[0]);
        let fileReader = new FileReader();
        let file = e.target.files[0];
        fileReader.readAsArrayBuffer(file);
        fileReader.onloadend = async (evt: any)=> {
          if (evt.target.readyState !== FileReader.DONE) return;
          // e.target.files[0].name
          Basic.excel_fileName = file.name;
          Basic.excel_workbook = new exceljs.Workbook();
          Basic.excel_workbook.calcProperties.fullCalcOnLoad = true;
          await Basic.excel_workbook.xlsx.load(fileReader.result as ArrayBuffer);
          console.log(Basic.excel_workbook);
          EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow_importExcel);
        }
      }
      xlsFileInput.value = null;
    });

    Main_draw.getIns().init();
  });

  let createNewText = () => {
    ObjectMgr.getIns().addText();
  };

  let outImage = async () => {
    if(!Basic.excel_workbook || !Basic.excel_worksheet) {
      alert("请先导入excel文件");
      return;
    }

    let sceneControls = SceneControls.getIns();
    let objectMgr = ObjectMgr.getIns();
    // html2canvas(SceneControls.getIns().view.node).then((canvas)=> {
    //   document.body.appendChild(canvas);
    // }).catch((err)=> {
    //   console.log(err);
    //   debugger;
    // });
    sceneControls.cleanAllSel();
    objectMgr.genOutData();

    let viewCopy = sceneControls.view.clone();

    viewCopy.attr({ xmlns: 'http://www.w3.org/2000/svg', version: '1.1' })
        .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink', 'http://www.w3.org/2000/xmlns/')
        .attr('xmlns:svgjs', 'http://svgjs.dev/svgjs', 'http://www.w3.org/2000/xmlns/')

    viewCopy.x(0);
    viewCopy.y(0);

    let nodeArr = objectMgr.findNode_text(viewCopy.node);
    console.log(nodeArr);
    let textNodeObj = [];
    for(let i = 0; i < nodeArr.length; i++) {
      let textNode = nodeArr[i] as any;
      let outData = objectMgr.getRealTextPlaceholder(textNode.innerHTML);
      // let needCell = [];
      // for(let j = 0; j < outData.length; j ++) {
      //   if(outData[j].type) {
      //     needCell.push(outData[j].val);
      //   }
      // }
      textNodeObj[i] = {node: textNode, data:outData};//, needCell: needCell};
      console.log(outData);
    }


    let worksheet = Basic.excel_worksheet;
    let totalLine = worksheet.rowCount;
    if(totalLine > Basic.excelImportObj.endLine) {
      totalLine = Basic.excelImportObj.endLine;
      if(totalLine < Basic.excelImportObj.startLine) {
        alert("导入的excel文件数据不足");
        return;
      }
    }
    for(let l = Basic.excelImportObj.startLine; l < totalLine; l++) {
      let row = worksheet.getRow(l);

      for(let i = 0; i < textNodeObj.length; i++) {
        let outData = textNodeObj[i];
        let textNode = outData.node;
        let data = outData.data;
        // let needCell = outData.needCell;
        textNode.innerHTML = objectMgr.getRealText(data, row);
      }
      await outImageLogic(viewCopy.node);
    }
  };


  let outImageLogic = async (viewCopy:SVGSVGElement) => {
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

      let v = await Canvg.from(ctx, viewCopy.outerHTML);

      await v.render();
      let MIME_TYPE = "image/png";
      let imgURL = canvas.toDataURL(MIME_TYPE);
      let dlLink = document.createElement('a');
      dlLink.download = "001.png";
      dlLink.href = imgURL;
      dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);

  };


  // let layerListRef = React.createRef(); // ref={layerListRef}

  // layerListRef.addList();

  let slider_min = -100;
  let slider_max = 100;

  return (
    <div id="_main_">
      <Head>
        <title>tip gen</title>
        <meta name="description" content="tip gen" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/RobotoFont.css" />
        <link rel="stylesheet" href="/RobotoIcon.css" />
      </Head>
      <div className={styles.div_svgContainer} id="svgContainer">

      </div>
      <div className={styles.container_top}>
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
            spacing={1}
            p={.5}
        >
          <Grid item>
            <input type="file" id="btn_loadExcelFile" style={{ display: "none" }}
                   accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
            <Button variant="contained" size="small" onClick={() => {
              let fileInput = document.getElementById("btn_loadExcelFile");
              fileInput.click();
            }}>载入数据表</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" size="small" onClick={() => {
              outImage();
            }}>输出图片</Button>
          </Grid>

        </Grid>
      </div>

      <div className={styles.container_left}>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
          p={1}
        >
          <Grid item>
            <input type="file" id="btn_loadImgFile" style={{ display: "none" }} accept="image/png, image/jpeg" />
            <Button variant="contained" size="small" onClick={() => {
              let fileInput = document.getElementById("btn_loadImgFile");
              fileInput.click();
            }}>加载图片</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" size="small" onClick={() => {
              createNewText();
            }}>新建文本</Button>
          </Grid>

        </Grid>
      </div>
      <div className={styles.container_right_top}>
        <div>
          <span>属性</span>
          <PropertyList/>
        </div>
      </div>
      <div className={styles.container_right_bottom}>
        <div>
          <LayerList>
          </LayerList>
        </div>
        <Grid
          container
          direction="column"
          justifyContent="flex-start"
          alignItems="flex-start"
          spacing={1}
          p={1}>
          <Grid item>

          </Grid>
        </Grid>
      </div>

      <div className={styles.container_bottom}>
        <Slider
          defaultValue={0}
          min={slider_min}
          max={slider_max}
          step={1}
          size="small"
          valueLabelDisplay="auto"
          onChange={(event: Event, value: number | number[]) => {
            if (typeof value === 'number') {
              EventMgr.getIns().dispatchEvent(EventEnum.changeCameraZoom,
                [(value - slider_min) / (slider_max - slider_min)]);
              //this.getPercent()
            }
          }} />
      </div>

      <AlertLay></AlertLay>

    </div>
  )
}


export default Home
