var assert = require("assert");
var common = require("../../public/js/commonRTC.js");

describe('CommonRTC', function(){

    beforeEach(function(){
        common.setPropertiesRTC = function (){};
        common.setListeners = function (){};
        common.connectRTC = function (){};
        
        easyrtc = {};
        errorCode = "any";
    });

    it('should overwrite and call custom listeners', function(){
        var overwriten = false;
        common.setRTCCustomListeners = function () {
            overwriten = true;
        };
        common.configureRTCDataChannel();
        assert(overwriten);
    });

    it('should call easyrtc error handling on Login Failure', function(){
        var ok = false;
        easyrtc.showError = function(a,b){
            ok = true;
        };
        //act
        common.loginFailure();
        //asset
        assert(ok);
    });

});