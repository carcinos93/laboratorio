
function tabla_plugin_proceso(proceso,id, col, value, tbl, onsucess = function (data) {}) {
    var spinner = null;
    if (apex.jQuery("#botones").length) { 
        spinner = apex.util.showSpinner("#botones");
    }

    apex.server.process(proceso, {
                x01: id,
                x02: col,
                x03: value,
                x04: tbl
            },{
            success: function (resp) {
                if (resp['mensaje']) {
                    onsucess(resp);
                }
                if (spinner) {
                    spinner.remove();
                }
            },
            error: function(err) {
                if (spinner) {
                    spinner.remove();
                }
            }
        }   
    );
}

(function (jQuery){

    
    var renderizar_opciones = function( opts)  {
        var contedor_radiogroup = $(`
        <div class="radio_group apex-item-group apex-item-group--rc apex-item-radio">        
            <div class="apex-item-grid radio_group">
            <div class='apex-item-grid-row'> </div>
        </div></div>`);
    
        opts.opciones.forEach(function (value, idx) {
    
            var opcion = $('<div class="apex-item-option"></div>');
            var input = $("<input/>");
            var id_input = opts.nombre + '_' + idx
            input.attr({
                'type':"radio",
                'name': opts.nombre,
                'id':id_input,
                'value': value[0]
            });
            if (value && opts.valor == value[0]) {
                input.attr('checked', 'checked');
            }
            input.on('change', opts.onchange);
            var label = $("<label class='u-radio' for='"+ id_input +"'></label>").text(value[1]); 
            opcion.append(input);
            opcion.append(label);
            contedor_radiogroup.find('.apex-item-grid-row').append(opcion);
        });
        return contedor_radiogroup;
        //contenedor.append(nuevo_contenedor);
    }

    var renderizar_radiogroup = function (el, opts) {
        var $this = el;
        // var contenedor = $this.find("div.lst_radio");
        $this.append( renderizar_opciones( opts ) );
        //var nuevo_contenedor_fila = nuevo_contenedor.find(".apex-item-grid-row")
     
    }
    jQuery['fn'].tabla_radiogroup = function (_opts) {
        var opts =  jQuery.extend({ onchange: function (e) {},  opciones:  [], nombre: '' }, _opts);
        renderizar_radiogroup(this, opts);

        return this;
    }

})(apex.jQuery);