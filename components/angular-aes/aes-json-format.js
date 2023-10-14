/**
* AES JSON formatter for CryptoJS
*
* @author BrainFooLong (bfldev.com)
* @link https://github.com/brainfoolong/cryptojs-aes-php
*/

var CryptoJSAesJson = {
    stringify: function (cipherParams) {
        var j = {ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)};
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: function (jsonStr) {
        if(isJSON(jsonStr) && jsonStr.length != '1'){
            // console.log(jsonStr);
            var j = JSON.parse(jsonStr);
            var cipherParams = CryptoJS.lib.CipherParams.create({ciphertext: CryptoJS.enc.Base64.parse(j.ct)});
            if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
            if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        }
        else{
            var cipherParams = jsonStr;
        }        
        return cipherParams;
    }
}
function isJSON(MyTestStr){
    try {
        var json = JSON.parse(MyTestStr);
        if(typeof(MyTestStr) == 'string' || typeof(MyTestStr) == 'number')
            if(MyTestStr.length == 0)
                return false;
    }
    catch(e){
        return false;
    }
    return true;
}
