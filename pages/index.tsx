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
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import {ObjectMgr} from '../src/manager/ObjectMgr'
import LayerList from '../components/LayerList'
import PropertyList from '../components/PropertyList'
import {SceneControls} from "../src/manager/SceneControls";
import {Basic} from "../src/Basic";
import AlertLay from '../components/AlertLay';
import * as exceljs from "exceljs";
import * as sheetjs from "xlsx";
import {FontMgr} from "../src/manager/FontMgr";
import {useTranslation} from 'next-i18next/pages';
import {AppLocale, defaultLocale, getLocaleCookie, setLocaleCookie} from '../src/i18nConfig';

const Home: NextPage = () => {
    let verStr = "0.0.4";
    const {t, i18n} = useTranslation('common');
    const [locale, setLocale] = useState<AppLocale>(defaultLocale);

    useEffect(() => {
        let cookieLocale = getLocaleCookie();
        setLocale(cookieLocale);
        i18n.changeLanguage(cookieLocale);

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

                            let attribute = json.scene.attribute;//场景属性
                            let list = json.scene.list;//场景内的元素列表
                            if(!!attribute && !!list && list.length > 0) {
                                let sceneControls = SceneControls.getIns();
                                sceneControls.cleanScene();
                                sceneControls.setSave(attribute, list);
                            }
                        } else {
                            throw new Error(t("invalidJson"));
                        }
                    } catch (e) {
                        console.log(e);
                        alert(t("invalidFileFormat"));
                    }
                }

            }
            fileInput.value = null;
        });

        Main_draw.getIns().init();
    }, []);

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
            alert(t("emptyStage"));
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
            </Head>
            <div className={styles.div_svgContainer} id="svgContainer">

            </div>
            <AppBar
                position="fixed"
                color="inherit"
                elevation={0}
                className={styles.appBar}
            >
                <Toolbar variant="dense" className={styles.toolbar}>
                    <Typography variant="subtitle1" component="h1" className={styles.brand}>
                        tip gen
                    </Typography>
                    <Divider orientation="vertical" flexItem className={styles.toolbarDivider}/>
                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                        <input type="file" id="btn_openFile" style={{display: "none"}}
                               accept=".tgen"/>
                        <Button variant="contained" size="small" startIcon={<UploadFileIcon/>} onClick={() => {
                            let fileInput = document.getElementById("btn_openFile");
                            fileInput.click();
                        }}>{t("open")}</Button>
                        <Button variant="outlined" size="small" startIcon={<SaveIcon/>} onClick={() => {
                            saveFile();
                        }}>{t("save")}</Button>
                    </Box>
                    <Divider orientation="vertical" flexItem className={styles.toolbarDivider}/>
                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                        <input type="file" id="btn_loadImgFile" style={{display: "none"}}
                               accept="image/png, image/jpeg"/>
                        <Button variant="outlined" size="small" startIcon={<ImageIcon/>} onClick={() => {
                            let fileInput = document.getElementById("btn_loadImgFile");
                            fileInput.click();
                        }}>{t("loadImage")}</Button>
                        <Button variant="contained" size="small" startIcon={<TextFieldsIcon/>} onClick={() => {
                            createNewText();
                        }}>{t("newText")}</Button>
                    </Box>
                    <Box sx={{flex: 1}}/>
                    <ToggleButtonGroup
                        exclusive
                        size="small"
                        value={locale}
                        onChange={(event, nextLocale: string | null) => {
                            if (nextLocale == 'zh-CN' || nextLocale == 'en') {
                                setLocaleCookie(nextLocale);
                                setLocale(nextLocale);
                                i18n.changeLanguage(nextLocale);
                            }
                        }}
                    >
                        <ToggleButton value="zh-CN">{t("languageZh")}</ToggleButton>
                        <ToggleButton value="en">{t("languageEn")}</ToggleButton>
                    </ToggleButtonGroup>
                </Toolbar>
            </AppBar>

            <Box className={styles.sidebar}>
                <Paper elevation={6} className={styles.panel}>
                    <Typography variant="overline" className={styles.panelTitle}>
                        {t("properties")}
                    </Typography>
                    <PropertyList/>
                </Paper>
                <Paper elevation={6} className={styles.panel}>
                    <Typography variant="overline" className={styles.panelTitle} component="div">
                        {t("layers")}
                    </Typography>
                    <LayerList>
                    </LayerList>
                </Paper>
            </Box>

            <Paper elevation={3} className={styles.versionBadge}>
                v{verStr}
            </Paper>

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
