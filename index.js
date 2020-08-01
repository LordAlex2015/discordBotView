// Verify node modules have been installed
const {accessSync} = require('fs');
const {join} = require('path');

try {
    accessSync(join(__dirname, '', 'node_modules'));
} catch (e) {
    console.error('Please run "npm install" before starting the bot');
    process.exit(1);
}
//Starting the code
const Eris = require('eris');
const {token} = require('./config.json');
const client = new Eris(token);
const color = require('colors');
const {render, mpRender, guildRender, channelRender, userRender} = require('./render');
//Connecting to Discord
client.connect();

const express = require('express');
const app = express()
//Launching local server at port 3000
app.listen(3000);
app.set('view engine', 'ejs');
client.on('ready', () => {
    console.log(color.blue('Launched!'));
    console.log(color.green('Connected to Discord'));
    console.log(color.blue(`Listening at Port 3000 (${color.yellow('http://localhost:3000/')})`));

})


client.on('error', (err) => {
    console.error(error)
})
//rendering
app.get('/', async (req, res) => {
    await render(client).then(async (r) => {
        await mpRender(client).then(async (x) => {
            await res.render('index.ejs', {title: 'The index page!', client: client, message: await r, mp: await x})
        })
    })
});
app.get('/guild/:id', async (req, res) => {
    await guildRender(client, req.params.id).then(async (r) => {
        await res.render('guild.ejs', {title: 'The index page!', client: client, message: await r})
    })
})
app.get('/channel/:id', async (req, res) => {
    await channelRender(client, req.params.id).then(async (r) => {
        await res.render('guild.ejs', {title: 'The index page!', client: client, message: await r})
    })
})
app.get('/user/:id', async (req, res) => {
    await userRender(client, req.params.id).then(async (r) => {
        await res.render('guild.ejs', {title: 'The index page!', client: client, message: await r})
    })
})