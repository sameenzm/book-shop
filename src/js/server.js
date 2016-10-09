define('server', function (require, exports, module) {
    var $ = require('jquery');
    var ajax = require('ajax');
    
   exports.getCategory = function (cb) {
       var url = './mock/category.json';
       return ajax(url)
   };

    exports.getOrder = function (cb) {
        var url = './mock/order.json';
        return ajax(url);
    };

    exports.getBook = function (cb) {
        var url = './mock/book.json';
        return ajax(url);
    };
});