const path = require('path');
const childProcess = require('child_process');
const Slack = require('slack-node');
const fs = require('fs');
const _ = require('partial-js');

const { difference, uniqObjectArray, stopIf, strJoin } = require('./fpUtils');

const slackUrl = 'https://hooks.slack.com/services/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';
const slack = new Slack();
slack.setWebhook(slackUrl);

const data = require('./data')

exports.handler = function(event, context) {

    // Set the path as described here: https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
    process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

    // Set the path to the phantomjs binary
    var phantomPath = path.join(__dirname, 'phantomjs_linux-x86_64');

    // Arguments for the phantom script
    var processArgs = [
        path.join(__dirname, 'phantom-script.js'),
       'my arg'
    ];

    const childArgs = [ path.join(__dirname, 'phantomjs-script.js')];

    childProcess.execFile(phantomPath, processArgs, function(err, stdout, stderr) {
        if (err) {
            console.log('error!!', err);
        }

        const list = JSON.parse(stdout);

        const isSameNotice = (prev, cur) => prev.title === cur.title && prev.date === cur.date;

        const storeAllNotices = _.pipe(
            newlist => _.union(list, data),
            uniqObjectArray(isSameNotice),
            JSON.stringify,
            notices => fs.writeFile('data.json', notices, (err) => {
                if (err) console.log(err);
            })
        );

        const slackNewNotices = (list) => {
            console.log(list);
            slack.webhook({
                text: strJoin('\n')(_.map(list, notice => `제목: ${notice.title}, 일자: ${notice.date}`))
            }, function(err, response) {});
        }

        _.go(list,
            _.partial(difference, _, data, isSameNotice),
            stopIf(_.isEmpty),
            slackNewNotices,
            storeAllNotices
        );
    });
}

function test() {
    // unique object array - function test

    {
        const uniqArray = uniqObjectArray(
            [{ a: 10, b: 20}, { a: 10, b: 30 }, { a: 20, b: 40 }, { a: 50, b: 60 }, { a: 30, b: 100}, { a: 50, b: 100}],
            (prev, cur) => prev.a === cur.a
        );
        
        const expectedResult = [ { a: 10, b: 20 },
            { a: 20, b: 40 },
            { a: 50, b: 60 },
            { a: 30, b: 100 }];
        
        console.log('\n\n unique test results :: ', JSON.stringify(uniqArray) === JSON.stringify(expectedResult));
    }

    // difference object array - function test

    {
        const objArray = [{ "title": "마케팅 소비자 조사", "date" : "2018-03-31"}, 
            {"title":"마케팅 실험2","date":"2018-03-23"},
            {"title":"마케팅실험","date":"2018-03-16"},
            {"title":"마케팅 실험1","date":"2018-03-12"}
        ];

        const removalArray = [{ "title": "마케팅 소비자 조사", "date" : "2018-03-31"}, 
            {"title":"마케팅실험","date":"2018-03-16"},
        ];

        const removalResult = difference(objArray, removalArray, (prev, cur) => prev.title === cur.title && prev.date === cur.date);
        
        const expectedResult = [{"title":"마케팅 실험2","date":"2018-03-23"}, {"title":"마케팅 실험1","date":"2018-03-12"}];

        console.log('\n\n difference test results :: ', JSON.stringify(removalResult) === JSON.stringify(expectedResult));
    }
}

