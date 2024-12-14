/*-----------------------Валидность кнопки--------------------*/
function buttonValidation(form, object) {
    const button = form.querySelector(object.submitButtonSelector);
    const inputList = Array.from(form.querySelectorAll(object.inputSelector))
    if(inputList.some(element => {  return !element.validity.valid})){
        button.classList.add(object.inactiveButtonClass);
        button.setAttribute('disabled', true);
    }else{
        button.classList.remove(object.inactiveButtonClass);
        button.removeAttribute('disabled');
    }
}

/*-----------------------Вывод сообщения об ошибке-------------------------*/
function showError(form, input, message, object) {
    const errorMessage = form.querySelector(`.${input.id}-error`);
    errorMessage.textContent = message;
    errorMessage.classList.add(object.errorClass);
    input.classList.add(object.inputErrorClass)
}

/*-----------------------Скрытие сообщения об ошибке------------------------*/
function hideError(form, input, object) {
    const errorMessage = form.querySelector(`.${input.id}-error`);
    errorMessage.textContent = '';
    errorMessage.classList.remove(object.errorClass);
    input.classList.remove(object.inputErrorClass)
}

/*-------------------------Проверка валидации форм------------------------------------*/
function isValid(input, form, object) {
    if(input.validity.patternMismatch){
        input.setCustomValidity(input.dataset.errorMessage);
    }else{
        input.setCustomValidity("");
    }
    if(input.validity.valid){
        hideError(form, input, object)
    }else{
        showError(form, input, input.validationMessage, object)   
    }
}

/*------------------------Проверка валидности инпутов--------------------------*/
function setEventListeners(formElement, object) {
    const inputList = Array.from(formElement.querySelectorAll(object.inputSelector))
    inputList.forEach(inputElement => {
        inputElement.addEventListener('input', () => {
            isValid(inputElement, formElement, object);
            buttonValidation(formElement, object);
        })
    })
}

export function enableValidation(object) {                                         
    const formList = Array.from(document.querySelectorAll(object.formSelector));
    formList.forEach(form => {
        setEventListeners(form, object)
    })
}
                                                                            /*formSelector: popup__form,
                                                                            inputSelector: popup__input,
                                                                            submitButtonSelector: popup__button,
                                                                            inactiveButtonClass: popup__button_disabled,
                                                                            inputErrorClass: popup__input-invalid,
                                                                            errorClass: popup__error_visible*/

export function clearValidation(form, validationConfig){
    const inputList = form.querySelectorAll(validationConfig.inputSelector);
    inputList.forEach(element => {
        hideError(form,element,validationConfig);
    })
    buttonValidation(form, validationConfig);
}