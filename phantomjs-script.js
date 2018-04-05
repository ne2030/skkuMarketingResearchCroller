var system = require('system');
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

            system.stdout.write(result);

        };
    } catch (err) {
        system.stdout.write(err);
    }
    
    phantom.exit();
});

// to transform this file into raw js, replace system.stdout.write function to console.log
