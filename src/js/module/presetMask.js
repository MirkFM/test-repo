import * as vanillaTextMask from 'vanilla-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

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
      const correctionValue = rawValue.replace(/[^a-zA-Z ]/gi, '');
      const resultArr = [];

      if (correctionValue) {
        resultArr.push(Array(correctionValue.length + 1).join('S'));
      }

      return prepareMaskArray(resultArr);
    },
    pipe(conformedValue) {
      return { value: conformedValue.toUpperCase() };
    },
  },

  cardnumber: {
    mask() {
      return prepareMaskArray(['#### #### #### ####']);
    },
    pipe: null,
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
  },

  cvc: {
    mask() {
      return prepareMaskArray(['###']);
    },
    pipe: null,
  },

  email: {
    mask(rawValue, config) {
      return emailMask.mask(rawValue, config);
    },
    pipe: null,
  },

  expdate: {
    mask() {
      return prepareMaskArray(['## / ##']);
    },
    pipe(conformedValue) {
      const pipeFunction = createAutoCorrectedDatePipe('mm / yy');

      return pipeFunction(conformedValue);
    },
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
  },
};

export function setMask(element, maskName) {
  const presetMaskKeys = Object.keys(presetMask);

  if (presetMaskKeys.indexOf(maskName) !== -1) {
    vanillaTextMask.maskInput({
      inputElement: element,
      mask: presetMask[maskName].mask,
      pipe: presetMask[maskName].pipe,
      guide: true,
      placeholderChar: '\u2000',
    });
  }
}
