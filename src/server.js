const express = require('express');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require("fs");

const app = express();
app.use(cors());

const filePath = path.join(__dirname, 'network_scan_detection.log');
const indexPath = path.join(__dirname, 'index.html');

app.listen(8080, (error) => {
    error ? console.log(error) : console.log('listening port 8080')
})

app.get('/', (req, res) => {
    res.sendFile(indexPath);
})

app.get('/read', (req, res) => {
    res.sendFile(filePath);
})



function runPythonScript() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['logs.py']);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python скрипт завершился с кодом ${code}`));
      }
      resolve(output);
    });

    pythonProcess.stderr.on('data', (data) => {
      reject(new Error(data));
    });
  });
}

async function main() {
  try {
    const result = await runPythonScript();
    console.log(result);
  } catch (err) {
    console.error('Ошибка при выполнении Python скрипта:', err);
  }
}

main();

     
function storeFile(data, name){
    fs.writeFile(`C:\\Users\\Admin\\dev\\Project\\src\\${name}.txt`, data, function(error){
        if(error){  // если ошибка
            return console.log(error);
        }
        console.log("Файл успешно записан");
    });
}
