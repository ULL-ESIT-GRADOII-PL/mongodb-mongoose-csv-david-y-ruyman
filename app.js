"use strict";

const express = require('express');
const app = express();
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

const calculate = require('./models/calculate');
const mongoConexion = require('./models/conexionMongo.js');

app.get('/', (request, response) => {     
  response.render ('index', { title: "CSV Analyzer"} );
});

app.get('/csv', (request, response) => {
  response.send({ "rows": calculate(request.query.textocsv) });
});

app.listen(app.get('port'), () => {
    console.log(`Node app is running at localhost: ${app.get('port')}` );
});

// Obtener la lista de datos almacenados en la BD
app.get('/listadatos', (request, response) => {
    let query = mongoConexion.obtenerCsvs ();
    Promise.all([query]).then( (value) => { 
      response.send({ 'lista': value });
    });
});

// Obtener un dato de la base de datos
app.get('/datos/:ejemplo', (request, response) => {
    let query = mongoConexion.obtenerCsv (request.params.ejemplo);
    Promise.all([query]).then( (value) => { 
      response.send({ 'datos': value });
    });
});

// Guardar un csv en la BD
app.get('/guardarcsv', (request, response) => {
    let query = mongoConexion.guardarCsv(request.query.nombre, request.query.textocsv);
    Promise.all([query]).then( (value) => { 
      response.send({ 'save': '1' });
    });
});

// Actualizar un csv en la BD
app.get('/actualizarcsv', (request, response) => {
    let query = mongoConexion.actualizarCsv(request.query.nombre, request.query.textocsv);
    Promise.all([query]).then( (value) => { 
      response.send({ 'update': '1' });
    });
});