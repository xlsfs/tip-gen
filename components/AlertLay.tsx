import * as React from "react";
import styles from "../styles/Home.module.css";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Basic} from "../src/Basic";
import Button from "@mui/material/Button";
import {EventMgr} from "../src/manager/EventMgr";
import {EventEnum} from "../src/events/EventEnum";

export default class AlertLay extends React.Component {

    state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            alertShow: false,
            importExcelShow: false,
        };

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow, () => {
            this.setAlertShow(true);
        }, Basic.EventObj_alert);

        EventMgr.getIns().removeByCaller(EventEnum.changeAlertShow_importExcel, Basic.EventObj_alert);
        EventMgr.getIns().add(EventEnum.changeAlertShow_importExcel, () => {
            this.setImportExcelShow(true);
        }, Basic.EventObj_alert);
    }

    setAlertShow(value: boolean) {
        this.setState({
            alertShow: value
        })
    }

    setImportExcelShow(value: boolean) {
        this.setState({
            importExcelShow: value
        })
    }

    submitImportExcel (ok:boolean) {
        if(ok) {
            if(Basic.excelImportObj.sheetNo != -1) {
                Basic.excel_worksheet = Basic.excel_workbook.getWorksheet(Basic.excelImportObj.sheetNo);

            } else if(Basic.excelImportObj.sheetName != "") {
                Basic.excel_worksheet = Basic.excel_workbook.getWorksheet(Basic.excelImportObj.sheetName);
            }
            if (!Basic.excel_worksheet) {
                alert("工作表编号错误,请确认");
                return;
            }
            if (Basic.excelImportObj.startLine > 0) {
            } else {
                alert("数据起始行编号错误,请确认");
                return;
            }
            if (Basic.excelImportObj.endLine > 0 && Basic.excelImportObj.endLine > Basic.excelImportObj.startLine) {
            } else {
                alert("数据结束行编号错误,请确认");
                return;
            }
            this.setAlertShow(false);
            this.setImportExcelShow(false);
        } else {
            Basic.excel_workbook = null;

            Basic.excelImportObj = {
                sheetNo: 1,
                sheetName: "",
                startLine: 2,
                endLine: 99999,
            };
            this.setAlertShow(false);
            this.setImportExcelShow(false);
        }
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
                            <p style={{margin: 0}}>确认导入数据表</p>
                            <p></p>
                        </Grid>
                        <Grid item>
                            <p style={{margin: 0}}>工作表编号，从1开始:</p>
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
                                    if(sheetNo+"" == _tmp) {
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
                            <p style={{margin: 0}}>数据起始行</p>
                        </Grid>
                        <Grid item>
                            <TextField
                                // id={PropertyTypeEnum.pos_x}
                                // value="2"
                                defaultValue="2"
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
                            <p style={{margin: 0}}>数据结束行</p>
                        </Grid>
                        <Grid item>
                            <TextField
                                // id={PropertyTypeEnum.pos_x}
                                // value="99999"
                                defaultValue="99999"
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
                            }}>确认导入</Button>
                            <Button variant="contained" size="small" style={{margin:10}} onClick={() => {
                                this.submitImportExcel(false);
                            }}>取消</Button>
                        </Grid>
                    </Grid>

                </div>
            </div>
        </>);
    }
}
