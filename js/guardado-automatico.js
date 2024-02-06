
/*** contador */
var contador = 0;
/** indica si debe iniciarse el contador */
var iniciar_contador = false;

var g_campos = [];

/**
 * Funcion que devuelve una cadena en formato x01...x02...x10 etc
 * @param {number} i 
 * @returns string
 */
function generador_id(i) {
    var n = '0' + i.toString()
    var id = 'x' + n.substring(n.length - 2) ;
    return id;
}

/**
 * Funcion que envia por ajax los campos que ha sido modificado
 * @param {string} pId 
 * @param {string} pProceso 
 * @returns undefined
 */
function enviar_datos(pId,pProceso) {
    if (g_campos.length==0) {
        return;
    }
    /** se toman los primeros 3 campos */
    var campos_enviar = [...g_campos ].filter(function (v, i) { return i < 3 });
    var data = { pageItems: "#" + pId };

    var indice = 0;
    campos_enviar.forEach(function (v, i) {
        var item = apex.item(v);
        data[ generador_id(++indice) ] = v; // x01: P1_CAMPO;
        if (Array.isArray(item.getValue())) {
            data[ generador_id(++indice) ] = item.getValue().join( item.separator ?? ";" );
        } else {
            data[ generador_id(++indice) ] = item.getValue() // x02: Valor de P1_CAMPO;
        }


    });

    ///var v_refreshObject = campos_enviar.map((v) => "#" + v ).join(",");
    var spinner = null;
    if (apex.jQuery("#botones").length) { 
        spinner = apex.util.showSpinner("#botones");
    }

    apex.server.process(pProceso, data,{
            success: function (resp) {
                if (resp['mensaje']) {
                    /**se filtra la cola de campos dejando solo lo que no han sido enviados */
                    g_campos = g_campos.filter(function (v, i) {

                        return !campos_enviar.find((v1,i1) => v1 == v);
                    });
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
/**
 * Funcion que devuelve si el campo cumple con todas las validaciones
 * @param {string} pCampo 
 * @param {Array} pValidaciones 
 * @returns boolean
 */
function validar_campo(pCampo, pValidaciones) {
    
    var campo = apex.item(pCampo);
    var campo_valido = true;
    if (pValidaciones) {
        
        pValidaciones.forEach(function (v, i)  {
            var metodo = null;
            if (typeof v.metodo == "function") {
                metodo = v.metodo;
            } else  {
                /**Para ejecutar una funcion definida como global */
                if (typeof window[metodo] == "function") {
                    metodo = window[metodo];
                }   
            }
            if (metodo != null) {
                var valido = metodo(campo);
                console.log(campo.getValue(), valido);
                if (!valido) {
                    apex.message.clearErrors();
                    apex.message.showErrors([{
                        'location': 'inline',
                        'message': v.mensaje,
                        'pageItem': pCampo
                    }]);
                }
                campo_valido &= valido;
            }
        });
    }
    if (campo_valido) {
        apex.message.clearErrors();
    }
    return campo_valido;
}


function campo_onkeyup(e) {
    /**campo que tiene la ultima ubicacion */
    jQuery("input[name*='ULTIMA_UBICACION']").val( e.data.nombre_campo ); 
    /**Si el campo no esta agregado a la cola 
     * No se valida ya que el metodo se ejecuta al presionar 
     */
    if (!g_campos.find((v) => v ==  e.data.nombre_campo )) {
        g_campos.push( e.data.nombre_campo );
    }
}
function campo_onchange(e) {
         /**campo que tiene la ultima ubicacion */
    jQuery("input[name*='ULTIMA_UBICACION']").val( e.data.nombre_campo ); 
        var valido = true;
        /**Si se definieron validaciones para el campo se ejecuta  */
        var validaciones = e.data.validaciones;
        if (validaciones) {
           valido = validar_campo(e.data.nombre_campo, validaciones);
        }
        /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
        if (!g_campos.find((v) => v ==  e.data.nombre_campo ) && valido) {
            g_campos.push( e.data.nombre_campo );
    }
}

function cargar_guardado_automatico(pId = null, pProceso = null, pValidaciones = null) {
    (function (jQuery){
        var excluir = ['HIDDEN', 'DISPLAY_ONLY'];
        for (var indice in apex.items) {
            var campo = apex.items[indice];
            /** se decarta los campos display_only y ocultos,
             * para evitar que ejecute otros campos que no sean formulario 
             * solo se toma los campos que inician con P[NUMERO]_[NOMBRE_CAMPO]
              */
            if (!excluir.join(" ").includes(campo.item_type) && indice.startsWith('P')) {
                //campo.element.on('change', funcion);
                var evento_data = {'nombre_campo': indice}
                /** Se verifica si el campo tiene definido alguna validacion
                * las validaciones se añaden al evento change para que se ejcute una sola vez
                * y no cada vez que se presione una tecla
                */
                if (pValidaciones && pValidaciones[indice]) {
                    evento_data['validaciones'] = pValidaciones[indice].validaciones;
                }     

                if ("TEXTAREA".includes(campo.node.tagName.toUpperCase())) {
                    /**
                     * Un textarea se espera que ingrese mas texto se utiliza el evento keyup
                     */
                    campo.element.on('keyup', evento_data , campo_onkeyup );
                    campo.element.on('change',evento_data, campo_onchange );

                } else  {
                    /** para otros los elementos no se espera ingresar mucha informacion
                    asi que solo se ejecuta el evento change */
                    campo.element.on('change',evento_data, campo_onchange );
                }
                /*** evento para keyup */
                /*** si evento scroll */
            }
        }
        if (pId != null && pProceso != null) {
            setInterval(function () {
                /*if (iniciar_contador) {
                    contador += 1;
                }*/
                if (++contador >= 15 ) {
                    contador = 0;
                    
                    try {
                        enviar_datos(pId, pProceso);
                    } catch (error) {
                        console.log(error);
                    }
 
                    //apex.submit({request:'btnGuardar',validate:false});
                }
            }, 1000 );
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
       
}


