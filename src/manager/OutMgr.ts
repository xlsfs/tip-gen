import * as exceljs from "exceljs";
import {Basic} from "../Basic";
import Canvg from "canvg";
import {ObjectMgr} from "./ObjectMgr";
import {ExcelMgr} from "./ExcelMgr";
import {Svg} from "@svgdotjs/svg.js";
import JSZip from "jszip";
import {EventMgr} from "./EventMgr";
import {EventEnum} from "../events/EventEnum";
import {SceneControls} from "./SceneControls";

export class OutMgr {

    static async outImageLogic(viewCopy: Svg) {
        let objectMgr = ObjectMgr.getIns();

        let nodeArr = objectMgr.findNode_text(viewCopy.node);
        console.log(nodeArr);
        let textNodeObj = [];
        for (let i = 0; i < nodeArr.length; i++) {
            let textNode = nodeArr[i] as any;
            let outData = objectMgr.getRealTextPlaceholder(textNode.innerHTML);
            if (!outData || outData.length == 0) {
                debugger;
                outData = objectMgr.getRealTextPlaceholder(textNode.innerHTML);
            }
            // let needCell = [];
            // for(let j = 0; j < outData.length; j ++) {
            //   if(outData[j].type) {
            //     needCell.push(outData[j].val);
            //   }
            // }
            textNodeObj[i] = {node: textNode, data: outData};//, needCell: needCell};
            console.log(outData);
        }


        let worksheet = ExcelMgr.getIns().getWorksheet();
        let endLine = worksheet.rowCount;
        if (endLine > Basic.excelImportObj.endLine) {
            endLine = Basic.excelImportObj.endLine;
            if (endLine < Basic.excelImportObj.startLine) {
                alert("导入的excel文件数据不足");
                return;
            }
        }

        let startLine = Basic.excelImportObj.startLine;

        Basic.outImageProgress = {
            total: endLine - startLine + 1,
            current: 0,
            zipList: [] as any[],
            complete: false,
        };

        EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow);
        EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow_outImage);

        let outFileNameData = ObjectMgr.getIns().getRealTextPlaceholder(Basic.excelImportObj.outFileName);
        if (!Basic.outCanvas) {
            Basic.outCanvas = document.createElement('canvas');
        }
        document.body.appendChild(Basic.outCanvas);

        let nameObj = {};
        let getNewZip = (start:number) => {
            return {
                zip: new JSZip(), count: 0, start: start, end: 0, nameObj: nameObj
            }
        };
        let zipPackLimit = Basic.zipPackLimit;
        let zipObj;
        if (Basic.zipMode) {
            zipObj = getNewZip(startLine);
        }
        let l = startLine;
        for (; l <= endLine; l++) {
            let row = worksheet.getRow(l);

            for (let i = 0; i < textNodeObj.length; i++) {
                let outData = textNodeObj[i];
                let textNode = outData.node;
                let data = outData.data;

                // let needCell = outData.needCell;
                textNode.innerHTML = objectMgr.getRealText(data, row);
            }
            if (Basic.zipMode) {
                if (zipObj.count >= zipPackLimit) {
                    // zip 下载
                    zipObj.end = l - 1;

                    await OutMgr.downloadZip(zipObj.zip,
                        SceneControls.getIns().sceneName + "_" + zipObj.start + "_" + zipObj.end + ".zip"
                    );

                    zipObj = getNewZip(l);
                } else {

                }
                await OutMgr.outImageLogic_zip(viewCopy.node, outFileNameData, row, l, zipObj);
            } else {
                await OutMgr.outImageLogic_png(viewCopy.node, outFileNameData, row);
            }
            Basic.outImageProgress.current++;
            EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow_outImage_progress);
        }
        Basic.outCanvas.remove();
        if (Basic.zipMode) {
            if(zipObj.count > 0) {
                zipObj.end = l - 1;
                await OutMgr.downloadZip(zipObj.zip,
                    SceneControls.getIns().sceneName + "_" + zipObj.start + "_" + zipObj.end + ".zip"
                );
            } else {
                // zipObj.zip.end();
            }
            zipObj.zip = null;
            zipObj = null;
            Basic.outImageProgress.complete = true;
            EventMgr.getIns().dispatchEvent(EventEnum.changeAlertShow_outImage_progress);
            alert("已完成共");
        }

    }
    static _aElement_ = document.createElement('a');

    static async outImageLogic_png(viewCopy: SVGSVGElement, outFileNameData: any, row: exceljs.Row) {
        let canvas = Basic.outCanvas;
        let ctx = canvas.getContext('2d');

        let v = await Canvg.from(ctx, viewCopy.outerHTML);

        await v.render();

        let MIME_TYPE = "image/png";
        let imgURL = canvas.toDataURL(MIME_TYPE);

        let downloadName = ObjectMgr.getIns().getRealText(outFileNameData, row);

        OutMgr.downloadURL(imgURL, downloadName + ".png", MIME_TYPE);

    }

    static async outImageLogic_zip(viewCopy: SVGSVGElement,
                                   outFileNameData: any,
                                   row: exceljs.Row,
                                   rowNum: number,
                                   zipObj: { zip: JSZip, count: number, start: number, end: number, nameObj: any }) {
        let canvas = Basic.outCanvas;
        let ctx = canvas.getContext('2d');

        let v = await Canvg.from(ctx, viewCopy.outerHTML);

        await v.render();
        let downloadName = ObjectMgr.getIns().getRealText(outFileNameData, row);
        if(zipObj.nameObj[downloadName]) {
            downloadName = downloadName + "(" + rowNum+")";
            let newName = downloadName;
            let sameIdx = 0;
            while(!!zipObj.nameObj[newName]) {
                newName = downloadName + "_" + sameIdx;
                sameIdx++;
            }
            downloadName = newName;
        }
        zipObj.nameObj[downloadName] = true;
        let outArrayBuffer = await OutMgr.getPngBytes(canvas) as ArrayBuffer;

        zipObj.zip.file(downloadName + ".png", outArrayBuffer, {binary:true});
        // let nonStreamingFile = new fflate.ZipPassThrough();
        // zipObj.zip.add(nonStreamingFile);
        // nonStreamingFile.push(new Uint8Array(outArrayBuffer));
        zipObj.count++;
    }

    static async downloadZip(zip:JSZip, fileName:string) {
        console.log("downloadZip");
        let zipData = await OutMgr.saveZip(zip) as Blob;
        let MIME_TYPE = "application/octet-stream";
        let zipBlob = zipData;//new Blob([zipData], {type: MIME_TYPE});
        let zipURL = window.URL.createObjectURL(zipBlob);
        OutMgr.downloadURL(zipURL, fileName, MIME_TYPE);
    }

    static downloadURL (url:string, fileName:string, mimeType:string) {
        console.log("downloadURL");
        let dlLink = OutMgr._aElement_;

        dlLink.download = fileName;
        dlLink.href = url;
        dlLink.dataset.downloadurl = [mimeType, dlLink.download, dlLink.href].join(':');

        document.body.appendChild(dlLink);
        dlLink.click();
        dlLink.remove();
    }
    static async saveZip(zip:JSZip) {
        return new Promise((resolve, reject) => {
            zip.generateAsync({type:"blob"}).then(function(content:Blob) {
                resolve(content);
            }).catch(function(err) {
                reject(err);
            });
        });
    }

    static async getPngBytes(canvas: HTMLCanvasElement) {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.addEventListener('loadend', () => {
                if (fileReader.error) {
                    reject(fileReader.error);
                } else {
                    resolve(fileReader.result);
                }
            });

            let MIME_TYPE = "image/png";
            canvas.toBlob(blob => fileReader.readAsArrayBuffer(blob), MIME_TYPE)
        });
    }

}
