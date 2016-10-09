define('cart', function (require, exports, module) {

    var $ = require('jquery');
    var server = require('server');
    var tpl = require('tpl_cart');
    var cache = require('cache');
    
    var  arrSum = function (arr) {
        var sum = 0;
        for(var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    };

    var setData = function (numArr, priceArr) {
        var sum = 0,
            total = 0;
        sum = arrSum(numArr);
        total = arrSum(priceArr);

        cache.setItem('sum', sum, 604800000);
        cache.setItem('total', total, 604800000);

        $('.goods-count').html(tpl.num({sum: sum}));
        $('.cart-footer').html(tpl.total({sum: cache.getItem('sum'), total: cache.getItem('total')}));
    };
    
    var getTotalPrice = function () {
        var cartOrder = cache.getItem('orders');
        var numArr = [],
            priceArr = [];
        if(!cartOrder) {
            server.getOrder()
                .then(function (data) {
                    data.forEach(function (item) {
                        numArr.push(item['num']);
                        priceArr.push(item['gross']);
                    })
                    setData(numArr, priceArr);
                });
        }
        else {
            cartOrder.forEach(function (item) {
                numArr.push(item['num']);
                priceArr.push(item['gross']);
            });
            setData(numArr, priceArr);
        }
    };

    exports.getTotalPrice = getTotalPrice;

    var combineHtmlAndData = function (data) {
        var liHtml = '';
        data.forEach(function (item) {
            liHtml += tpl.goods(item);
        });
        $('.goods-lists').html(liHtml);
    };

    exports.showCart = function () {
        if (!cache.getItem('orders')) {
            server.getOrder()
                .then(function (data) {
                    cache.setItem("orders", data, 604800000);
                    combineHtmlAndData(data);
                })
        }
        else {
            var data = cache.getItem('orders');
            combineHtmlAndData(data);
        }
    };

    exports.dealCartBtn = function () {
        $('.tab-cart').on('mouseenter', function () {
            $('.cart-text').stop().animate({left: '-58px'}, 100, 'swing');
        })

        $('.tab-cart').on('mouseleave', function () {
            $('.cart-text').stop().animate({left: '35px'}, 10, 'swing');
        })

        $('.tab-cart').on('click', function () {
            if (parseInt($('.shop-cart').css('right')) < 0) {
                $('.shop-cart').animate({right: '0'}, 200, 'swing');
                // $('.shop-cart').addClass('cart-open').removeClass('cart-close');
                $('.toolbar').animate({right: "276px"}, 200, 'swing');
            }
            else {
                $('.shop-cart').animate({right: '-300px'}, 200, 'swing');
                // $('.shop-cart').addClass('cart-close').removeClass('cart-open');
                $('.toolbar').animate({right: "0"}, 200, 'swing');
            }
        })

        $('.cart-close').on('click', function(e) {
            $('.shop-cart').animate({right: '-300px'}, 200, 'swing');
            // $('.shop-cart').addClass('cart-close').removeClass('cart-open');
            $('.toolbar').animate({right: "0"}, 300, 'swing');
        })
    };

    exports.changeInput = function () {
        $('.goods-lists').on('change', "input[type='number']", function () {
            var the = $(this);
            var bookId = the.data('book');
            var cartOrder = cache.getItem('orders');
            cartOrder.forEach(function (item) {
                if (item['book_id'] === bookId) {
                    item['num'] = the[0].value - 0;
                    item['gross'] = item['price']*item['num'];
                    the.siblings('.gross').html(' = ' + item['gross']);
                }
            })
            cache.setItem('orders', cartOrder, 604800000);
            getTotalPrice();
        })
    };

    exports.delBook = function () {
        $('.goods-lists').on('click', '.goods-del', function () {
            var the = $(this);
            $('#dialog-confirm').dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "yes": function () {
                        var delId = the.data('del');
                        var dom = the.parent('.goods-title').parent('.goods-info').parent('.goods');
                        dom.remove();
                        var cartOrder = cache.getItem('orders');
                        cartOrder.forEach(function (item) {
                            if (item['book_id'] === delId) {
                                cartOrder.splice(cartOrder.indexOf(item), 1);
                            }
                        })
                        cache.setItem('orders', cartOrder, 604800000);
                        getTotalPrice();
                        $(this).dialog( "close" );
                    },
                    Cancel: function () {
                        $(this).dialog( "close" );
                    }
                }
            })
        })
    };

    exports.dragBookToCart = function () {
        var getBookId = function (id) {

            $('.shop-cart').droppable({
                accept: ".book-lists > .book",
                classes: {
                    "ui-droppable-active": "shop-cart-open"
                },
                drop: function() {
                    var cartOrder = cache.getItem('orders');

                    // 购物车中是否存在 正拖动进去的这本书
                    var isExist = cartOrder.some(function (item) {
                        return item['book_id'] === id;
                    });
                    if (isExist) {
                        var dom = $('.goods-lists').find('.book'+id);
                        var domInput = dom.find('input[type="number"]');
                        var domGross = dom.find('.gross');
                        cartOrder.forEach(function (item) {
                            if(item['book_id'] === id) {
                                item['num'] -= 0;
                                item['num'] += 1;
                                item['gross'] = item['price']*item['num'];
                                domInput.val(item['num']);
                                domGross.html(' = ' + item['gross']);
                            }
                        })
                        cache.setItem('orders', cartOrder, 604800000);
                        getTotalPrice();
                    }
                    else {
                        server.getBook()
                            .then(function (data) {
                                var clickBook = data.filter(function (book) {
                                    return book['id'] === id;
                                })[0];
                                var obj = {};
                                obj = {
                                    book_id: clickBook['id'],
                                    book_name: clickBook['book_name'],
                                    price: clickBook['price'],
                                    cover: clickBook['cover'] ? clickBook['cover'] : './img/book/default.jpg',
                                    num: 1
                                };
                                obj['gross'] = obj['num']*obj['price'];

                                $('.goods-lists').append(tpl.goods(obj));
                                
                                cartOrder.push(obj);

                                cache.setItem('orders', cartOrder, 604800000);
                                getTotalPrice();
                            });
                    }
                }
            });
        }

        $('.book-lists').on('mouseenter', '.book', function () {
            var theBook = $(this);
            var bookId = theBook.find('.book-pic').data('id');
            getBookId(bookId);
            theBook.draggable({
                revert: "invalid",
                helper: "clone",
                cursor: "move",
                zIndex: 4
            });
        })

    };
});