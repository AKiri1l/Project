import './pages/index.css';

const deviceListButton = document.querySelector('.devices');
const logButton = document.querySelector('.logbook');
const deviceList = document.querySelector('.popup_type_devices');
const logList = document.querySelector('.popup_type_log');
const closeButton = document.querySelector('.popup__close')

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