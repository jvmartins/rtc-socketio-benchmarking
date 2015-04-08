//"use strict";
var assert = require("assert");
var common = require("../../public/js/commonRTC.js");

describe('Array', function(){

    it.skip('should increment message count after send message', function(){
        common.loginSuccess("123");
        assert(1,1);
    });

    it('should call easyrtc error handling', function(){

        //arrange
        easyrtc = {};
        errorCode = {};
        var ok = false;
        easyrtc.showError = function(a,b){
            //console.log("overwritten");
            ok = true;
        };

        //act
        common.loginFailure();

        //asset
        assert(ok);
    });

});