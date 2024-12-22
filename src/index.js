import './pages/index.css';

let loki = require('lokijs');
const db = new loki('C:\\Users\\Admin\\dev\\Project\\src\\mydb.json');
const networkLogs = db.addCollection('networkLogs');

const deviceListButton = document.querySelector('.devices');
const logButton = document.querySelector('.logbook');
const deviceList = document.querySelector('.popup_type_devices');
const logList = document.querySelector('.popup_type_log');
const portButton = document.querySelector('.portlist');
const logPopup = document.querySelector('.popup_type_log');
const logWindow = document.querySelector('.logs');

deviceListButton.addEventListener('click', () => {
    deviceList.classList.add('popup_is-opened');
})

logButton.addEventListener('click', () => {
    logList.classList.add('popup_is-opened');
})

logList.addEventListener('click', (evt) => {
    if(evt.target.classList.contains('popup__close')){
        logList.classList.remove('popup_is-opened');
    }
})

deviceList.addEventListener('click', (evt) => {
    if(evt.target.classList.contains('popup__close')){
        deviceList.classList.remove('popup_is-opened');
    }
})

portButton.addEventListener('click', () => {
    logPopup.classList.remove('popup_is-opened');
    logWindow.style.backgroundColor = 'white';
    fetch('http://localhost:8080/read')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        // Отображаем содержимое файла в элементе <pre>
        logWindow.innerHTML = data.replace(/\n/g, '<br>');
        return data;
    })
    .then(data => {
        extractData(data);
        db.saveDatabase();
    })
    .catch(error => {
        logWindow.textContent = error;
    });
})

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
}