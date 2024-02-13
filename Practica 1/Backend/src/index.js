const app = require('./app')
port = 5000
app.listen(port, () => {
    console.log(`Servidor Express en http://localhost:${port}`);
  });