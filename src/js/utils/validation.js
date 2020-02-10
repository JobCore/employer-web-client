import _validator from 'validator';
import { snakeCase } from 'snake-case';

export const validator = _validator;
export const ValidationError = function(msg){
    this.validation = true;
    this.message = msg;
};

export function onlyLetters(value)
{
    var letters = /^[A-Za-z]+$/;
    if(value.match(letters)) return true;
    else return false;
}

export const normalizeToSnakeCase = (map) => {
    const entries = Object.entries(map);
    const newMap = {};
    entries.forEach(([key, value]) => {
      newMap[snakeCase(key)] = value;
    });
    return newMap;
  };

