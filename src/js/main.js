define('main', function (require, exports, module) {

    var $ = require('jquery');
    var jqUI = require('jqUI');
    var list = require('list');
    var category = require('category');
    var cart = require('cart');

    exports.init = function () {
        list.showBooks();
        list.clickCrumb();
        list.showCrumb();
        
        category.showCategory();
        category.dealCategory();
        
        cart.getTotalPrice();
        cart.dealCartBtn();
        cart.showCart();
        cart.changeInput();
        cart.delBook();
        cart.dragBookToCart();
    };
});