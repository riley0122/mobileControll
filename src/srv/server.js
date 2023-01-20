const experss = require("express");
const app = new experss();
var ip = require('ip');

const port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`MobileControll server running on: http://${ip.address()}:${port}`)
})
