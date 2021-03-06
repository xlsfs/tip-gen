import type {NextPage} from 'next'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import * as React from 'react';
import {useEffect, useState} from 'react'
import {Main_draw} from '../src/Main_draw'
import {EventMgr} from '../src/manager/EventMgr'
import {EventEnum} from '../src/events/EventEnum'
import Button from '@mui/material/Button';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import {ObjectMgr} from '../src/manager/ObjectMgr'
import LayerList from '../components/LayerList'
import PropertyList from '../components/PropertyList'
import {SceneControls} from "../src/manager/SceneControls";
import {Basic} from "../src/Basic";
import AlertLay from '../components/AlertLay';
import * as exceljs from "exceljs";
import * as sheetjs from "xlsx";
import {FontMgr} from "../src/manager/FontMgr";

const Home: NextPage = () => {
    let verStr = "0.0.4";

    useEffect(() => {
        // @ts-ignore
        window.Basic = Basic;
        // @ts-ignore
        window.sceneControls = SceneControls.getIns();
        // @ts-ignore
        window.objectMgr = ObjectMgr.getIns();
        // @ts-ignore
        window.fontMgr = FontMgr.getIns();
        // @ts-ignore
        window.sheetjs = sheetjs;
        // @ts-ignore
        window.exceljs = exceljs;

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

        let fileInput = document.getElementById("btn_openFile") as HTMLInputElement;
        fileInput.addEventListener('change', (e: any) => {
            // console.log(e.target);
            if (e.target && e.target.files && e.target.files.length > 0) {
                let fileReader = new FileReader();
                let file = e.target.files[0];
                fileReader.readAsText(file);
                fileReader.onloadend = (evt: any) => {
                    if (evt.target.readyState !== FileReader.DONE) return;
                    // e.target.files[0].name
                    console.log(file.name);
                    // console.log(fileReader.result);
                    try {
                        let json = JSON.parse(fileReader.result as string);
                        if (json && json.scene) {

                            let attribute = json.scene.attribute;//????????????
                            let list = json.scene.list;//????????????????????????
                            if(!!attribute && !!list && list.length > 0) {
                                let sceneControls = SceneControls.getIns();
                                sceneControls.cleanScene();
                                sceneControls.setSave(attribute, list);
                            }
                        } else {
                            throw new Error("json????????????");
                        }
                    } catch (e) {
                        console.log(e);
                        alert("?????????????????????????????????");
                    }
                }

            }
            fileInput.value = null;
        });

        Main_draw.getIns().init();
    });

    let createNewText = () => {
        ObjectMgr.getIns().addText();
    };

    let saveFile = () => {
        if (ObjectMgr.getIns().objList.length > 0) {
            let out: any = {
                scene: SceneControls.getIns().getSave()
            };

            let MIME_TYPE = "text/plain";
            let url = window.URL.createObjectURL(new Blob([JSON.stringify(out, null,2)], {type: MIME_TYPE}));
            let dlLink = document.createElement('a');
            dlLink.download = SceneControls.getIns().sceneName + ".tgen";
            dlLink.href = url;
            dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

            document.body.appendChild(dlLink);
            dlLink.click();
            document.body.removeChild(dlLink);
        } else {
            alert("?????????????????????");
        }
    }

    // let layerListRef = React.createRef(); // ref={layerListRef}

    // layerListRef.addList();

    let slider_min = -100;
    let slider_max = 100;

    return (
        <div id="_main_">
            <Head>
                <title>tip gen</title>
                <meta name="description" content="tip gen"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"/>
                <link rel="icon" href="/favicon.ico"/>
                <link rel="stylesheet" href="/RobotoFont.css"/>
                <link rel="stylesheet" href="/RobotoIcon.css"/>
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
                        <input type="file" id="btn_openFile" style={{display: "none"}}
                               accept=".tgen"/>
                        <Button variant="contained" size="small" onClick={() => {
                            let fileInput = document.getElementById("btn_openFile");
                            fileInput.click();
                        }}>??????</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="small" onClick={() => {
                            saveFile();
                        }}>??????</Button>
                    </Grid>
                    <Grid item>
                    </Grid>
                    <Grid item>
                    </Grid>
                    <Grid item>
                    </Grid>


                    <Grid item>
                        <input type="file" id="btn_loadImgFile" style={{display: "none"}}
                               accept="image/png, image/jpeg"/>
                        <Button variant="contained" size="small" onClick={() => {
                            let fileInput = document.getElementById("btn_loadImgFile");
                            fileInput.click();
                        }}>????????????</Button>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="small" onClick={() => {
                            createNewText();
                        }}>????????????</Button>
                    </Grid>
                </Grid>
            </div>

            <div className={styles.container_right_top}>
                <div>
                    <span>??????</span>
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

            <div className={styles.container_left_bottom}>
                <div>
                    <span>v{verStr}</span>
                </div>
            </div>

            {/*<div className={styles.container_bottom}>*/}
            {/*    <Slider*/}
            {/*        defaultValue={0}*/}
            {/*        min={slider_min}*/}
            {/*        max={slider_max}*/}
            {/*        step={1}*/}
            {/*        size="small"*/}
            {/*        valueLabelDisplay="auto"*/}
            {/*        onChange={(event: Event, value: number | number[]) => {*/}
            {/*            if (typeof value === 'number') {*/}
            {/*                EventMgr.getIns().dispatchEvent(EventEnum.changeCameraZoom,*/}
            {/*                    [(value - slider_min) / (slider_max - slider_min)]);*/}
            {/*                //this.getPercent()*/}
            {/*            }*/}
            {/*        }}/>*/}
            {/*</div>*/}

            <AlertLay></AlertLay>

        </div>
    )
}


export default Home
