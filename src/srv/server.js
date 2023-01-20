const experss = require("express");
const app = new experss();
var ip = require('ip');
const notifier = require('node-notifier');
const open = require('open');
const fs = require("fs");

const { port } = require('./config/ServerConfig.json');

app.use(experss.static('public'))

// standard pages

app.get('/', (req, res) => {
  res.sendFile(__dirname + "\\clnt\\index.html");
})

app.get('/setup', (req, res) => {
  res.sendFile(__dirname + "\\clnt\\setup.html");
})

// saving settings in a file

app.get('/api', async(req, res) => {
  let path = 'config/UserSettings.json'
  switch (req.query.action) {
    case "getAll":
      try {
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (e, data) => {
            if(e) throw e;
            res.send(JSON.parse(data));
          })
        }else{
          fs.writeFile(path, '{"exists":1}', (e) => {
            if(e) throw e;
          })
        }
      } catch (e) {
        console.error(e);
        res.send(e);
      }
      break;
      
    case "set":
       if(req.query.key!=""&&req.query.value!=""){
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (e, data) => {
            if(e) throw e;
            data = JSON.parse(data);
            data[req.query.key] = req.query.value;
            fs.writeFile(path, JSON.stringify(data), (e) => {
              if(e) throw e;
            })
            res.send(data)
          })
        }else{
          fs.writeFile(path, '{"error":"file doesnt exist"}', (e) => {
            if(e) throw e;
          })
        }
       }else{
        res.send(JSON.parse('{"error":"missing/invalid arguements"}'));
       }
    break;
    default:
      res.send(JSON.parse('{"error":"no (valid) arguements"}'));
    break;
  }
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