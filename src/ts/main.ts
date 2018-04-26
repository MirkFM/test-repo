/* eslint func-names: ["error", "never"] */
/* eslint prefer-arrow-callback: "off" */

import * as $ from 'jquery';
import * as vanillaTextMask from 'vanilla-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

const maskPattern = {
  '#': /\d/,
  S: /[a-zA-Z ]/,
  W: /[-a-zA-Zа-я-А-Я0-9 ]/,
};

function prepareMaskArray(array) {
  const result = [];
  const patterns = Object.keys(maskPattern);
  for (let i = 0; i < array.length; i += 1) {
    const arrItem = array[i];
    if (typeof arrItem === 'string') {
      for (let j = 0; j < arrItem.length; j += 1) {
        const symbol = arrItem[j];
        if (patterns.indexOf(symbol) !== -1) {
          result.push(maskPattern[symbol]);
        } else {
          result.push(symbol);
        }
      }
    } else {
      result.push(arrItem);
    }
  }
  return result;
}

function phoneMask(rawValue) {
  const startSymbolPosition = rawValue.search(/[+1-9]/);
  const startSymbol = rawValue[startSymbolPosition];
  if (startSymbol === '8') {
    return prepareMaskArray(['8 (', /[1-9]/, '##) ###-##-##']);
  } else if (startSymbol === '+') {
    return prepareMaskArray(['+', /[1-79]/, ' (', /[1-9]/, '##) ###-##-##']);
  }
  return prepareMaskArray(['+7 (', /[1-9]/, '##) ###-##-##']);
}

function cardholderMask(rawValue) {
  const correctionValue = rawValue.replace(/[^a-zA-Z ]/gi, '');
  const resultArr = [];

  if (correctionValue) {
    resultArr.push(Array(correctionValue.length + 1).join('S'));
  }

  return prepareMaskArray(resultArr);
}

function cityMask(rawValue) {
  const correctionValue = rawValue.replace(/[^-a-zA-Zа-яА-Я0-9 ]/gi, '');
  const resultArr = [];

  if (correctionValue) {
    resultArr.push(Array(correctionValue.length + 1).join('W'));
  }

  return prepareMaskArray(resultArr);
}

function cvcMask() {
  return prepareMaskArray(['###']);
}

function cardnumberMask() {
  return prepareMaskArray(['#### #### #### ####']);
}

function expdateMask() {
  return prepareMaskArray(['## / ##']);
}

$(document).ready(function () {
  $('.b-card-form__field').each(function () {
    const $field = $(this);

    $('.b-card-form__input input', $field).focus(function () {
      $field.removeClass('error');
      $field.removeClass('valid');
      $field.addClass('focus');
    });

    $('.b-card-form__input input', $field).blur(function () {
      const $this = $(this);
      const value = String($this.val());
      $field.removeClass('focus');

      if (value === '' || value.indexOf('\u2000') !== -1) {
        $field.addClass('error');
      } else {
        $field.addClass('valid');
      }
    });
  });

  $('input.button').on('click', function () {
    $('.b-card-form__field').each(function () {
      const $field = $(this);
      $field.removeClass('error');
      $field.removeClass('valid');
      $field.removeClass('focus');
    });

    $('.container').fadeIn(500);
  });

  $('.s-header__button').on('click', function () {
    $('.container').fadeOut(500);
  });

  $('.js-cardnumber').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: cardnumberMask,
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-expdate').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: expdateMask,
      pipe: createAutoCorrectedDatePipe('dd / yy'),
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-cvc').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: cvcMask,
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-email').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: emailMask,
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-phone').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: phoneMask,
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-cardholder').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: cardholderMask,
      pipe(conformedValue) {
        return { value: conformedValue.toUpperCase() };
      },
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  $('.js-city').each(function () {
    const elem = this;

    vanillaTextMask.maskInput({
      inputElement: elem,
      mask: cityMask,
      guide: true,
      placeholderChar: '\u2000',
    });
  });

  try {
    $('.b-card-form__form').on('submit', function (e) {
      let errors = 0;

      $('.b-card-form__input input').each(function () {
        const $this = $(this);
        const $field = $this.parents('.b-card-form__field');
        const value = String($this.val());

        if (value === '' || value.indexOf('\u2000') !== -1) {
          $field.addClass('error');
          errors = 1;
        } else {
          $field.addClass('valid');
        }
      });

      if (errors) {
        e.preventDefault();
        // return false;
      } else {
        e.preventDefault();
        $('.result').fadeIn(500);
        $('.container').fadeOut(500);
      }
    });
  } catch (err) {
    console.log(err);
  }
});
