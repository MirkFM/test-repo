import * as vanillaTextMask from 'vanilla-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

import { getPaymentSystem } from './paymentSystem';

export const maskPattern = {
  '#': /\d/,
  S: /[a-zA-Z ]/,
  W: /[-a-zA-Zа-я-А-Я0-9 ]/,
};

export function prepareMaskArray(array) {
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

export const presetMask = {
  cardholder: {
    mask(rawValue) {
      const correctionValue = rawValue.replace(/[^a-z ]/gi, '');
      const resultArr = [];

      if (correctionValue) {
        resultArr.push(Array(correctionValue.length + 1).join('S'));
      }

      return prepareMaskArray(resultArr);
    },
    pipe(conformedValue) {
      return { value: conformedValue.toUpperCase() };
    },
    guide: true,
    placeholderChar: '\u2000',
  },

  cardnumber: {
    mask(rawValue) {
      const correctionValue = rawValue.replace(/[^\d]/gi, '');
      const paymentSystemInfo = getPaymentSystem(correctionValue);
      const inputCardLength = correctionValue.length;
      let maskNumLength = 19;

      if (paymentSystemInfo) {
        const cardLengthList = paymentSystemInfo.cardLength;

        for (let i = cardLengthList.length - 1; i >= 0; i -= 1) {
          const cardLengthSize = cardLengthList[i];

          if (cardLengthSize >= inputCardLength) {
            maskNumLength = cardLengthSize;
          }
        }

        if (cardLengthList.indexOf(maskNumLength) === -1) {
          maskNumLength = cardLengthList[cardLengthList.length - 1];
        }
      }

      switch (maskNumLength) {
        case 14:
          return prepareMaskArray(['#### ##### #####']);

        case 15:
          return prepareMaskArray(['##### ##### #####']);

        case 16:
          return prepareMaskArray(['#### #### #### ####']);

        case 17:
          return prepareMaskArray(['#### #### #### #####']);

        case 18:
          return prepareMaskArray(['#### #### #### #### ##']);

        default:
          return prepareMaskArray(['#### #### #### #### ###']);
      }
    },
    pipe: null,
    guide: true,
    placeholderChar: '\u2000',
  },

  city: {
    mask(rawValue) {
      const correctionValue = rawValue.replace(/[^-a-zA-Zа-яА-Я0-9 ]/gi, '');
      const resultArr = [];

      if (correctionValue) {
        resultArr.push(Array(correctionValue.length + 1).join('W'));
      }

      return prepareMaskArray(resultArr);
    },
    pipe: null,
    guide: true,
    placeholderChar: '\u2000',
  },

  cvc: {
    mask() {
      let valueRangeList = [3];

      if (window.paymentSystemInfo.cvcLength) {
        valueRangeList = window.paymentSystemInfo.cvcLength;
      }

      const maskNumLength = valueRangeList[valueRangeList.length - 1];

      switch (maskNumLength) {
        case 3:
          return prepareMaskArray(['###']);

        default:
          return prepareMaskArray(['####']);
      }
    },
    pipe: null,
    guide: true,
    placeholderChar: '\u2000',
  },

  email: {
    mask(rawValue, config) {
      return emailMask.mask(rawValue, config);
    },
    pipe: null,
    guide: true,
    placeholderChar: '\u2000',
  },

  expdate: {
    mask() {
      return prepareMaskArray(['## / ##']);
    },
    pipe(conformedValue) {
      const pipeFunction = createAutoCorrectedDatePipe('mm / yy');

      return pipeFunction(conformedValue);
    },
    guide: true,
    placeholderChar: '\u2000',
  },

  phone: {
    mask(rawValue) {
      const startSymbolPosition = rawValue.search(/[+1-9]/);
      const startSymbol = rawValue[startSymbolPosition];

      if (startSymbol === '8') {
        return prepareMaskArray(['8 (', /[1-9]/, '##) ###-##-##']);
      } else if (startSymbol === '+') {
        return prepareMaskArray(['+', /[1-79]/, ' (', /[1-9]/, '##) ###-##-##']);
      }
      return prepareMaskArray(['+7 (', /[1-9]/, '##) ###-##-##']);
    },
    pipe: null,
    guide: true,
    placeholderChar: '\u2000',
  },
};

export function setMask(element, maskName) {
  const presetMaskKeys = Object.keys(presetMask);

  if (presetMaskKeys.indexOf(maskName) !== -1) {
    vanillaTextMask.maskInput({
      inputElement: element,
      mask: presetMask[maskName].mask,
      pipe: presetMask[maskName].pipe,
      guide: presetMask[maskName].guide,
      placeholderChar: presetMask[maskName].placeholderChar,
    });
  }
}
