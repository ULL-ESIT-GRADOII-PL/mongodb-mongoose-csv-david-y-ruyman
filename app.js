"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/csv');
var csvSchema = new mongoose.Schema({
  nombre: String,
  datos:  String
});
const datosCsv = mongoose.model("csv", csvSchema);

app.set('port', (process.env.PORT || 5000));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.static(__dirname + '/public'));

const calculate = require('models/calculate');

app.get('/', (request, response) => {     
  response.render ('index', { title: "CSV Analyzer"} );
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.textocsv) });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});

// Consulta de datos
app.get('/datos/:ejemplo', function(req, res) { 
  var query = datosCsv.findOne({ 'nombre': req.params.ejemplo });
  res.send(query || '');
});