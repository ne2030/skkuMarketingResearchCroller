var _ = require('partial-js');
var page = require('webpage').create();

page.open('http://pool.skku.edu', function (status) {  
    try {
        if (status) {
            var html = page.content;
            var result = page.evaluate(function() {
                var parseNotice = function (el) {
                    return { title: el.children[0].innerText, date: el.children[1].innerText };
                };
                var noticeElList = document.getElementsByClassName('main_notice')[0].querySelectorAll('.main_notice_tr');
                
                var notices = Array.prototype.map.call(noticeElList, parseNotice);
                return JSON.stringify(notices);
            });

            console.log(result);

        };
    } catch (err) {
        console.log(err);
    }
    
    phantom.exit();
});
