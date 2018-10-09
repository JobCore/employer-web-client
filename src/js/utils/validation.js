import _validator from 'validator';

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

