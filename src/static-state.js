import {IS_IN_WXMP} from './const';
export default class StaticState {
    constructor (readyHandle) {
        this._readyHandle = readyHandle;
        this._checkOnline();
    }

    isOnLine () {
      if (IS_IN_WXMP) {
        return this._isOnLineWX();
      }
      return this._isOnLineWeb();
    }

    _isOnLineWeb () {
      return new Promise((resolve, reject)=>{
        resolve(window.navigator.onLine);
      });
    }

    _isOnLineWX () {
      return new Promise((resolve, reject) => {
        wx.getNetworkType({
          success: (res) => {
            this._isOnLine = res.networkType === 'none' ? false : true;
            resolve({isOnLine: this._isOnLine}); 
          },
          fail: (res) => {
            this._isOnLine = false;
            reject({isOnLine: this._isOnLine});
          }
        });
      });
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
