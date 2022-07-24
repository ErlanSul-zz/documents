import express from 'express';
import * as lodash from 'lodash';
import * as moment from 'moment';

export const getUserSession = (req: express.Request): Express.User => {
  if (
    req.session !== undefined &&
    req.session.passport !== undefined &&
    req.session.passport.user !== undefined
  ) {
    return req.session.passport.user;
  } else {
    return null;
  }
};

export const cuttingCharactersAndCapitalize = (
  value: string,
  alsoCutDigits = false,
): string => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (alsoCutDigits) {
    value = value.replace(/[^a-zA-Z\s]+/gi, ''); // Leave only letters and spaces
  } else {
    value = value.replace(/[^0-9a-zA-Z\s]+/gi, ''); // Leave only letters, digits and spaces
  }

  value = value.trim();

  return value
    .replace(/\s\s+/gi, ' ') // Leave only one space
    .split(' ')
    .map(lodash.capitalize)
    .join(' '); // Capitalize for every word
};

export const stringToDate = (date: string): Date | null => {
  if (moment(date, 'DD.MM.YYYY').isValid()) {
    return moment(date, 'DD.MM.YYYY').toDate();
  } else {
    return null;
  }
};

export const cardDateCheck = (date: string): Date | null => {
  const dateCard = moment(date, 'MM.YY');
  const currentDate = moment().format();

  if (
    moment(date, 'MM.YY').isValid() &&
    moment(currentDate).isBefore(dateCard)
  ) {
    return moment(date, 'MM.YY').toDate();
  } else {
    return null;
  }
};

export const cardNumber = (str: string): string => {
  if (str === undefined || str === null) {
    return str as undefined | null;
  }
  return str.replace(/[^\d]/g, '');
};

export const queryArrayStringTransform = (
  value: string | string[],
): string[] => {
  if (value === undefined) {
    return null;
  } else if (Array.isArray(value)) {
    return value;
  } else if (typeof value === 'string') {
    return value.split(',');
  }
  return null;
};

export const capitalizeTransform = (value: string): string => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  value = value.trim().replace(/\s\s+/gi, ' '); // Leave only one space

  return lodash.upperCase(value);
};
