require('dotenv').config({ silent: true });

const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const http = require('http');
const serialize = require('serialize-javascript');
const moment = require('moment-timezone');
moment.tz.setDefault('UTC');

app.use('/public', express.static(path.join(__dirname, 'public')));

let events = [
    { description: "Evento 1", date: moment("2017-11-17") },
    { description: "Evento 2", date: moment("2017-10-31") },
    { description: "Evento 3", date: moment("2017-12-01") },
];

let renderer;

if(process.env.NODE_ENV ==='production'){
    let bundle = fs.readFileSync('./dist/node.bundle.js', 'utf-8');
    renderer = require('vue-server-renderer').createBundleRenderer(bundle);
    app.use('/dist', express.static(path.join(__dirname, 'dist')));
}

app.get('/', (req, res) => {
    let template = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
    let contentMarker = "<!--APP-->";
    if(renderer) {
        renderer.renderToString({ events }, (err, html) => {
            if (err) {
                //console.log(err);
                res.send(template.replace(contentMarker, `${error}<script>const ___INITIAL_STATE___ = ${serialize(events)}</script>`));
            } else {
                //console.log(html);
                res.send(template.replace(contentMarker, `<script>const ___INITIAL_STATE___ = ${serialize(events)}</script>\n${html}`));
            }
        });
    } else {
        res.send("<p>Awaiting compilation...</p><script src='reload/reload.js'></script>");
    }

});

app.use(require('body-parser').json());
app.post('/add_event', (req, res) => {
    events.push(req.body);
    res.sendStatus(200);
});

const server = http.createServer(app);

if (process.env.NODE_ENV === 'development') {
    const reload = require('reload');
    const reloadServer = reload(server, app);
    require('./webpack-dev-middleware').init(app);
    require('./webpack-server-compiler').init(function(bundle){
        let needsReload = (renderer === undefined);
        renderer = require('vue-server-renderer').createBundleRenderer(bundle);
        if(needsReload){
            reloadServer.reload();
        }
    });
}

server.listen(process.env.PORT, function () {
    console.log(`Example app listening on port ${process.env.PORT}!`);
    if (process.env.NODE_ENV === 'development') {
        require("open")(`http://localhost:${process.env.PORT}`);
    }
});
