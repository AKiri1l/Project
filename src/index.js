import './pages/index.css';

let sysLog = new Array();

const monitoring = document.querySelector('.monitoring');
const deviceListButton = document.querySelector('.devices');
const logButton = document.querySelector('.logbook');
const logList = document.querySelector('.popup_type_log');
const portButton = document.querySelector('.portlist');
const logPopup = document.querySelector('.popup_type_log');
const logWindow = document.querySelector('.logs');
const syslist = document.querySelector('.syslist');

monitoring.addEventListener('click', () => {
    sysLog.push("Вывод информации о мониторинге\n");
    logWindow.style.backgroundColor = 'white';
    fetch('http://localhost:8080/monitoring')
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
    .catch(error => {
        logWindow.textContent = error;
    });
})

deviceListButton.addEventListener('click', () => {
    logWindow.style.backgroundColor = 'white';
    sysLog.push("Показ сетевых устройств\n");
    fetch('http://localhost:8080/devices')
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
    .catch(error => {
        logWindow.textContent = error;
    });
});

logButton.addEventListener('click', () => {
    logList.classList.add('popup_is-opened');
    sysLog.push("Открытие меню для скачивания\n");
})

logList.addEventListener('click', (evt) => {
    if(evt.target.classList.contains('popup__close')){
        logList.classList.remove('popup_is-opened');
        sysLog.push("Закрытие меню для скачивания\n");
    }
})

portButton.addEventListener('click', (evt) => {
    sysLog.push("Скачивание лога по попыткам сканирования\n");
    logPopup.classList.remove('popup_is-opened');
})

syslist.addEventListener('click', (evt) => {
    sysLog.push("Скачивание лога по действиям системы\n");
    fetch('http://localhost:8080/sysLog', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sysLog })
    })
    .then(response => response.text())
    .then(data => {
        console.log('Response from server:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    logPopup.classList.remove('popup_is-opened');
})
