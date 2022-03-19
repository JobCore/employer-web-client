const proxy = require("http-proxy-middleware");

module.exports = app => {
  app.use(
    "/api",
    proxy({
      target: process.env.REACT_APP_API_HOST || "http://localhost:8000",
      changeOrigin: true
    })
  );
};

// este file se creo con el fin de hacer correr el sample de stripe y solo se conserva a fin de referencia