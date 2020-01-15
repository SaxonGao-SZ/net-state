import StaticState from './static-state';
import StateChange from './state-change';
export default class NetState {
    constructor(def, handler) {
        // 如果使用了 handler 参数，那么它必需是 function 类型
        if (handler && typeof handler !== 'function') {
            throw new Error('param 1 , is not a function');
        }
        this._initMembers();
        this._online = false;
        if (typeof def=== 'boolean') {
            this._online = def;
        }
        this._onReady = handler; 
        this._static = new StaticState(this._ready.bind(this));
        this._stateChange = new StateChange();
        this._stateChange.onOnLine = this._onOnline.bind(this);
        this._stateChange.onOffLine = this._onOffline.bind(this);
    }

    _initMembers () {
        this.EVENT = Object.create(null);
        this.EVENT.ONLINE = 1;
        this.EVENT.OFFLINE = 0;
        this._handlers = new Map();
    }

    _ready() {
        this._triggerReady([...arguments]);
    }

    _triggerReady () {
        try {
            if (typeof this._onReady === 'function' )  {
                this._onReady();
            }
        } catch (err) {
            console.error(err);
        }
    }

    // 立即获取在线状态，注意：小程序下非同步
    isOnLine () {
        return this._static.isOnLine();
    }

    on (eventName, handler, context=undefined) {
        if (typeof eventName!== 'number') {
            throw new Error('param 1 : eventName, is not a number');
        }
        if (Object.values(this.EVENT).indexOf(eventName) < 0) {
            throw new Error(`param 1 : eventName invalid value. refers: ${JSON.stringify(this.EVENT)}`);
        }

        if (handler.name==='') {
            console.warn('warn : param 2 handler is a anonymouns function, it can not be off ')
        }

        if (!this._handlers.has(eventName)) {
            this._handlers.set(eventName, new Map());
        }
        let safeHandler = function() {
            try {
                handler.apply(context, [...arguments])
            } catch (err) {
                console.log(err);
            }
        }
        this._handlers.get(eventName).set(handler, safeHandler);
    }

    off (eventName, handler, context) {
        if (typeof eventName!== 'number') {
            throw new Error('param 1 : eventName, is not a number');
        }
        if (Object.values(this.EVENT).indexOf(eventName) < 0) {
            throw new Error(`param 1 : eventName invalid value. refers: ${JSON.stringify(this.EVENT)}`);
        }
        if (this._handlers.get(eventName).has(handler)) {
            this._handlers.get(eventName).delete(handler);
        }
    }

    _onOnline() {
        const handlers = this._handlers.get(this.EVENT.ONLINE);
        handlers.forEach((value, key, map)=>{
            try {
                value([...arguments]);
            } catch (err) {
                console.error(err);
            }
        });
    }

    _onOffline() {
        const handlers = this._handlers.get(this.EVENT.OFFLINE);
        handlers.forEach((value, key, map)=>{
            try {
                value(arguments);
            } catch (err) {
                console.error(err);
            }
        });
    }
}
window.NetState = NetState;
