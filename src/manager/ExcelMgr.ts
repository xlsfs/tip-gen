import * as exceljs from "exceljs";
import * as sheetjs from "xlsx";

export class ExcelMgr {

    static _instance: ExcelMgr;
    static getIns():ExcelMgr {
        if (!ExcelMgr._instance) {
            ExcelMgr._instance = new ExcelMgr();
        }
        return ExcelMgr._instance;
    }

    static type:string = "exceljs";
    // static type:string = "sheetjs";

    excelJs_workbook:any = null;
    excelJs_worksheet:any = null;

    constructor() {

    }

    async openExcel(buffer:ArrayBuffer) {
        if(ExcelMgr.type == "exceljs") {
            this.excelJs_workbook = new exceljs.Workbook();
            // ExcelMgr.getIns().excelJs_workbook.calcProperties.fullCalcOnLoad = true;
            await this.excelJs_workbook.xlsx.load(buffer as ArrayBuffer);
        } else if(ExcelMgr.type == "sheetjs") {
            this.excelJs_workbook = sheetjs.read(buffer, {type:"array"});
        }
        console.log(this.excelJs_workbook);
    }

    openSheet(val:any) {
        let sheet:any = null;
        let sheetName = null;
        if(ExcelMgr.type == "exceljs") {
            sheet = this.excelJs_workbook.getWorksheet(val);
            if(sheet) {
                sheetName = sheet.name;
            }
        } else if(ExcelMgr.type == "sheetjs") {
            sheetName = this.excelJs_workbook.SheetNames[val];
            if(!!sheetName) {
                sheet = this.excelJs_workbook.Sheets[sheetName];
            } else {
                sheetName = val;
                sheet = this.excelJs_workbook.Sheets[sheetName];
            }
            if(sheet) {
                sheetName = sheetName;
            } else {
                sheetName = null;
            }
        }
        if(sheet) {
            return {
                sheet: sheet,
                sheetName: sheetName
            };
        }
        return null;
    }

    getWorkbook():any {
        return this.excelJs_workbook;
    }

    getWorksheet():any {
        return this.excelJs_worksheet.sheet;
    }

    getWorksheetName():string {
        if(ExcelMgr.type == "exceljs") {
            if (this.excelJs_worksheet) {
                return this.excelJs_worksheet.sheetName;
            }
        } else if(ExcelMgr.type == "sheetjs") {
            if (this.excelJs_worksheet) {
                return this.excelJs_worksheet;
            }
        }
        return "";
    }

}
