import {IS_IN_WXMP} from './const'
export default class StateChange {
    constructor () {
        if (IS_IN_WXMP) {
            this._initOnStateChangeWX();
        } else {
            this._initOnStateChangeWeb();
        }
        this.onOnLine = null;
        this.onOffLine = null;
    }

    _initOnStateChangeWX () {
        wx.onNetworkStatusChange((res)=>{
             if (res.isConnected ) {
                 this.onOnLine({onLine: true})
             } else {
                 this.onOffLine({onLine: false})
             }
        })   
    }

    _initOnStateChangeWeb() {
        window.ononline = (res)=> {
            this.onOnLine({onLine: true})
        }
        window.onoffline = (res) => {
            this.onOffLine({onLine: false})
        }
    }

}