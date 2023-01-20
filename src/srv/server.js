const experss = require("express");
const app = new experss();
var ip = require('ip');
const notifier = require('node-notifier');
const open = require('open');

const port = 8000;

app.use(experss.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "\\clnt\\index.html");
})

app.get('/setup', (req, res) => {
  res.sendFile(__dirname + "\\clnt\\setup.html");
})

app.listen(port, () => {
  console.log(`MobileControll server running on: http://${ip.address()}:${port}`)
  notifier.notify({
    title: "MobileControll",
    message: `running on: http://${ip.address()}:${port}`,
    actions: ['open setup', 'open']
  })
})

notifier.on('open setup', () => {
  open(`http://${ip.address()}:${port}/setup`)
});
notifier.on('open', () => {
  open(`http://${ip.address()}:${port}`)
});