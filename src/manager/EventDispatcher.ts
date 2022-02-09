export class EventDispatcher {
    eventDict: { [key: string]: Array<{ func: Function, caller?: any, once?: boolean, args?: any }> } = {};

    constructor() {
        this.eventDict = {};
    }

    init() {
    }

    /**
     * 添加一个事件监听
     * @param {string} type
     * @param {Function} func
     * @param {Object} caller
     * @param {array} args
     * @param {boolean} once
     */
    add(type:string, func:Function, caller:any, args:any = null, once:boolean = false):boolean {
        let list = this.eventDict[type];
        if (!list) {
            list = this.eventDict[type] = [{func: func, caller: caller, once: once}];
        } else {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (!item) continue;
                if (item.func === func && item.caller === caller && item.once === once) {
                    return false;
                }
            }
            list.push({func: func, caller: caller, once: once, args: args});
        }
        return true;
    }

    /**
     * 执行过一次后直接删除
     * @param type
     * @param func
     * @param caller
     * @param args
     */
    addOnce(type, func, caller = null, args = null) {
        this.add(type, func, caller, args, true);
    }

    /**
     * 移除一个事件监听
     */
    remove(type:string, func:Function, caller:any, once:boolean = false) {
        let list = this.eventDict[type];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (!item) continue;
                if (item.func == func && item.caller == caller && item.once == once) {
                    item.func = null;
                    item.caller = null;
                    list[i] = null;
                    return;
                }
            }
        }
    }

    removeByCaller (type:string, caller:any) {
        let list = this.eventDict[type];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (!item) continue;
                if (item.caller == caller) {
                    item.func = null;
                    item.caller = null;
                    list[i] = null;
                    return;
                }
            }
        }
    }

    removeAll(type) {
        let list = this.eventDict[type];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                item.func = null;
                item.caller = null;
                item.args = null;
            }
            list.length = 0;
            this.eventDict[type] = null;
        }
    }

    dispatchEvent(type, param?) {// type:"",param:{}
        let list = this.eventDict[type];
        if (list) {
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                if (!item) continue;
                this.run(item, param)
                if (!!item.once) {
                    this.remove(type, item.func, item.caller, true);
                }
            }
        }
    }

    /**
     *
     * @param {{func:Function,caller:Object,once:boolean}} item
     * @param {array} param
     * @returns {null|*}
     */
    run(item, param) {
        let method = item.func;
        let caller = item.caller;
        let args = item.args;
        if (method == null) return null;
        var result;
        if (!param) {//没有参数直接调用回调
            result = method.apply(caller, args);
        } else if (!args && !param.unshift) {
            result = method.call(caller, param);
        } else if (args) {
            result = method.apply(caller, args.concat(param));
        } else {
            result = method.apply(caller, param);
        }
        return result;
    }

}
