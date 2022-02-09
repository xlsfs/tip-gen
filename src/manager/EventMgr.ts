import {EventDispatcher} from "./EventDispatcher";

export class EventMgr {

    private static _instance:EventDispatcher = null;
    public static getIns ():EventDispatcher {
        if (!EventMgr._instance) {
            EventMgr._instance = new EventDispatcher();
        }
        return EventMgr._instance;
    }
}
