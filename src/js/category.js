define('category', function (require, exports, module) {
    var $ = require('jquery');
    var tpl = require('tpl_category');
    var server = require('server');
    var list = require('list');

    exports.showCategory = function () {
        server.getCategory()
            .then(function (data) {
                $('.category-main').html(tpl({data: data}));
            });
    };

    exports.dealCategory = function () {
        $('.category-main').on('click', '.parent-ctg', function () {
            var parent = $(this).parent();
            var child = parent.children('.child-ctg');
            var plus = parent.find('.plus-icon');
            var minus = parent.find('.minus-icon');

            if (child.css('display') === 'none') {
                child.css('display', 'block');
                plus.css('display', 'none');
                minus.css('display', 'inline');
            }
            else {
                child.css('display', 'none');
                plus.css('display', 'inline');
                minus.css('display', 'none');
            }
        })

        $('.category-main').on('click', '.child-ctg li', function () {
            var ctg_id = $(this).data('id');
            list.showBooks(ctg_id);
        })
    };
});