"use strict";
exports.__esModule = true;
(function ($) {
    $.fn['carusel'] = function (options) {
        var html = "<div  class=\"p-carousel p-carousel-horizontal\">\n            <div class=\"p-carousel-content\">\n                <div class=\"p-carousel-container p-grid\">\n                <div class=\"p-col-1\">\n                    <button type=\"button\" pripple=\"\" class=\"p-ripple p-element ng-star-inserted p-carousel-prev p-link\"><span class=\"p-carousel-prev-icon pi pi-chevron-left\"></span><span class=\"p-ink\"></span></button>\n                </div>\n                <div class=\"p-carousel-items-content p-col-align-center p-col-10\">\n                    <div class=\"p-carousel-items-container p-m-auto\">\n                        <div class=\"p-carousel-item \">\n                            Works\n                        </div>\n                    </div>\n                </div>\n                <div class=\"p-col-1\">\n                <button type=\"button\" pripple=\"\" class=\"p-ripple p-element ng-star-inserted p-carousel-next p-link\"><span class=\"p-carousel-prev-icon pi pi-chevron-right\"></span><span class=\"p-ink\"></span></button>\n                </div>\n\n                </div>\n            </div>\n        </div>";
        var o = $(html);
        var opts = $.extend({
            items: []
        }, options);
        this.append(o);
        return this;
    };
}(jQuery));


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
            input.on('change', opts.onchange);
            if (opts.valor && value[0] == opts.valor) {
                input.attr('checked', 'checked');
            }
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
        var opts =  jQuery.extend({ onchange: function (e) {},  opciones:  [], nombre: '', valor: null }, _opts);
        renderizar_radiogroup(this, opts);

        return this;
    }

})($);