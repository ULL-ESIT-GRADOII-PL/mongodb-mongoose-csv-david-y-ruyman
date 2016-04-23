"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/csv');
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

const calculate = require('./models/calculate');

app.get('/', (request, response) => {     
  response.render ('index', { title: "CSV Analyzer"} );
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.textocsv) });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});

// Guardar datos
app.get('/guardarcsv', function(request, response) {
  mongoose.connect('mongodb://localhost/csv');
  
  let dato = new datosCsv({"nombre":"ejemplo1", "datos": request.query.textocsv});
  let p1 = dato.save(function (err) {
    if (err) { console.log(`Error al guardar:\n${err}`); return err; }
  });
  
  Promise.all([p1]).then( (value) => { 
    mongoose.connection.close(); 
  });
});

// Obtener un dato de la base de datos
app.get('/datos/:ejemplo', function(request, response) {
  mongoose.connect('mongodb://localhost/csv');
  var query = datosCsv.findOne({ 'nombre': request.params.ejemplo });
  mongoose.connection.close(); 
  response.send(query || '');
});

// Obtener todos los datos almacenados
app.get('/listadatos', function(req, res) { 
  mongoose.connect('mongodb://localhost/csv');
  var query = datosCsv.find({});
  mongoose.connection.close(); 
  res.send(query);
});