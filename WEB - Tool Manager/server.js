const express = require('express');
const routes = require('./routes');

const app = express();

const args = process.argv.slice(2)

app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));
app.use('/ToolManager', express.static('public'));

// EJS
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use(routes);


const PORT = args[1] || 3001;
const HOST = args[0] || 'localhost';

app.listen(PORT, HOST, () => console.log(`Acesse: http://${HOST}:${PORT}/ToolManager`));