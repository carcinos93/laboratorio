/// <reference types="orclapex-js" />

function permisos_rol() {
    var permiso = apex.jQuery("input[name*='PERMISO']");
    if (permiso.val() == "0") {
        apex.jQuery("button").each(function (e) {
            var $el = jQuery(this);
            $el.attr('disabled',  'disabbled');
        })
    }   
}
/**https://stackoverflow.com/questions/47536208/removing-pseudo-element-after-using-jquery */

/**
 * Funcion que simula la agrupación de controles tipo radio, i
 * @param {*} item Campo tipo radiogroup
 * @param {*} valores Indica que opciones del radiogroup apareceran como encabezado
 */
function modificar_radio_group(item, valores = {}) {
    var campo = apex.item(item);
    var opciones = campo.element.find('.apex-item-option');
    opciones.each(function (index, el) {
        /** se verifica si el item esta especificado  */
        config = valores[el.innerText.trim()]
        var $this = apex.jQuery(el);
        if (config) {
            if (config.ocultar) {
                /** se oculta el input el input y se le desactiva el evento clic a la etiqueta */
                $this.find('input').hide();
                $this.find('label').addClass('remover-before').css({'pointer-events': 'none'});
            }

        } else {
            /** item que no sido especificado como titulo se espciara hacia la izquierda */
            $this.css({'padding-left': '35px'});
        }
    });
}   

modificar_radio_group('P17_DESTINO', {'INGRESO A NEONATOLOGÍA': { ocultar: true } ,
                                    'REFERENCIA A OTRO HOSPITAL': { ocultar: true },
                                    'ALOJAMIENTO CONJUNTO SANOS': { ocultar: false },
                                    'CUIDADOS MINIMOS EN ALOJAMIENTO CONJUNTO':  {ocultar: false}});




                                    /**
 * Funcion que deja en solo lectura ciertos campos
 * @param {*} excluir_campos 
 * @param {*} fnc 
 * @author Nelson Rodas
 */
function deshabilitar_campos(habilitar, excluir_campos = [], incluir_campos = [], fnc = function (e) { return true; }) {
    /**
     * 
     */
    var items = [];
    if (excluir_campos.length) {
      items =   Object.entries(apex.items).filter((v, i) => excluir_campos.filter((v1) => v1 == v[0]).length == 0 ).map((v) => v[0]);
    } else if (incluir_campos.length) {
        items = incluir_campos;
    } else {
        items = Object.entries(apex.items).map((v) => v[0]);
    } 

    for (var i in items) {
        var indice = items[i];
        if (excluir_campos && excluir_campos.filter((v, i) => { return v == indice }).length > 0) {
            continue;   
        }
        var campo = apex.item(indice);
        if (habilitar) { 
            campo.element.removeClass('apex_disabled');
        } else {
            campo.element.addClass('apex_disabled');
        }

        if (campo.node.tagName.toLowerCase() == 'select' || campo.item_type == 'RADIO_GROUP') {
            campo.element.css({'pointer-events': habilitar ? 'auto' : 'none' });
        } else if ( "input textarea".includes(campo.node.tagName.toLowerCase())) { 
            if (habilitar ) {
                campo.element.removeAttr('readonly');
            } else {
                campo.element.attr('readonly', 'readonly');
            }
         
        }
    }
}


function agregar_quitar_boton(nombre) {
    var campos = typeof nombre == "string" ? [nombre] : nombre;

    campos.forEach(function (v, i) {
        var campo = apex.item(v);
        var fila = campo.element.find(".apex-item-grid-row");
        
        var quitar_elemento = apex.jQuery(`<div class="apex-item-option"><span aria-hidden="true"> Desmarcar</span></div>`);
        quitar_elemento.find("span")
        .addClass("fa fa-remove")
        .css({'font-size': '0.8rem', 'line-height': '1.6rem', 'cursor': 'pointer' })
        .on('click', function (e) {
            campo.setValue(null);
        });
    
        fila.append(quitar_elemento);
    });

}

for (var indice in apex.items) {
    if (apex.item(indice).item_type != 'RADIO_GROUP') {
        continue;
    }

    var item = apex.item(indice);
    /** e */
    item.element.find('.u-radio').each(function (i, el) {
        var $this = apex.jQuery(this);
            $this.on('click', function (e) { 
            // console.log(apex.items.P8_APGAR_MINUTO1.getValue().length && $this.prev().val() == apex.items.P8_APGAR_MINUTO1.getValue());
            
            /*** Si el elemento que ejecuto evento click es igual al valor actual 
             * se tomara como accion de desmarcar
             * la asignacion del valor aparentemente lo maneja el label asi que se busca el elemento anterior que el input que 
             * contiene el valor
             * <input value="valor" />
             * <label class='u-radio'>
            */
            if (item.getValue().length && $this.prev().val() == (item.getValue()) {
                /** se debe evitar que asigne porque se estaria quitando el valor */
                e.preventDefault();
                item.setValue(null);
            }
        });
    }) 
}

