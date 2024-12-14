export function openPopup(popup) {
    if (popup) {
        document.addEventListener('click', handleClosePopup);
        document.addEventListener('keydown', handleClosePopup);
        popup.classList.add('popup_is-opened');
    }
}

function handleClosePopup(evt) {
    if (evt.target.classList.contains('popup__close')  || evt.target.classList.contains('popup') || evt.key === 'Escape') {    
        const popup = document.querySelector('.popup_is-opened');
        closePopup(popup);                         
    }
}

export function closePopup(popup) {
    popup.classList.remove('popup_is-opened');    
    document.removeEventListener('click', handleClosePopup);
    document.removeEventListener('keydown', handleClosePopup);
}