interface ValidacionesOpts {
    metodo: string | IMetodo | ((item: any) => boolean) ;
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
}
interface IValidaciones  {
    reglas: ValidacionesOpts[];
    procesar?: boolean
}


var EXCLUIR_CAMPOS = ['HIDDEN', 'DISPLAY_ONLY'];

const validaciones = {
    rango: (campo: apex.item.ItemObject, n1: number, n2: number) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  campo.getValue();  //apex.locale.toNumber(campo.getValue());
        return n0 >= n1 && n0 <= n2;
    },
    menor: (campo: apex.item.ItemObject, n1) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  campo.getValue(); //apex.locale.toNumber(campo.getValue());
        return n0 <= n1;
    },
    mayor: (campo: apex.item.ItemObject, n1) => {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() :  campo.getValue(); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1;
    },
    regex: (campo: apex.item.ItemObject, reg: RegExp) => {
        return campo.getValue().toString().match(reg);
    },
    ajax: async (config: IMetodo) =>   {
        var respuesta = await apex.server.process( config.nombre, config.data  );
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
const guardado_automatico = {
    /**
     * Inicializacion de proceso de guardado automatico
     * @param pId Nombre del item que es id 
     * @param pProceso Proceso que enviara la informacion
     * @param pBotones Botones 
     * @param pValidaciones Lista de validaciones
     */
    init: function (pId: string, pProceso: string, pBotones: string, pValidaciones: ICampoValidaciones) {
        var $obj = this;
        (function (jQuery) {
            /**
             *  Se toman los campo que no esten excluidos y que comiencen con P
             */
            var items = Object.entries(apex.items)
                .filter((v) => !EXCLUIR_CAMPOS.find((v1) => v[1].item_type == v1) && v[1].id.startsWith('P'))
                .map((v) => v[1]);
            
            var opts_default = { procesar: true, reglas: [] }; // variable por defecto
            items.forEach((item, index) => {
                var data = { 'item': item }; // 

                var opts = $.extend(true, pValidaciones[item.id] ?? {}, opts_default);
                if (opts) {
                    data['validaciones'] = opts;
                }
                if (opts.procesar) {
                    if ("TEXTAREA".includes(item.node.tagName.toUpperCase())) {
                        /**
                        * Un textarea se espera que ingrese mas texto se utiliza el evento keyup
                        */
                        item.element.on('keyup', data, $obj.item_keyup.bind($obj));
                        item.element.on('change', data, $obj.item_change.bind($obj));
                    } else {
                        item.element.on('change', data, $obj.item_change.bind($obj));

                    }
                }
            })
        })(apex.jQuery);
    },

    
    validar_campos: async function (reglas: ValidacionesOpts[], item: apex.item.ItemObject) {
        //var mensajes = [];
        var $this = this;
        for (var v in reglas) {
          
            var valido = await $this.validar_campo(reglas[v], item);
            if (!valido) {
                apex.message.showErrors([
                    { 
                    'location': 'inline',
                    'message': reglas[v].mensaje,
                    'pageItem': item.id
                    }
                ]);
                /*mensajes.push({ 
                    'location': 'inline',
                    'message': reglas[v].mensaje,
                    'pageItem': item.id
                 });*/
            }
        }

        ///return mensajes;
    },
    validar_campo: async function (regla: ValidacionesOpts,  item: apex.item.ItemObject) {
        var valido = true;
        if (typeof regla.metodo  == "object") {
           var respuesta = await validaciones.ajax(regla.metodo);
           valido = respuesta == "1";
        } else if (typeof regla.metodo ==  "string") {
            valido = validaciones[regla.metodo](item, ...regla.parametros);
        } else if (typeof regla.metodo == "function") {
            valido = regla.metodo(item);
        }

        return valido;
    },
    item_keyup: function (e: any) {
        
    },
    item_change: function (e: any, cls) {

        var item = e.data.item as apex.item.ItemObject;
        var reglas = (e.data.validaciones as IValidaciones ).reglas;
        apex.message.clearErrors();
        this.validar_campos(reglas, item).then(function (r) {});
       /* this.validar_campos(reglas, item).then(function (mensajes) {
            if (mensajes.length ) {
                apex.message.clearErrors();
                apex.message.showErrors(mensajes);
            }   
        } );*/
    
    }
}
/*
var v: ICampoValidaciones = {
    'P2_EDAD': {
        reglas: [
            { metodo:  'rango', mensaje: 'La edad debe estar entre 18 y 56', parametros: [18, 46]  }
        ]
    }, 
    'P2_NOMBRE': {
        reglas: [ 
            { metodo: { nombre: 'proceso', data: { x01: 'nombre' } }, mensaje: 'Nombre no usuario no valido' }
        ]
    }
}
*/