const path = require('path');
const childProcess = require('child_process');
const phantomjs = require('phantomjs-prebuilt');
const Slack = require('slack-node');
const fs = require('fs');
const _ = require('partial-js');

require('dotenv').config()

const { difference, uniqObjectArray, stopIf, strJoin, ifElse } = require('../fpUtils');

const slack = new Slack();
slack.setWebhook(process.env.SLACK_URL);

const binPath = phantomjs.path;

const data = require('../data')

const isSameNotice = (prev, cur) => prev.title === cur.title && prev.date === cur.date;

// start phantom process

const childArgs = [ path.join(__dirname, '../phantomjs-script.js')];
const dataPath = path.join(__dirname, '../data.json');

childProcess.execFile(binPath, childArgs, (err, stdout, stderr) => {
    if (err) console.log('error!!', err);

    const list = JSON.parse(stdout);

    const storeAllNotices = _.pipe(
        newlist => _.union(list, data),
        uniqObjectArray(isSameNotice),
        JSON.stringify,
        notices => fs.writeFile(dataPath, notices, (err) => {
            if (err) console.log(err);
        })
    );

    const slackNewNotices = (list) => {
        slack.webhook({
            text: strJoin('\n')(_.map(list, notice => `제목: ${notice.title}, 일자: ${notice.date}`))
          }, function(err, response) {});
    }

    _.go(list,
        list => difference(list, data, isSameNotice),
        ifElse(_.isEmpty, () => { console.log('no news'); return _.stop() }, _.identity),
        slackNewNotices,
        storeAllNotices
    );
});
