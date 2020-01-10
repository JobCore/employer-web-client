# Hello World with React + Flux

This boilerplate is intended for 4Geeks Academy students when doing projects with React.js using Flux.

## Installation

##### 1. Make sure you have node 10

##### 2. Create a .env based on the .env.example

##### 3. Add the host to your scripts.build inside the package.json
```
"start": "API_HOST=<your host here> bash -c 'webpack-dev-server  --config webpack.dev.js --open --port 3000'",
```

##### 3. Install the npm dependencies:
```
$ npm install
```
That is it! 


## To publish into now (zeit):

1) Download the now cli: `$ npm i now -g`
2) Login into now: `$ now login`
3) Run the deploy command
```
$ npm run deploy:test
```
Note: you have to be logged into now
