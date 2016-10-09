define('list', function (require, exports, module) {
    var $ = require('jquery');
    var server = require('server');
    var tpl = require('tpl_list');

    exports.showBooks = function (ctg_id) {
        server.getBook()
            .then(function (data) {
                var filterData = data.filter(function (item) {
                    return ctg_id ? item['child_category_id'] === ctg_id : true;
                });
                $('.book-lists').html(tpl.list({data: filterData}));
            })
    };

    exports.showCrumb = function () {
        $('.breadcrumb').html(tpl.crumb({
            parentId: 0,
            parent: null,
            child: null
        }));
        $('.category-main').on('click', '.child-ctg li', function () {
            var ctgId = $(this).data('id');
            server.getCategory()
                .then(function (data) {
                    var parentId, parent, child;
                    data.forEach(function (item) {
                        item['children'].forEach(function (value) {
                            if(value['id'] === ctgId) {
                                parentId = item['id'];
                                parent = item['name'];
                                child = value['name'];
                            }
                        })
                    });
                    $('.breadcrumb').html(tpl.crumb({
                        parentId: parentId || 0,
                        parent: parent,
                        child: child
                    }))
                })
        })
    };

    exports.clickCrumb = function () {
        $('.breadcrumb').on('click', '.crumb-parent', function () {
            var parentId = $(this).data('id');
            if(!parentId) {
                server.getBook()
                    .then(function (data) {
                        $('.book-lists').html(tpl.list({data: data}));
                        $('.breadcrumb').html(tpl.crumb({
                            parentId: 0,
                            parent: null,
                            child: null
                        }));
                    })
            }
            else {
                server.getCategory()
                    .then(function (data) {
                        var arr = [],
                            bookArr = [];
                        data.forEach(function (item) {
                            if (item['id'] === parentId) {
                                item['children'].forEach(function (value) {
                                    arr.push(value['id']);
                                })
                            }
                        });
                        server.getBook()
                            .then(function (data) {
                                data.forEach(function (item) {
                                    if(arr.indexOf(item['child_category_id']) >= 0) {
                                        bookArr.push(item);
                                    }
                                });
                                $('.book-lists').html(tpl.list({data: bookArr}));
                            })

                    })
            }
        })
    };
});