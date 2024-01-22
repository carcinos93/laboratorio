/// <reference types="orclapex-js" />
function campo_onchange(el) {

}

function renderizar_radiogroup(el: JQuery, index: number) {
    var $this = el;
    var contenedor = $this.find("div.lst_radio");

    var nombre = contenedor.data('nombre');
    var nuevo_contenedor = $(`
        <div class="radio_group apex-item-group apex-item-group--rc apex-item-radio">        
            <div class="apex-item-grid radio_group">
            <div class='apex-item-grid-row'> </div>
        </div></div>`);
    var items = apex.item( contenedor.data("lista_valores"))
    .getValue()
    .split(";")
    .map(function (v) {
                var v_arr = v.split("=");
            return v_arr;
        });;

    var nuevo_contenedor_fila = nuevo_contenedor.find(".apex-item-grid-row")
    items.forEach(function (value, idx_1) {

        var opcion = $('<div class="apex-item-option"></div>');
        var input = $("<input/>");
        var id_input = nombre + '_' + index.toString() + '_' + idx_1.toString()
        input.attr({
            'type':"radio",
            'name': nombre + '_' + + index.toString(),
            'id':id_input,
            'value': value[1]
        });
        input.on('change', campo_onchange);
        var label = $("<label class='u-radio' for='"+ id_input +"'></label>").text(value[0]);  
        opcion.append(input);
        opcion.append(label);
        nuevo_contenedor_fila.append(opcion);
    });
    contenedor.append(nuevo_contenedor);
}
function inicializar_examenes(id_tabla) {
    apex.item(id_tabla).element.find("tbody tr .campo").each(function (i, elem) {
         var $elem: JQuery = apex.jQuery(elem) ;
         if ($elem.hasClass('lst_radio')) {
            renderizar_radiogroup( $elem, i );
         }

    });
}
    


$("#descripcion").on('paste', function (e) {
    var el = $(this);
    setTimeout(function () {
      var valor = el.val().toString().split(" ");
      var nuevo = "";
      if (valor.length>= 5) {
    
      }
      el.val( )
    });
  });