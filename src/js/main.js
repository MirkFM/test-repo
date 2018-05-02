import { setMask } from './module/mask';
import { isValid } from './module/validation';

const formSelector = '.js-form';
const fieldSelector = '.js-field';
const formCloseSelector = '.js-popup-close';

window.paymentSystemInfo = {};

function sendParentMessage(msg) {
  const { parent } = window;

  if (parent.postMessage) {
    parent.postMessage(msg, '*');
  }
}

function getParentMethod(method, params) {
  const posData = {
    method,
    params,
  };
  const message = JSON.stringify(posData);

  sendParentMessage(message);
}

const forms = document.querySelectorAll(formSelector);

for (let i = 0; i < forms.length; i += 1) {
  const form = forms[i];
  const elements = form.querySelectorAll(fieldSelector);

  for (let j = 0; j < elements.length; j += 1) {
    const field = elements[j];
    let input;

    if (field.tagName.toLowerCase() === 'input') {
      input = field;
    } else {
      input = field.querySelector('input');
    }

    if (input) {
      const dataType = input.getAttribute('data-type');

      setMask(input, dataType);

      input.addEventListener('focus', () => {
        field.classList.remove('error');
        field.classList.remove('valid');
        field.classList.add('focus');
      });

      input.addEventListener('blur', () => {
        field.classList.remove('focus');

        if (isValid(input.value, dataType, true)) {
          field.classList.add('valid');
        } else {
          field.classList.add('error');
        }
      });
    }
  }

  form.addEventListener('submit', (event) => {
    let error = 0;

    for (let j = 0; j < elements.length; j += 1) {
      const field = elements[j];
      let input;

      if (field.tagName.toLowerCase() === 'input') {
        input = field;
      } else {
        input = field.querySelector('input');
      }

      if (input) {
        const dataType = input.getAttribute('data-type');

        if (isValid(input.value, dataType, true)) {
          field.classList.add('valid');
        } else {
          event.preventDefault();
          event.stopPropagation();

          error += 1;

          field.classList.add('error');
        }
      }
    }

    if (!error) {
      event.preventDefault();
      event.stopPropagation();
      getParentMethod('popupPaymentDone', {});
    }
  });
}

window.addEventListener('changePaymentSystem', (event) => {
  const paymentSystemInfo = event.detail;

  const { name } = paymentSystemInfo;

  if (window.paymentSystemInfo.name !== name) {
    window.paymentSystemInfo = paymentSystemInfo;
  }
});

const btnCloseList = document.querySelectorAll(formCloseSelector);

for (let i = 0; i < btnCloseList.length; i += 1) {
  const btnClose = btnCloseList[i];

  btnClose.addEventListener('click', () => {
    getParentMethod('popupFormClose', {});
  });
}
