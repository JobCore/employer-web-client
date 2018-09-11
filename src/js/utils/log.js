export default {
    error: (error) => (process.env.DEBUG == 'true') ? console.error(error) : '',
    info: (text) => (process.env.DEBUG == 'true') ? console.log(text) : ''
};