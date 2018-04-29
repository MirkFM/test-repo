import dayjs from 'dayjs';

export const validationPreset = {
  cardholder(rawValue, isRequired) {
    const value = rawValue.trim();

    if (value !== '') {
      const rule = /^[a-z](.+?) [a-z](.+?)$/i;
      return rule.test(value);
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  cardnumber(rawValue, isRequired) {
    const value = rawValue.replace(/\D/g, '');
    let valueRangeList = [14, 15, 16, 17, 18, 19];

    if (window.paymentSystemInfo.cardLength) {
      valueRangeList = window.paymentSystemInfo.cardLength;
    }

    if (value !== '') {
      if (valueRangeList.indexOf(value.length) === -1) {
        return false;
      }

      let nCheck = 0;
      let nDigit = 0;
      let bEven = false;

      for (let n = value.length - 1; n >= 0; n -= 1) {
        const cDigit = value.charAt(n);
        nDigit = parseInt(cDigit, 10);

        if (bEven) {
          if ((nDigit *= 2) > 9) nDigit -= 9;
        }

        nCheck += nDigit;
        bEven = !bEven;
      }

      return nCheck % 10 === 0;
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  city(rawValue, isRequired) {
    const value = rawValue.trim();

    if (value !== '') {
      const rule = /.+?/;
      return rule.test(value);
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  cvc(rawValue, isRequired) {
    const value = rawValue.trim();

    if (value !== '') {
      const rule = /[0-9]{3,4}/;
      return rule.test(value);
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  email(rawValue, isRequired) {
    const value = rawValue.trim();

    if (value !== '') {
      const rule = /^[-a-z0-9_]+(?:[+.][-a-z0-9_]+)*@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([-a-z0-9]+\.)+))([a-z]{2,6}|[0-9]{1,3})(\]?)$/i;
      return rule.test(value);
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  expdate(rawValue, isRequired) {
    const value = rawValue.trim();
    const currentDate = dayjs()
      .set('date', 1)
      .set('hour', 0)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0);

    const minDate = dayjs(currentDate).add(-1, 'millisecond');

    const maxDate = dayjs(currentDate)
      .add(5, 'year')
      .add(1, 'month');

    if (value !== '') {
      const rule = /[^0-9]+/;

      const expDateList = value.split(rule);
      const month = Number(expDateList[0]);
      const year = Number(expDateList[1]);

      if (month === 0) {
        return false;
      }

      if (year === 0) {
        return false;
      }

      const expDate = dayjs(`20${year}-${month}-01`);

      if (expDate.isAfter(minDate) && expDate.isBefore(maxDate)) {
        return true;
      }

      return false;
    }

    if (isRequired) {
      return false;
    }

    return true;
  },

  phone(rawValue, isRequired) {
    const value = rawValue.replace(/\D/g, '');

    if (value !== '') {
      const rule = /[0-9]{9,12}/;
      return rule.test(value);
    }

    if (isRequired) {
      return false;
    }

    return true;
  },
};

export function isValid(value, valueType, isRequired) {
  const validationPresetKeys = Object.keys(validationPreset);

  if (validationPresetKeys.indexOf(valueType) !== -1) {
    return validationPreset[valueType](value, isRequired);
  }

  return true;
}
