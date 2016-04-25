'use strict';
var mongoose = require('mongoose');

var csvSchema = new mongoose.Schema ({
  nombre: String,
  datos:  String
});

const datosCsv = mongoose.model("csv", csvSchema);

// Guardar datos del csv
const guardarCsv = (nombre, datos) => {
  // Conectamos con mongo
  mongoose.connect ('mongodb://localhost/csv');
  var query = new datosCsv({ 'nombre': nombre, 'datos': datos});
  return query.save ((err) => {
            // En caso de error
            if (err) { console.log("Error al guardar:\n" + err); }
        }).then ((valor) => {
            // cerramos la conexion
            mongoose.connection.close ();
        });
};

// Actualizar datos del csv
const actualizarCsv = (nombre, datos) => {
  // Conectamos con mongo
  mongoose.connect ('mongodb://localhost/csv');
    /*
  var query = { 'nombre': nombre };
  return datosCsv.update (query, {'datos': datos}, (err) => {
            // En caso de error
            if (err) { console.log("Error al actualizar:\n" + err); }
        }).then ((valor) => {
            // cerramos la conexion
            mongoose.connection.close ();
        });
   */     
  datosCsv.findOne({ 'nombre': nombre }, function (err, doc) {
      // En caso de error
      if (err) { console.log(`Error durante la consulta:\n${err}`); }
      if (!doc) {
        // Guardamos como nuevo
        let cerrar = mongoose.connection.close ();
        Promise.all([cerrar]).then( (value) => { 
            guardarCsv(nombre, datos);
        });
      } else {
        // Actualizamos
        doc.datos = datos;
        doc.save();
      }
    }).then ((valor) => {
        mongoose.connection.close ();
    });
};

// Obtener un csv por su nombre
const obtenerCsv = (nombre) => {
    // Conectamos con mongo
    mongoose.connect('mongodb://localhost/csv');
    // Realizamos la consulta y devolvemos el resultado
    return datosCsv.findOne({ 'nombre': nombre }, (err, doc) => {
            // En caso de error
            if (err) { console.log(`Error durante la consulta:\n${err}`); }
        }).then ((valor) => {
            mongoose.connection.close ();
            return valor.datos
        });
};
    
// Obtener nombres de csv almacenados
const obtenerCsvs = () => {
    return datosCsv.find({}, (err, doc) => {
            if (err) { console.log(`Error durante la consulta:\n${err}`); }
        }).then((valor) => {
            mongoose.connection.close ();
            return valor;
            //return valor.map((obj) => { return obj.nombre; });
        });
};

module.exports = {guardarCsv, obtenerCsv, obtenerCsvs, actualizarCsv};