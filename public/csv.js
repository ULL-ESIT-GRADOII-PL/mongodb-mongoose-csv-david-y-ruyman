// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => {
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows }));
};

/* Volcar en la textarea de entrada
 * #original el contenido del fichero fileName */
const dump = (fileName) => {
  $get(fileName, function (data) {
    $("#original").val(data);
  });
};

var csvActual = 'Personalizado';

const cargarArchivo = (name) => {
  $.get("/datos/" + name, {}, (data) => {
    csvActual = name;
    $("#original").val(data.datos);
   }, 'json')
}
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.target.files;

  var reader = new FileReader();
  reader.onload = (x) => {
    $("#original").value(x.target.result);
  };

  reader.readAsText(files[0]);
}

/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files;

  var reader = new FileReader();
  reader.onload = (e) => {

    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "yellow";
}

$(document).ready(() => {
    let original = document.getElementById("original");
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }

    /* Request AJAX para que se calcule la tabla */
    $("#parse").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv",
          { textocsv: original.value },
          fillTable,
          'json'
        );
    });

    /* Boton guardar */
    $("#save").click( () => {
      $.get("/actualizarcsv",
        { nombre: csvActual, textocsv: original.value }
      );
    });
  
   /* botones para rellenar el textarea */
   
   $.get("/listadatos", {}, (datos) => {
      datos.lista[0].forEach((element, index) => {
        $("#" + element[0]).click(() => {
          cargarArchivo (element[0]);
      });
   }, 'json')
  });
  /*
  $("#input1").click(() => {
      cargarArchivo ("input");
  });
  $("#input2").click(() => {
      cargarArchivo ("input2");
  });
  $("#input3").click(() => {
      cargarArchivo ("input3");
  });
  $("#Personalizado").click(() => {
      cargarArchivo ("Personalizado");
  });
  */
    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
