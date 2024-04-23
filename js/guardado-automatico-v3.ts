///<

interface ValidacionesOpts {
    metodo: string | IMetodo | ((item: any, ...parametros: any[]) => boolean) ;
    es_asincrono: boolean;
    parametros?: any[];
    keyup?: boolean;
    change?: boolean;
    mensaje?: string;
}
interface ICampoValidaciones {
    [index: string]: IValidaciones ;
}

interface IMetodo {
    nombre: string;
    data?: any;
    opciones?: any;
}
interface IValidaciones  {
    reglas: ValidacionesOpts[];
    procesar?: boolean
}
interface IGuardado_automatico {
    init: (pId: string, ajax_proceso: string, proceso_formulario: string ) => void;
    inicializar_temporizador: () => void;
}

var EXCLUIR_CAMPOS = ['HIDDEN', 'DISPLAY_ONLY'];
/**
 * El primer argumento que recibe las funciones es el objeto y luego los parametros definidos 
 * la cantidad de argumentos que se inyectaran a la funcion dependera 
 * de los
 */
const validaciones = {

    cantidad_caracteres: function (campo: apex.item.ItemObject, n1: number){
        return campo.getValue().toString().length == n1;
    },

    /**
     * Funcion que valida si el valor esta entre el rango
     * @param campo 
     * @param n1 
     * @param n2 
     * @returns 
     */
    rango: (campo: apex.item.ItemObject, n1: number, n2: number) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  apex.locale.toNumber(campo.getValue().toString());  //apex.locale.toNumber(campo.getValue());
        return n0 >= n1 && n0 <= n2;
    },
    /**
     * Funcion que valida si el valor del campo es menor 
     * @param campo 
     * @param n1 
     * @returns 
     */
    menor: (campo: apex.item.ItemObject, n1) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  apex.locale.toNumber(campo.getValue().toString()); //apex.locale.toNumber(campo.getValue());
        return n0 <= n1;
    },
    /**
     * Funcion que indica si el valor del campo es menor
     * @param campo 
     * @param n1 
     * @returns 
     */
    mayor: (campo: apex.item.ItemObject, n1) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  apex.locale.toNumber(campo.getValue().toString()); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1;
    },
    /**
     * Funcion que indica si el campo cumple con la expresion regular
     * @param campo
     * @param reg 
     * @returns 
     */
    regex: (campo: apex.item.ItemObject, reg: RegExp) => {
        return campo.getValue().toString().match(reg);
    },
    /**
     * Funcion que usa una llamada por ajax a un evento definido del servidor (ajax callbacks)
     * @param config 
     * @returns 
     */
    ajax: async (config: IMetodo) =>   {
        var respuesta = await apex.server.process( config.nombre, config.data, config.opciones );
        return respuesta;
    }
}

/*async function ajax_llamada(proceso) {
    return await apex.server.process(proceso, { 
        'x01': 'hola  mundo',
        pageItems: []
    }, {
        dataType: 'text'
    });
}*/
class GuardadoAutomatico {
    contador: number;
    g_campos: [];
    ajax_proceso: string;
    proceso_formulario: string;
    botones: string;
    id_campo: string;
    validaciones: object;
    /**
     * Inicializacion de proceso de guardado automatico
     * @param pId Nombre del item que es id 
     * @param ajax_proceso Nombre del proceso ajax que recibira los datos
     * @param proceso_formulario Proceso apex que guarda información del formulario
     * @param pBotones Identificador del boton de guardado 
     * @param pValidaciones Lista de validaciones
     */
    init (pId: string, ajax_proceso: string, proceso_formulario: string , pBotones: string, pValidaciones: ICampoValidaciones, formulario_contenedor: string = null) {
        var $this = this;
        $this.ajax_proceso = ajax_proceso;
        $this.proceso_formulario = proceso_formulario;
        $this.id_campo = pId;
        $this.validaciones = pValidaciones;
        if (pBotones) {
            apex.jQuery(pBotones).on('click', $this.boton_onclick.bind($this));
        }
        (function (jQuery) {
            /**
             *  Se toman los campo que no esten excluidos y que comiencen con P
             */
            var items = Object.entries(apex.items) // arreglo de  [ 'P4_CAMPO' (id campo), apex.item (objeto apex) ]
                .filter((v) => !EXCLUIR_CAMPOS.find((v1) => v[1].item_type == v1) && 
                v[1].id.startsWith('P') && 
                !v[1].element.hasClass('excluir') && 
                !v[1].id.endsWith('_input') &&
                (formulario_contenedor == null || v[1].element.parents("#" + formulario_contenedor).length > 0)
            ).map((v) => v[1]);
            
           
            items.forEach((item) => {
                var opts_default = { procesar: true, reglas: [] }; // variable por defecto
                var data = { 'item': item }; // 
                var p_validaciones = pValidaciones[item.id];
                var opts = apex.jQuery['fn'].extend(opts_default, p_validaciones );  //$.extend(true,, opts_default);
                data['validaciones'] = opts;
                if ("RADIO_GROUP SELECT".includes(item.item_type)) {
                    item.element.data('old_value', item.getValue().toString());
                }

                if (opts.procesar) {
                    if ("TEXTAREA".includes(item.node.tagName.toUpperCase())) {
                        /**
                        * Un textarea se espera que ingrese mas texto se utiliza el evento keyup
                        */
                        item.element.on('keyup', data, $this.item_keyup.bind($this));
                        item.element.on('change', data, $this.item_change.bind($this));
                    } else {
                        item.element.on('change', data, $this.item_change.bind($this));
                    }
                }
            });
            // Se inicializa el temporizador
            $this.inicializar_temporizador();

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
    /**
     * Funcion que se encarga de ejecutar la  funcion de guardado formulario cada intervalo de tiempo
     */
    inicializar_temporizador() {
        var $this = this;
        if ($this.id_campo != null && $this.proceso_formulario != null) {
            setInterval(function () {
                if ( ++$this.contador >= 2 ) {
                    $this.contador = 0;
                    try {
                        $this.guardar_formulario();
                    } catch (error) {
                        console.log(error);
                    }

                }
            }, 1000 );
        }
    }
    /**
     * Funcion que retorna cadena de texto en el formato x01, x02 ... x10 
     * @param i Indice
     * @returns string
     */
    generador_id(i: number) {
        var n = '0' + i.toString()
        var id = 'x' + n.substring(n.length - 2) ;
        return id;
    }
    async validar_async (nombre: string, mostrarErrores = true, guardar = true) { 
        var item = apex.item(nombre)
        var mensajes = await this.validar_campos(this.validaciones[nombre].reglas, item );
        var valido = mensajes.length == 0;
        apex.message.clearErrors();
        if (mostrarErrores && !valido) {
            apex.message.showErrors(mensajes);
        }
        if (guardar && valido) {
            jQuery("input[name*='ULTIMA_UBICACION']").val( item.id ); 
            /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
            if (!this.g_campos.find((v) => v ==  item.id )) {
                this.g_campos.push( item.id );
            }
        }
        return valido;
    }
    guardar_datos_submit() {
        apex.submit({request: this.proceso_formulario ,validate:false});
    }
    guardar_campo(nombre: string) {
        if (!this.g_campos.find((v) => v ==  nombre )) {
            this.g_campos.push( nombre );
        }
    }
    /**
     * Funcion que valida el campo segun las reglas
     * @param regla 
     * @param item Campo del formulario
     * @returns boolean
     */
    async validar_campo (regla: ValidacionesOpts,  item: apex.item.ItemObject) {
        var valido = true;
        var parametros = regla.parametros ?? [];
        if (typeof regla.metodo  == "object") {
            /** si es un objeto se tomara como validacion ajax */
           var respuesta = await validaciones.ajax(regla.metodo);
           /** el metodo ajax debe retornar 1 como verdadero o 0 como falso */
           valido = respuesta.toString().trim() === "1";
        } else if (typeof regla.metodo ==  "string") {
            /** si es una cadena se buscara en las funciones de validacion  */
            valido = validaciones[regla.metodo](item, ...parametros);
        } else if (typeof regla.metodo == "function") {
            /** si no existe la funcion en validacion se puede implentar una funcion en las reglas */
            if ( regla.es_asincrono ) {
                valido = await regla.metodo(item, ...parametros);
            } else {
                valido = regla.metodo(item, ...parametros);
            }

        }

        return valido;
    }
    async validar_campos(reglas: ValidacionesOpts[], item: apex.item.ItemObject) {
        var mensajes = [];
        var $this = this;
        for (var v in reglas) { 
            var valido = await $this.validar_campo(reglas[v], item);
            if (!valido) {
                /*apex.message.showErrors([
                    { 
                    'location': 'inline',
                    'message': reglas[v].mensaje,
                    'pageItem': item.id
                    }
                ]);*/
                mensajes.push({ 
                    'location': 'inline',
                    'message': reglas[v].mensaje,
                    'pageItem': item.id
                 });
            }
        }
        return mensajes;
    }
    
    item_keyup(e: any) {
        var item = e.data.item as apex.item.ItemObject;
        var $this = this;
        jQuery("input[name*='ULTIMA_UBICACION']").val( item.id ); 
        /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
        if (!$this.g_campos.find((v) => v ==  item.id )) {
            $this.g_campos.push( item.id );
        }
    }
     item_change(e: any, cls) {
        var $this = this;
        var item = e.data.item as apex.item.ItemObject;
        var reglas = (e.data.validaciones as IValidaciones ).reglas;
        
        this.validar_campos(reglas, item).then(function (mensajes) {
            apex.message.clearErrors();
            if (mensajes.length ) {
                apex.message.showErrors(mensajes);
            } else {
                if (typeof item.element.data('old_value') == "string" ) {
                    item.element.data('old_value', item.getValue().toString());
                }
                jQuery("input[name*='ULTIMA_UBICACION']").val( item.id ); 
                /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
                if (!$this.g_campos.find((v) => v ==  item.id )) {
                    $this.g_campos.push( item.id );
                }
            }    
        });
       /* this.validar_campos(reglas, item).then(function (mensajes) {
            if (mensajes.length ) {
                apex.message.clearErrors();
                apex.message.showErrors(mensajes);
            }   
        } );*/
    }
    guardar_formulario() {
        var $this = this;
        if ($this.g_campos.length==0) {
            return;
        }

        /** se toman los primeros 3 campos */
        var campos_enviar = [...$this.g_campos ].filter(function (v, i) { return i < 3 });
        var data = { pageItems: "#" + $this.id_campo };
    
        var indice = 0;
        campos_enviar.forEach(function (v, i) {
            var item = apex.item(v);
            /**
             * Los campos se contruyen de la siguiente manera 
             * x01: NOMBRE CAMPO 1
             * x02: VALOR CAMPO 2
             * x03: NOMBRE CAMPO 2
             * x04: VALOR CAMPO 2
             * hasta completar los tres campos
             */
            data[ $this.generador_id(++indice) ] = v; // x01: P1_CAMPO;
            if (Array.isArray(item.getValue())) {
                data[ $this.generador_id(++indice) ] = item.getValue().join( item.separator ?? ";" ).toUpperCase().trim();
            } else {
                data[ $this.generador_id(++indice) ] = item.getValue().toString().toUpperCase().trim() // x02: Valor de P1_CAMPO;
            }
        });
        ///var v_refreshObject = campos_enviar.map((v) => "#" + v ).join(",");
        var spinner = apex.util.showSpinner(apex.jQuery("body"));    
        apex.server.process($this.ajax_proceso, data,{
                success: function (resp) {
                    if (resp['mensaje']) {
                        /**se filtra la cola de campos dejando solo lo que no han sido enviados */
                        $this.g_campos = $this.g_campos.filter(function (v, i) {
                            return !campos_enviar.find((v1) => v1 == v);
                        });
                        campos_enviar.forEach(function (c) {
                            if ($this.validaciones[c] != undefined && $this.validaciones[c].accion != undefined) {
                                apex.event.trigger(document, $this.validaciones[c].accion);
                            }
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
    boton_onclick(e) {
        var $this = this;
        // se filtran los items que han sido cambiados y que no esten vacios
        var items = Object.entries(apex.items).filter((v) => v[1].isChanged() && !v[1].isEmpty()).map((v) => v[1]);
        // se ejecuta la validacion para todos los campos de manera asincrona
        (async function () {
            var mensajes_global = [];
            for (var i in items) {
                var item = items[i];
                // se valida el  campo
                if ($this.validaciones[item.id]) {
                    var mensajes = await $this.validar_campos( $this.validaciones[item.id].reglas, item);
                    mensajes_global.push(...mensajes);
                }
            }
           return mensajes_global;
 
        })().then((v) => {
            /** si hay errores se muestran los mensajes */
            if (v.length) {
                apex.message.clearErrors();
                apex.message.showErrors(v);
            } else {
                /**si todo es valido se envia el formulario */
                apex.submit({request: $this.proceso_formulario ,validate:false});
            }

        });
    }
}
