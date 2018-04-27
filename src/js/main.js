import { setMask } from './module/presetMask';

const fieldSelector = '.js-field';
const elements = document.querySelectorAll(fieldSelector);

function valid(field, validType) {
  return false;
}

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

      if (valid(input, dataType)) {
        field.classList.add('valid');
      } else {
        field.classList.add('error');
      }
    });
  }
}
