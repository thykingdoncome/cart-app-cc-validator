const supportedCards = {
    // visa, mastercard
    visa: 'https://www.credit-card-logos.com/images/visa_credit-card-logos/visa_logo_3.gif',
    mastercard: 'https://www.credit-card-logos.com/images/mastercard_credit-card-logos/mastercard_logo_3.gif'
};

const countries = [{
        code: "US",
        currency: "USD",
        currencyName: '',
        country: 'United States'
    },
    {
        code: "NG",
        currency: "NGN",
        currencyName: '',
        country: 'Nigeria'
    },
    {
        code: 'KE',
        currency: 'KES',
        currencyName: '',
        country: 'Kenya'
    },
    {
        code: 'UG',
        currency: 'UGX',
        currencyName: '',
        country: 'Uganda'
    },
    {
        code: 'RW',
        currency: 'RWF',
        currencyName: '',
        country: 'Rwanda'
    },
    {
        code: 'TZ',
        currency: 'TZS',
        currencyName: '',
        country: 'Tanzania'
    },
    {
        code: 'ZA',
        currency: 'ZAR',
        currencyName: '',
        country: 'South Africa'
    },
    {
        code: 'CM',
        currency: 'XAF',
        currencyName: '',
        country: 'Cameroon'
    },
    {
        code: 'GH',
        currency: 'GHS',
        currencyName: '',
        country: 'Ghana'
    }
];

const billHype = () => {
    const billDisplay = document.querySelector('.mdc-typography--headline4');
    if (!billDisplay) return;

    billDisplay.addEventListener('click', () => {
        const billSpan = document.querySelector("[data-bill]");
        if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
                new SpeechSynthesisUtterance(appState.billFormatted)
            );
        }
    });
};

const appState = {};

const formatAsMoney = (amount, buyerCountry) => {
    const getCurrency = ({
        country
    }) => {
        return country === buyerCountry;
    }
    let countryCurrency = countries.find(getCurrency);

    if (!countryCurrency) {
        countryCurrency = {
            code: "en-US",
            currency: "USD"
        };
    }
    return amount.toLocaleString(`en-${countryCurrency.code}`, {
        style: "currency",
        currency: countryCurrency.currency
    })
};

const flagIfInvalid = (field, isValid) => {
    isValid ? field.classList.remove("is-invalid") : field.classList.add("is-invalid")
};

const expiryDateFormatIsValid = (field) => {
    const value = field.value;
    if (/^([1-9]|0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)) {
        return true;
    } else {
        return false;
    }
}

const detectCardType = (first4Digits) => {
    const firstDigit = first4Digits[0];
    const cardType = firstDigit == 4 ? 'is-visa' : firstDigit == 5 ? 'is-mastercard' : '';
    const creditCard = document.querySelector('[data-credit-card]');
    const cardTypeField = document.querySelector('[data-card-type]');
    if (cardType === 'is-visa') {
        creditCard.classList.add('is-visa');
        creditCard.classList.remove('is-mastercard');
        cardTypeField.src = supportedCards.visa;
        cardTypeField.style.height = '100%';
        creditTypeField.style.width = '100%';
    } else if (cardType === 'is-mastercard') {
        creditCard.classList.add('is-mastercard');
        creditCard.classList.remove('is-visa');
        cardTypeField.src = supportedCards.mastercard;
        cardTypeField.style.height = '100%';
        creditTypeField.style.width = '100%';
    } else {
        creditCard.classList.remove('is-mastercard');
        creditCard.classList.remove('is-visa');
        cardTypeField.src = "https://placehold.it/120x60.png?text=Card";
    }
    return cardType;
};

const validateCardExpiryDate = () => {
    const presentDate = new Date();
    const dateField = document.querySelector('[data-cc-info] input:nth-child(2)');
    const dateValue = dateField.value;
    let isValid = expiryDateFormatIsValid(dateField);
    if (isValid == true) {
        const cardMonth = Number(dateValue.split('/')[0]) - 1;
        const cardYear = Number(`20${dateValue.split('/')[1]}`);
        const cardDate = new Date(cardYear, cardMonth);
        isValid = cardDate > presentDate;
    }
    flagIfInvalid(dateField, isValid);
    return isValid;
};

const validateCardHolderName = () => {
    const nameField = document.querySelector('[data-cc-info] input:nth-child(1)');
    console.log(nameField.value);
    const isValid = /^[a-zA-Z]{3,}\s[a-zA-Z]{3,}$/.test(nameField.value);
    flagIfInvalid(nameField, isValid);
    return isValid;
};

const validateWithLuhn = (digits) => {
    let value = digits.join('');
    if (/[^0-9-\s]+/.test(value)) return false;
    let nCheck = 0,
        nDigit = 0,
        bEven = false;
    value = value.replace(/\D/g, '');
    for (let n = value.length - 1; n >= 0; n--) {
        const cDigit = value.charAt(n);
        let nDigit = parseInt(cDigit, 10);
        if (bEven) {
            if ((nDigit *= 2) > 9)
                nDigit -= 9;
        }
        nCheck += nDigit;
        bEven = !bEven;
    }
    return (nCheck % 10) == 0;
};

const validateCardNumber = () => {
    const cardInputs = appState.cardDigits.flat();
    const isValid = validateWithLuhn(cardInputs);
    const creditCardField = document.querySelector('[data-cc-digits]');
    if (isValid) {
        creditCardField.classList.remove('is-invalid');
    } else {
        creditCardField.classList.add('is-invalid');
    }
    return isValid;
};

const validatePayment = () => {
    validateCardNumber();
    validateCardHolderName();
    validateCardExpiryDate();
};

const acceptCardNumbers = (event, fieldIndex) => {

};

const smartCursor = (event, fieldIndex, fields) => {
    console.log(fields[fieldIndex].size)
    setTimeout(() => {
        if (fieldIndex < 3) {
            if (fields[fieldIndex].value.length == fields[fieldIndex].size)
                fields[fieldIndex + 1].focus();
        }
    }, 500)
};

const smartInput = (event, fieldIndex, fields) => {
    const e = event.key;
    const validCharacters = e == 'Backspace' || e == 'Tab' || e == 'Shift' || e == 'ArrowUp' || e == 'ArrowDown' || e == 'ArrowRight' || e == 'ArrowLeft';
    if (fieldIndex < 4) {
        if (!isFinite(e) && !validCharacters) {
            event.preventDefault();
        } else {
            const cardInputField = document.querySelector(`[data-cc-digits] input:nth-child(${fieldIndex + 1})`);
            let cardValue = cardInputField.value;
            const firstField = document.querySelector('[data-cc-digits] input:nth-child(1)').value.length;
            if (appState.cardDigits[fieldIndex] == undefined && isFinite(e)) {
                appState.cardDigits[fieldIndex] = [];
                appState.cardDigits[fieldIndex].push(e);
                const digits = appState.cardDigits[0];
                detectCardType(digits);
            } else if (isFinite(e)) {
                appState.cardDigits[fieldIndex].push(e);
            }
            setTimeout(() => {
                if (fieldIndex < 3 && isFinite(e)) {
                    cardInputField.value = cardInputField.value.substr(0, cardValue.length);
                    cardInputField.value += '#';
                };
                if (fieldIndex == 0) {
                    detectCardType(appState.cardDigits[0]);
                };
            }, 500);
            smartCursor(event, fieldIndex, fields);
        }
    } else if (fieldIndex == 4) {
        if (!validCharacters && !/^[a-zA-Z]$/.test(e) && event.code != 'Space') {
            event.preventDefault();
        } else {
            smartCursor(event, fieldIndex, fields);
        }
    } else if (fieldIndex == 5) {
        if (!validCharacters && !/^[0-9/]$/.test(e)) {
            event.preventDefault();
        } else {
            smartCursor(event, fieldIndex, fields);
        }
    }
};

const enableSmartTyping = () => {
    const cardInputOne = document.querySelector("[data-cc-digits] input:nth-child(1)");
    const cardInputTwo = document.querySelector("[data-cc-digits] input:nth-child(2)");
    const cardInputThree = document.querySelector("[data-cc-digits] input:nth-child(3)");
    const cardInputFour = document.querySelector("[data-cc-digits] input:nth-child(4)");
    const nameField = document.querySelector("[data-cc-info] input:nth-child(1)");
    const dateField = document.querySelector("[data-cc-info] input:nth-child(2)");
    const fields = [cardInputOne, cardInputTwo, cardInputThree, cardInputFour, nameField, dateField];
    fields.forEach((field, index, fields) => {
        field.addEventListener('keydown', (event) => {
            smartInput(event, index, fields)
        });
    })

};

const uiCanInteract = () => {
    firstInputField = document.querySelector("[data-cc-digits] > input:nth-child(1)");
    firstInputField.focus();
    payButtonField = document.querySelector("[data-pay-btn]");
    payButtonField.addEventListener('click', validatePayment);
    billHype();
    enableSmartTyping();
};

const displayCartTotal = ({
    results
}) => {
    const [data] = results;
    const {
        itemsInCart,
        buyerCountry
    } = data;
    appState.items = itemsInCart;
    appState.country = buyerCountry;
    appState.bill = itemsInCart.reduce((total, item) => {
        return total + (item.price * item.qty);
    }, 0);
    appState.billFormatted = formatAsMoney(appState.bill, appState.country);
    document.querySelector('[data-bill]').textContent = appState.billFormatted;
    appState.cardDigits = [];
    uiCanInteract();
}

const fetchBill = () => {
    const apiHost = 'https://randomapi.com/api';
    const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
    const apiEndpoint = `${apiHost}/${apiKey}`;
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(data => {
            displayCartTotal(data);
        })
        .catch(error => console.error(error))
};

const startApp = () => {
    fetchBill();
};

startApp();