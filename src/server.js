const express = require('express');
const path = require('path');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require("fs");
let loki = require('lokijs');

const app = express();
app.use(cors());
app.use(express.json());

const networkPath = path.join(__dirname, 'network_scan_detection.log');
const devicesPath = path.join(__dirname, 'connected_devices.log');

const db = new loki('C:\\Users\\Admin\\dev\\Project\\src\\mydb.json');
const networkLogs = db.addCollection('networkLogs');

app.listen(8080, (error) => {
    error ? console.log(error) : console.log('listening port 8080')
})

app.get('/monitoring', (req, res) => {
    res.sendFile(networkPath);
    fs.readFile(networkPath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
      extractData(data);
      console.log(networkLogs.find())
    });
})

app.get('/devices', (req, res) => {
  res.sendFile(devicesPath);
})

app.use("/sysLog", function(request, response) {
  const logs = request.body.sysLog; // считываем массив из тела запроса
  let responseText = ''; // инициализируем переменную для текста
  
  logs.forEach(element => {
      responseText += element + '\n'; // добавляем каждый элемент и новую строку
  });

  storeFile(responseText, 'sysLog'); // ваша функция для сохранения лога
  response.send(responseText); // отправляем ответ клиенту
});

function runPythonLogs() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['logs.py']);

    let output = '';
    pythonProcess.stdout.on('data', (data) => {
      output += data.toString('utf-8');
    });

    pythonProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString('utf-8');
      return reject(new Error(errorMessage));
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python скрипт завершился с кодом ${code}`));
      }
      resolve(output);
    });
  });
}

function runPythonDevices() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['Devices.py']);

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

(async function Log() {
  try {
    const result = await runPythonLogs();
    console.log(result);
  } catch (err) {
    console.error('Ошибка при выполнении Python скрипта:', err);
  }
}())

async function Devices() {
  try {
    const result = await runPythonDevices();
    console.log(result);
  } catch (err) {
    console.error('Ошибка при выполнении Python скрипта:', err);
  }
}
Devices();

function storeFile(data, name){
    fs.writeFile(`C:\\Users\\Admin\\dev\\Project\\src\\${name}.txt`, data, function(error){
        if(error){  // если ошибка
            return console.log(error);
        }
        console.log("Файл успешно записан");
    });
}

function extractData(text) {
  const dates = [];
  const ipv4Addresses = [];
  const numbers = [];

  // Регулярные выражения
  const dateRegex = /\d{4}-\d{2}-\d{2}\*\d{2}:\d{2}:\d{2}/g;
  const ipv4Regex = /(\d{1,3}\.){3}\d{1,3}/g;
  const numberRegex = /(\d+)$/gm;

  const res = text.split(" ");
  res.forEach(element => {
      if(dateRegex.test(element)){
          dates.push(element.match(dateRegex))
      } else if(ipv4Regex.test(element)) {
          ipv4Addresses.push(element.match(ipv4Regex));
      } else if(numberRegex.test(element)){
          numbers.push(element);
      }
  })
  networkLogs.insert({date: dates, ip: ipv4Addresses, number: numbers});
  db.saveDatabase();
}