
/*** contador */
var contador = 0;
/** indica si debe iniciarse el contador */
var iniciar_contador = false;


function cargar_guardado_automatico() {
    (function (jQuery){
        var excluir = ['HIDDEN', 'DISPLAY_ONLY'];
        for (var indice in apex.items) {
            var campo = apex.items[indice];
            /** se decarta los campos display_only  */
            var funcion = function (e) {
                /**campo que tiene la ultima ubicacion */
                jQuery("input[name*='ULTIMA_UBICACION']").val( e.target.id ); 
                apex.submit({request:'btnGuardar',validate:true});
                //contador = 0; 
                //iniciar_contador = true;
            }
            if (!excluir.join(" ").includes(campo.item_type)) {
                campo.element.on('change', funcion);
                /** si es campo de texto */
               /* if ("INPUT TEXTAREA".includes(campo.node.targName.toUpperCase())) {
                    campo.element.on('keypress', funcion);
                } else  {
                    campo.element.on('change', funcion);
                }*/
                /*** evento para keyup */
                /*** si evento scroll */
            }
        }
        var ultima_ubicacion = jQuery("input[name*='ULTIMA_UBICACION']");
    
        if (ultima_ubicacion.val() && ultima_ubicacion.val() != "") {
            var ultimo_campo = jQuery("#" + ultima_ubicacion.val());
            var posicionCentrada = ultimo_campo.offset().top - (jQuery(window).height() / 2) + (ultimo_campo.height() / 2);
            jQuery([document.documentElement, document.body]).animate({
                scrollTop: posicionCentrada
            }, 1000);
    }
    })(apex.jQuery);
    
    /*setInterval(function () {
        if (iniciar_contador) {
            contador += 1;
        }
        if (contador >= 30 ) {
            contador = 0;
            apex.submit({request:'btnGuardar',validate:false});
        }
    }, 1000 );*/
    
}


