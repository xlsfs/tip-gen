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

const Home: NextPage = () => {
  useEffect(() => {
    document.addEventListener('gesturestart', function (event) {
      event.preventDefault();
    });

    let fileInput = document.getElementById("btn_loadImgFile") as HTMLInputElement;
    fileInput.addEventListener('change', (e: any) => {
      console.log(e.target);
      if (e.target && e.target.files && e.target.files.length > 0) {
        ObjectMgr.getIns().addImage(e.target.files[0]);
      }
      fileInput.value = null;
    });

    Main_draw.getIns().init();
  });
  let createNewText = () => {
    ObjectMgr.getIns().addText();
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
          <PropertyList></PropertyList>
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
    </div>
  )
}


export default Home
