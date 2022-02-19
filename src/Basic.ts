import * as exceljs from "exceljs";

export class Basic {
    static scale = 3.43;

    // static DEFAULT_UNIT_IN_METERS = 1; // 以米为单位
    // static DEFAULT_UNIT_IN_DECIMETER = 0.1; // 以分米为单位
    // static DEFAULT_UNIT_IN_CENTIMETERS = 0.01; // 以厘米为单位
    // static DEFAULT_UNIT_IN_MILLIMETERS = 0.001; // 以毫米为单位
    static DEFAULT_UNIT_LENGTH_c = 0.01 / Basic.scale; // 当前程序的单位长度（厘米除）
    static DEFAULT_UNIT_LENGTH_m = Basic.DEFAULT_UNIT_LENGTH_c * 10; // 当前程序的单位长度（毫米除）
    static DEFAULT_UNIT_LENGTH_p = Basic.DEFAULT_UNIT_LENGTH_c * 72; // 当前程序的单位长度（像素除）
    static DEFAULT_UNIT_PRECISION = 0.001 / Basic.DEFAULT_UNIT_LENGTH_c; // 程序精度，当前程序精确到1毫米

    static DEFAULT_EDGES_THRESHOLD_ANGLE = 30;
    static COLOR_NORMAL_WIREFRAME_BOX = 0xffffff;
    static COLOR_HOVERON_WIREFRAME_BOX = 0x00b0f0;
    static COLOR_SELECTED_WIREFRAME_BOX = 0x1668FD;

    static DEFAULT_WIREFRAME_LINE_WIDTH = 3 * Basic.DEFAULT_UNIT_LENGTH_c; // in pixels

    static EventObj_LayerList = {};
    static EventObj_resetSelectList = {};
    static EventObj_fontList = {};
    static EventObj_alert = {};

    static get defaultStartLine () {
        return 2;
    }
    static get defaultEndLine () {
        return 99999;
    }
    static excel_fileName = "";
    static excel_workbook:exceljs.Workbook = null;
    static excel_worksheet:exceljs.Worksheet = null;
    static excelImportObj = {
        sheetNo: 1,
        sheetName: "",
        startLine: Basic.defaultStartLine,
        endLine: Basic.defaultEndLine,
    };

}
