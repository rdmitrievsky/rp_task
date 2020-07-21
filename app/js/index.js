'use strict'

/**
 * 1. Variables
 * 2. Input names
 * 3. Set error text to inputs
 * 4. Text Areas Interaction
 * 5. Inputs Interaction
 * 6. ChackBox Interaction
 * 7. Form Will Submit
 * 8. Save Button Interaction
 * 9. Reset Button Interaction
 * 10. Document Gets Loaded
 * 11. Check inputs validation errors
 * 12. Phone mask
 */


// Variables
const $form = document.querySelector('#form')

// Buttons
const $saveButton = document.getElementById('button-save')
const $resetButton = document.getElementById('button-reset')
const $checkbox = document.getElementById('describing-checkbox')

// Text areas
const $internalTextbox = document.getElementById('internal_use_textarea')
const $externalTextbox = document.getElementById('external_use_textarea')

const alertOnLoad = document.querySelector('.alert')

const $formInputs = document.querySelectorAll('.form__input')

// Input names
const $groupName = document.getElementById('group-name')
const $alias = document.getElementById('alias')
const $email = document.getElementById('mail')
const $phone = document.getElementById('phone')

const inputsArrray = Array.from($formInputs)

// Set error text to inputs
function setText(asd) {
    switch (asd.id) {
        case 'phone':
            asd.nextElementSibling.innerText = 'Введите корректный номер'
            break
        case 'mail':
            asd.nextElementSibling.innerText = 'Введите корректный адрес'
            break
        case 'alias':
            asd.nextElementSibling.innerText = 'Алиас не может содержать русские буквы и пробелы'
            break
        default:
            asd.nextElementSibling.innerText = ''
            break;
    }
}

// Text Areas Interaction
function textAreaLabelColor(textarea) {
    textarea.value ? textarea.parentElement.classList.add('form__labeled-textarea_filled') : textarea.parentElement.classList.remove('form__labeled-textarea_filled')
    textarea.addEventListener('focus', function() {
        this.parentElement.classList.add('form__labeled-textarea_focused')
    })
    textarea.addEventListener('blur', function() {
        this.parentElement.classList.remove('form__labeled-textarea_focused')
        if (this.value) {
            this.parentElement.classList.add('form__labeled-textarea_filled')
        } else {
            this.parentElement.classList.remove('form__labeled-textarea_filled')
        }
    })
}

function setTextareaBorder() {
    textAreaLabelColor($externalTextbox)
    textAreaLabelColor($internalTextbox)
}

function setTextareaBackground() {
    $internalTextbox.value.length ? $internalTextbox.classList.add('form__textarea_lined-bg') : $internalTextbox.classList.remove('form__textarea_lined-bg');
    $externalTextbox.value.length ? $externalTextbox.classList.add('form__textarea_lined-bg') : $externalTextbox.classList.remove('form__textarea_lined-bg');
}

$externalTextbox.addEventListener('input', function() {
    setTextareaBackground();
    setSaveButtonStatus();
})

// Inputs Interaction
inputsArrray.forEach(i => {
    i.addEventListener('focus', function() {
        this.parentElement.classList.add('form__labeled-item_focused')
    })
    i.addEventListener('blur', function() {
        this.parentElement.classList.remove('form__labeled-item_focused')
    })
    i.addEventListener("input", function() {
        checkForErrors(i)
        i.value ? i.classList.add('form__input_border-bottom') : i.classList.remove('form__input_border-bottom');
        setSaveButtonStatus()
    });
})

// ChackBox Interaction
$checkbox.addEventListener('change', function() {
    const textareaValue = $internalTextbox.value;
    if (!this.checked) {
        $externalTextbox.value = textareaValue;
        $externalTextbox.disabled = true
    } else {
        $externalTextbox.value = ''
        $externalTextbox.disabled = false
    }
    setSaveButtonStatus()
    setTextareaBackground()
    textAreaLabelColor($externalTextbox)
})

// Form Will Submit
$form.addEventListener('submit', function(t) {
    inputsArrray.forEach(i => {
        if (i.validity.valueMissing) {
            i.parentElement.classList.add('form__labeled-item_invalid')
            i.nextElementSibling.classList.add('form__error_animated')
            i.nextElementSibling.innerText = 'Нужно заполнить поле'
        } else {
            if (i.validity.valid) {
                i.parentElement.classList.remove('form__labeled-item_invalid')
                i.nextElementSibling.classList.remove('form__error_animated')
                i.nextElementSibling.innerText = ''
            } else {
                i.parentElement.classList.add('form__labeled-item_invalid')
                i.nextElementSibling.classList.add('form__error_animated')
                setText(i)
            }
        }
    })
    if (inputsArrray.every(inp => inp.validity.valid)) {
        if (alertOnLoad.classList.contains('alert_showed-up')) {
            alertOnLoad.classList.remove('alert_showed-up');
            alertOnLoad.classList.add('alert_showed-down');
            setTimeout(() => {
                alert('Отправлено на модерацию')
            }, 1100);
        }
    }
    t.preventDefault()
})

// Save Button Interaction
function setSaveButtonStatus() {
    if ( inputsArrray.some(item => item.value.length > 0) || $externalTextbox.value.length > 0 ) {
        ($saveButton.disabled = false)
    } else {
        ($saveButton.disabled = true)
    }
}

$saveButton.addEventListener('click', function() {
    inputsArrray.forEach(i => {
        sessionStorage.setItem(`${i.id}`, `${i.value}`)
    })
    const extTextValue = $externalTextbox.value
    sessionStorage.setItem('public-text', extTextValue)
    alert('Данные успешно сохранены')
})

// Reset Button Interaction
$resetButton.addEventListener('mousedown', function() {
    inputsArrray.forEach(i => {
        i.classList.remove('form__input_border-bottom');
        i.parentElement.classList.remove('form__labeled-item_invalid')
        i.nextElementSibling.classList.remove('form__error_animated')
        i.parentElement.classList.remove('form__labeled-item_filled')
    })
    $externalTextbox.parentElement.classList.remove('form__labeled-textarea_filled')
    $saveButton.disabled = true
    $externalTextbox.value = ''
    $externalTextbox.disabled = false
    setTextareaBackground()
})

// Document Gets Loaded
document.addEventListener('DOMContentLoaded', function() {
    (async function showAlert() {
        const delay = ms => {
            return new Promise(r => setTimeout(() => r(), ms))
        }
        if (Object.values(sessionStorage).some(o => o)) {
            inputsArrray.forEach(async i => {
                i.value = sessionStorage[`${i.id}`]
                i.value ? i.classList.add('form__input_border-bottom') : i.classList.remove('form__input_border-bottom');
                await delay(700)
                checkForErrors(i)
            })
            await delay(500)
            alertOnLoad.classList.remove('alert_showed-down')
            alertOnLoad.classList.add('alert_showed-up')
        } else {
            inputsArrray.forEach(i => i.value = '')
        }
    })();
    const extTextValue = sessionStorage.getItem('public-text')
    if (extTextValue && extTextValue.length) {
        $externalTextbox.value = extTextValue
    } else {
        $externalTextbox.value = ''
    }
    setTextareaBorder();
    setSaveButtonStatus();
    setTextareaBackground();
})

// Check inputs validation errors
function checkForErrors(item) {
    if (item.validity.valid || item.value == '') {
        item.parentElement.classList.remove('form__labeled-item_invalid')
        item.nextElementSibling.classList.remove('form__error_animated')
        item.parentElement.classList.remove('form__labeled-item_filled')
        item.nextElementSibling.innerText = ''
    } else {
        item.parentElement.classList.add('form__labeled-item_invalid')
        item.nextElementSibling.classList.add('form__error_animated')
        setText(item)
    }
    if (item.validity.valid || item.value) {
        item.parentElement.classList.add('form__labeled-item_filled')
    }
}

// Phone mask
$phone.setAttribute('maxlength', '18');
$phone.addEventListener('focus', function(ev) {
    ev.target.value.length < 4 && (this.value = `+7 (`);
});
$phone.addEventListener('input', function(ev) {
    ev.target.value.length < 4 && (this.value = `+7 (`);
})

$phone.addEventListener('keydown', function(j) {
    let meme = this.value;
    if (event.which >= 48 && event.which <= 57 || event.which >= 96 && event.which <= 105) {
        meme = this.value;
        if (event.which >= 48 && event.which <= 57 || event.which >= 96 && event.which <= 105) {
            meme.length === 7 ? j.target.value = `${meme}) ` : ''
            meme.length === 8 ? j.target.value = `${meme} ` : ''
            meme.length === 12 ? j.target.value = `${meme}-` : ''
            meme.length === 15 ? j.target.value = `${meme}-` : ''
        }
    } else if (event.which === 8) {
        meme = this.value;
    } else if (event.which >= 32 && event.which <= 40) {
        j.preventDefault()
    } else if (event.which > 64 && event.which <= 90) {
        j.preventDefault()
    }
});