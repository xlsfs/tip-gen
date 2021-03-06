import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {PropertyTypeEnum} from "../../src/PropertyTypeEnum";
import Button from "@mui/material/Button";
import {Basic} from "../../src/Basic";
import {ExcelMgr} from "../../src/manager/ExcelMgr";
import * as React from "react";
import {SceneControls} from "../../src/manager/SceneControls";
import {ObjectMgr} from "../../src/manager/ObjectMgr";
import * as exceljs from "exceljs";
import Canvg from "canvg";
import {OutMgr} from "../../src/manager/OutMgr";
import {EventMgr} from "../../src/manager/EventMgr";
import {EventEnum} from "../../src/events/EventEnum";

export default function PropertyItem_scene() {
    const [prop_scene_name, setProp_scene_name] = React.useState(SceneControls.getIns().sceneName);

    const [prop_scene_width, setProp_scene_width] = React.useState(SceneControls.getIns().view_width);
    const [prop_scene_height, setProp_scene_height] = React.useState(SceneControls.getIns().view_height);

    const [prop_out_excel_fileName, setProp_out_excel_fileName] = React.useState(Basic.excel_fileName);
    const [prop_out_excel_sheet, setProp_out_excel_sheet] = React.useState(ExcelMgr.getIns().getWorksheetName());
    const [prop_out_excel_sheetName, setProp_out_excel_sheetName] = React.useState(
        (Basic.excelImportObj.sheetNo >= 1 ? Basic.excelImportObj.sheetNo : Basic.excelImportObj.sheetName)+"");
    const [prop_out_excel_startLine, setProp_out_excel_startLine] = React.useState(Basic.excelImportObj.startLine);
    const [prop_out_excel_endLine, setProp_out_excel_endLine] = React.useState(Basic.excelImportObj.endLine);

    const [prop_out_file_name, setProp_out_file_name] = React.useState(Basic.excelImportObj.outFileName);

    let onSceneTextHandleChange = (textItem: any, type: string) => {
        if (type == PropertyTypeEnum.scene_name) {
            let name = textItem.value;
            if(!!name) {
                SceneControls.getIns().sceneName = name;
                setProp_scene_name(SceneControls.getIns().sceneName);
            }
        } else if (type == PropertyTypeEnum.scene_width) {
            let sceneWidth = parseInt(textItem.value);
            if(sceneWidth > 1) {
            } else {
                sceneWidth = 1;
            }
            setProp_scene_width(sceneWidth);
            SceneControls.getIns().view_width = sceneWidth;
        } else if (type == PropertyTypeEnum.scene_height) {
            let sceneHeight = parseInt(textItem.value);
            if(sceneHeight > 1) {
            } else {
                sceneHeight = 1;
            }
            setProp_scene_height(sceneHeight);
            SceneControls.getIns().view_height = sceneHeight;
        } else if (type == PropertyTypeEnum.out_excel_sheet) {
            let tmp_worksheet;
            let sheetNo = parseInt(textItem.value);
            if(sheetNo + "" == textItem.value && sheetNo >= 1) {
                tmp_worksheet = ExcelMgr.getIns().openSheet(sheetNo);
                if(tmp_worksheet) {
                    Basic.excelImportObj.sheetNo = sheetNo;
                    Basic.excelImportObj.sheetName = "";
                    ExcelMgr.getIns().excelJs_worksheet = tmp_worksheet;
                    setProp_out_excel_sheet(sheetNo as any);
                    setProp_out_excel_sheetName(tmp_worksheet.sheetName);
                }
            } else {
                tmp_worksheet = ExcelMgr.getIns().openSheet(textItem.value);
                if(tmp_worksheet) {
                    Basic.excelImportObj.sheetNo = -1;
                    Basic.excelImportObj.sheetName = textItem.value;
                    ExcelMgr.getIns().excelJs_worksheet = tmp_worksheet;
                    setProp_out_excel_sheet(textItem.value);
                    setProp_out_excel_sheetName(tmp_worksheet.sheetName);
                }
            }
        } else if (type == PropertyTypeEnum.out_excel_startLine) {
            let startLine = parseInt(textItem.value);
            if(startLine >= 1 && startLine <= Basic.excelImportObj.endLine) {
            } else {
                startLine = 1;
            }
            setProp_out_excel_startLine(startLine);
            Basic.excelImportObj.startLine = startLine;
        } else if (type == PropertyTypeEnum.out_excel_endLine) {
            let endLine = parseInt(textItem.value);
            if(endLine>=1 && endLine >= Basic.excelImportObj.startLine) {
            } else {
                endLine = Basic.excelImportObj.startLine;
            }
            setProp_out_excel_endLine(endLine);
            Basic.excelImportObj.endLine = endLine;
        } else if (type == PropertyTypeEnum.out_file_name) {
            let outFileName = textItem.value;
            if(!!outFileName) {
                setProp_out_file_name(outFileName);
                Basic.excelImportObj.outFileName = outFileName;
            }

        }
    };

    let outImage = async () => {

        if (!ExcelMgr.getIns().excelJs_workbook || !ExcelMgr.getIns().excelJs_worksheet) {
            alert("????????????excel??????");
            return;
        }


        let r = confirm("?????????????????????????????????????????? ???" + Basic.excelImportObj.outFileName+"???");
        if (r == true) {
        } else {
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

        let viewCopy = sceneControls.view.clone();

        viewCopy.attr({xmlns: 'http://www.w3.org/2000/svg', version: '1.1'})
            .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink', 'http://www.w3.org/2000/xmlns/')
            .attr('xmlns:svgjs', 'http://svgjs.dev/svgjs', 'http://www.w3.org/2000/xmlns/')

        viewCopy.x(0);
        viewCopy.y(0);

        await OutMgr.outImageLogic(viewCopy);

    };

    let changeSelProperty = () => {
        let objects = SceneControls.getIns().selected;
        if (objects.length > 0) {
        } else {
            let tmpSceneName = SceneControls.getIns().sceneName;
            if(prop_scene_name != tmpSceneName) {
                setProp_scene_name(tmpSceneName);
            }

            let tmpViewWidth = SceneControls.getIns().view_width;
            if(prop_scene_width != tmpViewWidth) {
                setProp_scene_width(tmpViewWidth);
            }
            let tmpViewHeight = SceneControls.getIns().view_height;
            if(prop_scene_height != tmpViewHeight) {
                setProp_scene_height(tmpViewHeight);
            }

            let tmpFileName = Basic.excel_fileName;
            if(prop_out_excel_fileName != tmpFileName) {
                setProp_out_excel_fileName(tmpFileName);
            }
            let tmpOutExcelSheet = "";
            if(Basic.excelImportObj.sheetNo >= 1) {
                tmpOutExcelSheet += Basic.excelImportObj.sheetNo;
            } else {
                tmpOutExcelSheet += Basic.excelImportObj.sheetName;
            }
            if(prop_out_excel_sheet != tmpOutExcelSheet) {
                setProp_out_excel_sheet(tmpOutExcelSheet);
            }
            let tmpOutExcelSheetName= ExcelMgr.getIns().getWorksheetName();
            if(prop_out_excel_sheetName != tmpOutExcelSheetName) {
                setProp_out_excel_sheetName(tmpOutExcelSheetName);
            }
            let tmpOutExcelStartLine = Basic.excelImportObj.startLine;
            if(prop_out_excel_startLine != tmpOutExcelStartLine) {
                setProp_out_excel_startLine(tmpOutExcelStartLine);
            }
            let tmpOutExcelEndLine = Basic.excelImportObj.endLine;
            if(prop_out_excel_endLine != tmpOutExcelEndLine) {
                setProp_out_excel_endLine(tmpOutExcelEndLine);
            }

            let tmpOutFileName = Basic.excelImportObj.outFileName;
            if(prop_out_file_name != tmpOutFileName) {
                setProp_out_file_name(tmpOutFileName);
            }
        }
    }

    setTimeout(()=>{
        changeSelProperty();
    },100);

    return (<Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
        p={1}>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.scene_name}
                value={prop_scene_name}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>??????:</span>
                    )
                }}
                onChange={(event) => {
                    onSceneTextHandleChange(event.target, PropertyTypeEnum.scene_name);
                }}
            />
        </Grid>
        <Grid item>
            <p style={{margin:0}}>????????????(??????)</p>
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.scene_width}
                value={prop_scene_width}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>???:</span>
                    )
                }}
                onChange={(event) => {
                    onSceneTextHandleChange(event.target, PropertyTypeEnum.scene_width);
                }}
            />
        </Grid>
        <Grid item>
            <TextField
                id={PropertyTypeEnum.scene_height}
                value={prop_scene_height}
                hiddenLabel
                size="small"
                variant="standard"
                InputProps={{
                    startAdornment: (
                        <span style={{width: "100px"}}>???:</span>
                    )
                }}
                onChange={(event) => {
                    onSceneTextHandleChange(event.target, PropertyTypeEnum.scene_height);
                }}
            />
        </Grid>
        <Grid item>
            <input type="file" id="btn_loadExcelFile" style={{display: "none"}}
                   accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>
            <Button variant="contained" size="small" onClick={() => {
                let xlsFileInput = document.getElementById("btn_loadExcelFile") as HTMLInputElement;
                if(xlsFileInput) {
                    xlsFileInput.addEventListener('change', Basic.onChangeXlsFileInput);
                    xlsFileInput.click();
                }
            }}>???????????????</Button>
        </Grid>
        <Grid item>
            <p style={{margin:0}}>Excel????????????</p>
        </Grid>

        {(!ExcelMgr.getIns().excelJs_workbook || !ExcelMgr.getIns().excelJs_worksheet) && (
            <Grid item><p style={{margin:2}}>?????????Excel??????</p></Grid>
        )}

        {(ExcelMgr.getIns().excelJs_workbook && ExcelMgr.getIns().excelJs_worksheet) && (<>
            <Grid item>
                <p style={{margin:0}}>
                    ?????????: {prop_out_excel_fileName}
                    <br/>
                    ?????????: {prop_out_excel_sheetName}
                </p>
            </Grid>
            <Grid item>
                <p style={{margin: 0}}>?????????????????????1??????</p>
            </Grid>
            <Grid item>
                <TextField
                    id={PropertyTypeEnum.out_excel_sheet}
                    value={prop_out_excel_sheet}
                    hiddenLabel
                    size="small"
                    variant="standard"
                    onChange={(event) => {
                        onSceneTextHandleChange(event.target, PropertyTypeEnum.out_excel_sheet);
                    }}
                />
            </Grid>
            <Grid item>
                <p style={{margin: 0}}>???????????????</p>
            </Grid>
            <Grid item>
                <TextField
                    id={PropertyTypeEnum.out_excel_startLine}
                    value={prop_out_excel_startLine}
                    hiddenLabel
                    size="small"
                    variant="standard"
                    onChange={(event) => {
                        onSceneTextHandleChange(event.target, PropertyTypeEnum.out_excel_startLine);
                    }}
                />
            </Grid>
            <Grid item>
                <p style={{margin: 0}}>???????????????</p>
            </Grid>
            <Grid item>
                <TextField
                    id={PropertyTypeEnum.out_excel_endLine}
                    value={prop_out_excel_endLine}
                    hiddenLabel
                    size="small"
                    variant="standard"
                    onChange={(event) => {
                        onSceneTextHandleChange(event.target, PropertyTypeEnum.out_excel_endLine);
                    }}
                />
            </Grid>
            <Grid item>
                <p style={{margin: 0}}><br/>???????????????</p>
            </Grid>
            <Grid item>
                <TextField
                    id={PropertyTypeEnum.out_file_name}
                    value={prop_out_file_name}
                    hiddenLabel
                    size="small"
                    variant="standard"
                    onChange={(event) => {
                        onSceneTextHandleChange(event.target, PropertyTypeEnum.out_file_name);
                    }}
                />
            </Grid>
            <Grid item>
                <Button variant="contained" size="small" onClick={() => {
                    outImage();
                }}>????????????</Button>
            </Grid>
        </>)}
    </Grid>)
}
