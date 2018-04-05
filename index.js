// aws lamda 업로드 준비 중 - phantom js 를 lamda 에서 돌리는 법을 찾고 있습니다 ...

// const path = require('path');
// const childProcess = require('child_process');
// const Slack = require('slack-node');
// const fs = require('fs');
// const _ = require('partial-js');

// const { difference, uniqObjectArray, stopIf, strJoin } = require('./fpUtils');

// const slack = new Slack();
// slack.setWebhook(process.env.SLACK_URL);

// const data = require('./data')

// exports.handler = function(event, context) {

//     // Set the path as described here: https://aws.amazon.com/blogs/compute/running-executables-in-aws-lambda/
//     process.env['PATH'] = process.env['PATH'] + ':' + process.env['LAMBDA_TASK_ROOT'];

//     // Set the path to the phantomjs binary
//     var phantomPath = path.join(__dirname, 'phantomjs_linux-x86_64');

//     // Arguments for the phantom script
//     var processArgs = [
//         path.join(__dirname, 'phantom-script.js'),
//        'my arg'
//     ];

//     const childArgs = [ path.join(__dirname, 'phantomjs-script.js')];

//     childProcess.execFile(phantomPath, processArgs, function(err, stdout, stderr) {
//         if (err) {
//             console.log('error!!', err);
//         }

//         const list = JSON.parse(stdout);

//         const isSameNotice = (prev, cur) => prev.title === cur.title && prev.date === cur.date;

//         const storeAllNotices = _.pipe(
//             newlist => _.union(list, data),
//             uniqObjectArray(isSameNotice),
//             JSON.stringify,
//             notices => fs.writeFile('data.json', notices, (err) => {
//                 if (err) console.log(err);
//             })
//         );

//         const slackNewNotices = (list) => {
//             console.log(list);
//             slack.webhook({
//                 text: strJoin('\n')(_.map(list, notice => `제목: ${notice.title}, 일자: ${notice.date}`))
//             }, function(err, response) {});
//         }

//         _.go(list,
//             _.partial(difference, _, data, isSameNotice),
//             stopIf(_.isEmpty),
//             slackNewNotices,
//             storeAllNotices
//         );
//     });
// }
