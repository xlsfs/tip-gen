import * as React from "react";
import styles from "../styles/Home.module.css";
import Grid from "./MuiGridCompat";
import TextField from "@mui/material/TextField";
import {Basic} from "../src/Basic";
import Button from "@mui/material/Button";
import {EventMgr} from "../src/manager/EventMgr";
import {EventEnum} from "../src/events/EventEnum";
import {ExcelMgr} from "../src/manager/ExcelMgr";
import {withTranslation} from "next-i18next/pages";
import type {WithTranslation} from "react-i18next";

class AlertLay extends React.Component<WithTranslation> {

    state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            alertShow: false,
            importExcelShow: false,
            outImageShow: false,

            outImage_total: 0,
            outImage_current: 0,
            outImage_complete: false,
        };

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow, () => {
            this.setAlertShow(true);
        }, Basic.EventObj_alert);

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow_importExcel, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow_importExcel, () => {
            this.setImportExcelShow(true);
        }, Basic.EventObj_alert);

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow_outImage, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow_outImage, () => {
            this.setOutImageShow(true);
        }, Basic.EventObj_alert);

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow_outImage_progress, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow_outImage_progress, () => {
            this.setState({
                outImage_total: Basic.outImageProgress.total,
                outImage_current: Basic.outImageProgress.current,
                outImage_complete: Basic.outImageProgress.complete,
            });
        }, Basic.EventObj_alert);
    }

    setAlertShow(value: boolean) {
        this.setState({
            alertShow: value
        });
        if(value) {
            this.setState({
                importExcelShow: false,
                outImageShow: false
            });

        }
    }

    setImportExcelShow(value: boolean) {
        this.setState({
            importExcelShow: value,
            outImageShow: !value
        });
        if(value) {
            this.setState({
                outImageShow: false
            });
        }
    }

    setOutImageShow(value: boolean) {
        this.setState({
            outImageShow: value
        })
        if(value) {
            this.setState({
                importExcelShow: false
            });
        }
    }

    submitImportExcel (ok:boolean) {
        const {t} = this.props;

        if(ok) {
            let sheet = null;
            if(Basic.excelImportObj.sheetNo != -1) {
                sheet = ExcelMgr.getIns().openSheet(Basic.excelImportObj.sheetNo);
            } else if(Basic.excelImportObj.sheetName != "") {
                sheet = ExcelMgr.getIns().openSheet(Basic.excelImportObj.sheetName);
            }
            ExcelMgr.getIns().excelJs_worksheet = sheet;
            if (!ExcelMgr.getIns().excelJs_worksheet) {
                alert(t("worksheetNumberError"));
                return;
            }
            if (Basic.excelImportObj.startLine > 0) {
            } else {
                alert(t("startLineError"));
                return;
            }
            if (Basic.excelImportObj.endLine > 0 && Basic.excelImportObj.endLine > Basic.excelImportObj.startLine) {
            } else {
                alert(t("endLineError"));
                return;
            }
            this.setAlertShow(false);
            this.setImportExcelShow(false);
            EventMgr.getIns().dispatchEvent(EventEnum.resetSelectList_scene2layout);
        } else {
            Basic.excel_fileName = "";
            ExcelMgr.getIns().excelJs_workbook = null;

            Basic.excelImportObj = {
                sheetNo: 1,
                sheetName: "",
                startLine: Basic.defaultStartLine,
                endLine: Basic.defaultEndLine,
                outFileName: Basic.defaultOutFileName,
            };
            this.setAlertShow(false);
            this.setImportExcelShow(false);
        }
    }

    submitOutImage (ok:boolean) {
        this.setAlertShow(false);
        this.setOutImageShow(false);
    }

    render() {
        const {t} = this.props;

        return (<>

            <div className={this.state.alertShow?styles.alert_container_show:styles.alert_container_hide}>
                <div className={this.state.importExcelShow?styles.alert_importExcel_show:styles.alert_importExcel_hide}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                        p={1}>
                        <Grid item>
                            <p style={{margin: 0}}>{t("importExcelConfirmTitle")}</p>
                            <p></p>
                        </Grid>
                        <Grid item>
                            <p style={{margin: 0}}>{t("worksheetNumberPrompt")}</p>
                        </Grid>
                        <Grid item>
                            <TextField
                                // id={PropertyTypeEnum.pos_x}
                                // value="1"
                                defaultValue="1"
                                hiddenLabel
                                size="small"
                                variant="standard"
                                onChange={(event) => {
                                    let _tmp = event.target.value;
                                    let sheetNo = parseInt(_tmp);
                                    if (sheetNo + "" == _tmp && sheetNo >= 1) {
                                        Basic.excelImportObj.sheetNo = sheetNo;
                                        Basic.excelImportObj.sheetName = "";
                                    } else {
                                        Basic.excelImportObj.sheetNo = -1;
                                        Basic.excelImportObj.sheetName = _tmp;
                                    }
                                    // this.onTextHandleChange(event.target, PropertyTypeEnum.pos_x);
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <p style={{margin: 0}}>{t("startLine")}</p>
                        </Grid>
                        <Grid item>
                            <TextField
                                // id={PropertyTypeEnum.pos_x}
                                // value="2"
                                defaultValue={Basic.defaultStartLine}
                                hiddenLabel
                                size="small"
                                variant="standard"
                                onChange={(event) => {
                                    let sl = parseInt(event.target.value);
                                    Basic.excelImportObj.startLine = sl;
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <p style={{margin: 0}}>{t("endLine")}</p>
                        </Grid>
                        <Grid item>
                            <TextField
                                // id={PropertyTypeEnum.pos_x}
                                // value="99999"
                                defaultValue={Basic.defaultEndLine}
                                hiddenLabel
                                size="small"
                                variant="standard"
                                onChange={(event) => {
                                    let el = parseInt(event.target.value);
                                    Basic.excelImportObj.endLine = el;
                                    // this.onTextHandleChange(event.target, PropertyTypeEnum.pos_x);
                                }}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="small" style={{margin:10}} onClick={() => {
                                this.submitImportExcel(true);
                            }}>{t("confirmImport")}</Button>
                            <Button variant="contained" size="small" style={{margin:10}} onClick={() => {
                                this.submitImportExcel(false);
                            }}>{t("cancel")}</Button>
                        </Grid>
                    </Grid>

                </div>
                <div className={this.state.outImageShow?styles.alert_importExcel_show:styles.alert_importExcel_hide}>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={1}
                        p={1}>
                        <Grid item>
                            <p style={{margin: 0}}>{t("exportingImages")}</p>
                            <p></p>
                        </Grid>
                        <Grid item>
                            <table style={{
                                "borderCollapse": "collapse",
                                "border":"1px solid #ccc",
                            }}>
                                <tbody>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>{t("totalToProcess")}</th>
                                    <td>{this.state.outImage_total}</td>
                                    <td>{t("records")}</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>{t("processed")}</th>
                                    <td>{this.state.outImage_current}</td>
                                    <td>{t("records")}</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>{t("remaining")}</th>
                                    <td>{this.state.outImage_total-this.state.outImage_current}</td>
                                    <td>{t("recordsPending")}</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>{t("status")}</th>
                                    <th>{this.state.outImage_complete?t("complete"):t("processing")}</th>
                                    <th></th>
                                </tr>
                                </tbody>
                            </table>
                            <p></p>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" size="small" style={{margin:10}} onClick={() => {
                                if(this.state.outImage_complete) {
                                    this.submitOutImage(false);
                                } else {
                                    alert(t("waitForExport"));
                                }
                            }}>{t("close")}</Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>);
    }
}

export default withTranslation('common')(AlertLay);
