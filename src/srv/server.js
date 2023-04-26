const express = require("express");
var ip = require('ip');
const notifier = require('node-notifier');
const open = require('open');                            // Package for opening URL's
const fs = require("fs");   
const path = require("path")  

const app = new express();                               // Initialises express

const { port, auth } = require('./config/ServerConfig.json');  // Get the port from the server config

app.use('', express.static(path.join(__dirname, '/clnt/public')))         // Includes the public folder


// standard pages

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/clnt/index.html");        // Sends the index file on the main page
})

app.get('/setup', (req, res) => {
  res.sendFile(__dirname + "/clnt/setup.html");        // Sends the setup page on the main page
})

// saving settings in a file

app.get('/api', async(req, res) => {
  if(auth != ""){
    if(req.query.auth != auth){
      res.status(401);
      res.send(JSON.parse("{msg: \"401: Not allowed!\"}"));
      return;
    }
  }
  let path = 'config/UserSettings.json'                  // The relative path to the user settings
  switch (req.query.action) {
    case "getAll":                                       // Gets all user settings
      try {
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (e, data) => {      // Read the file and send the parsed data back
            if(e) throw e;
            res.send(JSON.parse(data));
          })
        }else{
          fs.writeFile(path, '{"exists":1}', (e) => {    // If the file doesn't exist create it and set "exists" to 1
            if(e) throw e;
          })
        }
      } catch (e) {
        console.error(e);
        res.send(e);
      }
      break;
      
    case "set":                                          // Sets the specified key to the specified value
       if(req.query.key!=""&&req.query.value!=""){       // Check if both key & value are set
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (e, data) => {
            if(e) throw e;
            data = JSON.parse(data);
            data[req.query.key] = req.query.value;
            fs.writeFile(path, JSON.stringify(data), (e) => { // write the new data with the new key to the file
              if(e) throw e;
            })
            res.send(data)
          })
        }else{
          fs.writeFile(path, '{"error":"file doesnt exist"}', (e) => {  // If the file doesn't exist dont do anything
            if(e) throw e;
          })
        }
       }else{
        res.send(JSON.parse('{"error":"missing/invalid arguements"}'));
       }
    break;

    case "run":
       if(req.query.key!=""){                            // Check if key is set
        if (fs.existsSync(path)) {
          fs.readFile(path, 'utf-8', (e, data) => {
            data = JSON.parse(data);
            act = data[req.query.key]
            const run = eval(act)
            try {
              run()
              res.send(JSON.parse('{"msg": "Succes!", "s":0}'))
            } catch (error) {
              res.send(JSON.parse(`{"msg": "Something went wrong", "s":1, "error": "${error}"}`))
            }
            
          })
        }else{
          fs.writeFile(path, '{"error":"file doesnt exist"}', (e) => {  // If the file doesn't exist dont do anything
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
  notifier.notify({                                        // Create a notification with the ip and port with the buttons to open setup and to open the page
    title: "MobileControll",
    message: `running on: http://${ip.address()}:${port}`,
    actions: ['open setup', 'open',]
  })
  const data = `http://${ip.address()}:${port}`                  // Save the ip and port as data
  open(`https://api.qrserver.com/v1/create-qr-code/?data=${data}&amp;size=100x100`)   // generate a qr code and show it
})

notifier.on('open setup', () => {                         // When the button to open setup is pressed it opens the server on the setup page
  open(`http://${ip.address()}:${port}/setup`)
});
notifier.on('open', () => {
  open(`http://${ip.address()}:${port}`)                  // When the open buttin is pressed it opens the site
});
