import { setMask } from './module/mask';
import { isValid } from './module/validation';

const formSelector = '.js-form';
const fieldSelector = '.js-field';

window.paymentSystemInfo = {};

const form = document.querySelector(formSelector);
const elements = form.querySelectorAll(fieldSelector);

for (let i = 0; i < elements.length; i += 1) {
  const field = elements[i];
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

window.addEventListener('changePaymentSystem', (event) => {
  const paymentSystemInfo = event.detail;

  const { name } = paymentSystemInfo;

  if (window.paymentSystemInfo.name !== name) {
    window.paymentSystemInfo = paymentSystemInfo;
    console.log('paymentSystemName', name);
  }
});
