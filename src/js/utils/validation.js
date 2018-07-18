import _validator from 'validator';

export const validator = _validator;
export const ValidationError = function(msg){
    this.validation = true;
    this.message = msg;
};
