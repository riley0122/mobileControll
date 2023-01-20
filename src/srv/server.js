const experss = require("express");
const app = new experss();
var ip = require('ip');

const port = 8000;

app.use(experss.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "\\clnt\\index.html");
})

app.listen(port, () => {
  console.log(`MobileControll server running on: http://${ip.address()}:${port}`)
})
