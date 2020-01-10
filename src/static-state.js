import {IS_IN_WXMP} from './const';
export default class StaticState {
    constructor (readyHandle) {
        this._isOnLine = false;
        this._readyHandle = readyHandle;
        this._checkOnline();
    }


    get isOnLine () {
        return this._isOnLine;
    }


    _checkOnline () {
        if (IS_IN_WXMP) {
            this._checkOnLineWX();           
            return;
        } 
        this._checkOnLineWeb();
    }

    _checkOnLineWX () {
        wx.getNetworkType({
            success: (res) => {
                this._isOnLine = res.networkType === 'none' ? false : true;
                this._readyHandle();
            }
        });
    }

    _checkOnLineWeb() {
        this._isOnLine = window.navigator.onLine;
        this._readyHandle();
    }
}