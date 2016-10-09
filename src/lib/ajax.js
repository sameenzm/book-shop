define('ajax', function (require, exports, module) {
    var $ = require('jquery');
    var Promise = require('es6-promise').Promise;
    
    module.exports = function (url, param) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: url,
                data: param,
                success: function (resp) {
                    if (resp.errCode !== 200) {
                        alert('请求数据有误, 请稍后重试~');
                        reject();
                    }
                    else {
                        resolve(resp.data);
                    }
                },
                error: function () {
                    alert('网络请求失败，请稍后重试~');
                    resolve();
                }
            })
        })
    }
});