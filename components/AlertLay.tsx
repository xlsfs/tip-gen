import * as React from "react";
import styles from "../styles/Home.module.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Basic} from "../src/Basic";
import Button from "@mui/material/Button";
import {EventMgr} from "../src/manager/EventMgr";
import {EventEnum} from "../src/events/EventEnum";
import {ExcelMgr} from "../src/manager/ExcelMgr";

export default class AlertLay extends React.Component {

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
        if(ok) {
            let sheet = null;
            if(Basic.excelImportObj.sheetNo != -1) {
                sheet = ExcelMgr.getIns().openSheet(Basic.excelImportObj.sheetNo);
            } else if(Basic.excelImportObj.sheetName != "") {
                sheet = ExcelMgr.getIns().openSheet(Basic.excelImportObj.sheetName);
            }
            ExcelMgr.getIns().excelJs_worksheet = sheet;
            if (!ExcelMgr.getIns().excelJs_worksheet) {
                alert("?????????????????????,?????????");
                return;
            }
            if (Basic.excelImportObj.startLine > 0) {
            } else {
                alert("???????????????????????????,?????????");
                return;
            }
            if (Basic.excelImportObj.endLine > 0 && Basic.excelImportObj.endLine > Basic.excelImportObj.startLine) {
            } else {
                alert("???????????????????????????,?????????");
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
                            <p style={{margin: 0}}>?????????????????????</p>
                            <p></p>
                        </Grid>
                        <Grid item>
                            <p style={{margin: 0}}>?????????????????????1??????:</p>
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
                            <p style={{margin: 0}}>???????????????</p>
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
                            <p style={{margin: 0}}>???????????????</p>
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
                            }}>????????????</Button>
                            <Button variant="contained" size="small" style={{margin:10}} onClick={() => {
                                this.submitImportExcel(false);
                            }}>??????</Button>
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
                            <p style={{margin: 0}}>???????????????...</p>
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
                                    <th>????????????????????????</th>
                                    <td>{this.state.outImage_total}</td>
                                    <td>?????????</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>????????????</th>
                                    <td>{this.state.outImage_current}</td>
                                    <td>?????????</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>?????????</th>
                                    <td>{this.state.outImage_total-this.state.outImage_current}</td>
                                    <td>??????????????????</td>
                                </tr>
                                <tr style={{
                                    "alignItems": "center",
                                }}>
                                    <th>?????????</th>
                                    <th>{this.state.outImage_complete?"??????":"?????????"}</th>
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
                                    alert("??????????????????????????????");
                                }
                            }}>??????</Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>);
    }
}
