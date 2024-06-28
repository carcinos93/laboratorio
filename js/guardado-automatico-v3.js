///<
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
var EXCLUIR_CAMPOS = ['HIDDEN', 'DISPLAY_ONLY'];
/**
 * El primer argumento que recibe las funciones es el objeto y luego los parametros definidos
 * la cantidad de argumentos que se inyectaran a la funcion dependera
 * de los
 */
var validaciones = {
    cantidad_caracteres: function (campo, n1) {
        return campo.getValue().toString().length == n1;
    },
    /**
     * Funcion que valida si el valor esta entre el rango
     * @param campo
     * @param n1
     * @param n2
     * @returns
     */
    rango: function (campo, n1, n2) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : apex.locale.toNumber(campo.getValue().toString()); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1 && n0 <= n2;
    },
    /**
     * Funcion que valida si el valor del campo es menor
     * @param campo
     * @param n1
     * @returns
     */
    menor: function (campo, n1) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : apex.locale.toNumber(campo.getValue().toString()); //apex.locale.toNumber(campo.getValue());
        return n0 <= n1;
    },
    /**
     * Funcion que indica si el valor del campo es menor
     * @param campo
     * @param n1
     * @returns
     */
    mayor: function (campo, n1) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : apex.locale.toNumber(campo.getValue().toString()); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1;
    },
    /**
     * Funcion que indica si el campo cumple con la expresion regular
     * @param campo
     * @param reg
     * @returns
     */
    regex: function (campo, reg) {
        return campo.getValue().toString().match(reg);
    },
    /**
     * Funcion que usa una llamada por ajax a un evento definido del servidor (ajax callbacks)
     * @param config
     * @returns
     */
    ajax: function (config) { return __awaiter(_this, void 0, void 0, function () {
        var respuesta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apex.server.process(config.nombre, config.data, config.opciones)];
                case 1:
                    respuesta = _a.sent();
                    return [2 /*return*/, respuesta];
            }
        });
    }); }
};
/*async function ajax_llamada(proceso) {
    return await apex.server.process(proceso, {
        'x01': 'hola  mundo',
        pageItems: []
    }, {
        dataType: 'text'
    });
}*/
var GuardadoAutomatico = /** @class */ (function () {
    function GuardadoAutomatico() {
        this.g_campos = [];
        this.contador = 0;
        this.validaciones = {};
    }
    /**
     * Inicializacion de proceso de guardado automatico
     * @param pId Nombre del item que es id
     * @param ajax_proceso Nombre del proceso ajax que recibira los datos
     * @param proceso_formulario Proceso apex que guarda información del formulario
     * @param pBotones Identificador del boton de guardado
     * @param pValidaciones Lista de validaciones
     */
    GuardadoAutomatico.prototype.init = function (pId, ajax_proceso, proceso_formulario, pBotones, pValidaciones, formulario_contenedor) {
        if (formulario_contenedor === void 0) { formulario_contenedor = null; }
        var $this = this;
        $this.ajax_proceso = ajax_proceso;
        $this.proceso_formulario = proceso_formulario;
        $this.id_campo = pId;
        $this.validaciones = pValidaciones;
        $this.botones = pBotones;
        if (pBotones) {
            apex.jQuery(pBotones).on('click', $this.boton_onclick.bind($this));
        }
        (function (jQuery) {
            /**
             *  Se toman los campo que no esten excluidos y que comiencen con P
             */
            var items = Object.entries(apex.items) // arreglo de  [ 'P4_CAMPO' (id campo), apex.item (objeto apex) ]
                .filter(function (v) { return !EXCLUIR_CAMPOS.find(function (v1) { return v[1].item_type == v1; }) &&
                v[1].id.startsWith('P') &&
                !v[1].element.hasClass('excluir') &&
                !v[1].id.endsWith('_input') &&
                (formulario_contenedor == null || v[1].element.parents("#" + formulario_contenedor).length > 0); }).map(function (v) { return v[1]; });
            items.forEach(function (item) {
                var opts_default = { procesar: true, reglas: [] }; // variable por defecto
                var data = { 'item': item }; // 
                var p_validaciones = pValidaciones[item.id];
                var opts = apex.jQuery['fn'].extend(opts_default, p_validaciones); //$.extend(true,, opts_default);
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
                    }
                    else {
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
    };
    /**
     * Funcion que se encarga de ejecutar la  funcion de guardado formulario cada intervalo de tiempo
     */
    GuardadoAutomatico.prototype.inicializar_temporizador = function () {
        var $this = this;
        if ($this.id_campo != null && $this.proceso_formulario != null) {
            setInterval(function () {
                if (++$this.contador >= 2) {
                    $this.contador = 0;
                    try {
                        $this.guardar_formulario();
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }, 1000);
        }
    };
    /**
     * Funcion que retorna cadena de texto en el formato x01, x02 ... x10
     * @param i Indice
     * @returns string
     */
    GuardadoAutomatico.prototype.generador_id = function (i) {
        var n = '0' + i.toString();
        var id = 'x' + n.substring(n.length - 2);
        return id;
    };
    GuardadoAutomatico.prototype.validar_async = function (nombre, mostrarErrores, guardar) {
        if (mostrarErrores === void 0) { mostrarErrores = true; }
        if (guardar === void 0) { guardar = true; }
        return __awaiter(this, void 0, void 0, function () {
            var item, mensajes, valido;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        item = apex.item(nombre);
                        return [4 /*yield*/, this.validar_campos(this.validaciones[nombre].reglas, item)];
                    case 1:
                        mensajes = _a.sent();
                        valido = mensajes.length == 0;
                        apex.message.clearErrors();
                        if (mostrarErrores && !valido) {
                            apex.message.showErrors(mensajes);
                        }
                        if (guardar && valido) {
                            jQuery("input[name*='ULTIMA_UBICACION']").val(item.id);
                            /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
                            if (!this.g_campos.find(function (v) { return v == item.id; })) {
                                this.g_campos.push(item.id);
                            }
                        }
                        return [2 /*return*/, valido];
                }
            });
        });
    };
    GuardadoAutomatico.prototype.guardar_datos_submit = function () {
        apex.submit({ request: this.proceso_formulario, validate: false });
    };
    GuardadoAutomatico.prototype.guardar_campo = function (nombre) {
        if (!this.g_campos.find(function (v) { return v == nombre; })) {
            this.g_campos.push(nombre);
        }
    };
    /**
     * Funcion que valida el campo segun las reglas
     * @param regla
     * @param item Campo del formulario
     * @returns boolean
     */
    GuardadoAutomatico.prototype.validar_campo = function (regla, item) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var valido, parametros, respuesta;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        valido = true;
                        parametros = (_a = regla.parametros) !== null && _a !== void 0 ? _a : [];
                        if (!(typeof regla.metodo == "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, validaciones.ajax(regla.metodo)];
                    case 1:
                        respuesta = _b.sent();
                        /** el metodo ajax debe retornar 1 como verdadero o 0 como falso */
                        valido = respuesta.toString().trim() === "1";
                        return [3 /*break*/, 6];
                    case 2:
                        if (!(typeof regla.metodo == "string")) return [3 /*break*/, 3];
                        /** si es una cadena se buscara en las funciones de validacion  */
                        valido = validaciones[regla.metodo].apply(validaciones, __spreadArray([item], parametros, false));
                        return [3 /*break*/, 6];
                    case 3:
                        if (!(typeof regla.metodo == "function")) return [3 /*break*/, 6];
                        if (!regla.es_asincrono) return [3 /*break*/, 5];
                        return [4 /*yield*/, regla.metodo.apply(regla, __spreadArray([item], parametros, false))];
                    case 4:
                        valido = _b.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        valido = regla.metodo.apply(regla, __spreadArray([item], parametros, false));
                        _b.label = 6;
                    case 6: return [2 /*return*/, valido];
                }
            });
        });
    };
    GuardadoAutomatico.prototype.validar_campos = function (reglas, item) {
        return __awaiter(this, void 0, void 0, function () {
            var mensajes, $this, _a, _b, _i, v, valido;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        mensajes = [];
                        $this = this;
                        _a = [];
                        for (_b in reglas)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        v = _a[_i];
                        return [4 /*yield*/, $this.validar_campo(reglas[v], item)];
                    case 2:
                        valido = _c.sent();
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
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, mensajes];
                }
            });
        });
    };
    GuardadoAutomatico.prototype.item_keyup = function (e) {
        var item = e.data.item;
        var $this = this;
        jQuery("input[name*='ULTIMA_UBICACION']").val(item.id);
        /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
        if (!$this.g_campos.find(function (v) { return v == item.id; })) {
            $this.g_campos.push(item.id);
        }
    };
    GuardadoAutomatico.prototype.item_change = function (e, cls) {
        var $this = this;
        var item = e.data.item;
        var reglas = e.data.validaciones.reglas;
        this.validar_campos(reglas, item).then(function (mensajes) {
            apex.message.clearErrors();
            if (mensajes.length) {
                apex.message.showErrors(mensajes);
            }
            else {
                if (typeof item.element.data('old_value') == "string") {
                    item.element.data('old_value', item.getValue().toString());
                }
                jQuery("input[name*='ULTIMA_UBICACION']").val(item.id);
                /**Si el campo no esta agregado a la cola y es valido se agrega para ser procesado */
                if (!$this.g_campos.find(function (v) { return v == item.id; })) {
                    $this.g_campos.push(item.id);
                }
            }
        });
        /* this.validar_campos(reglas, item).then(function (mensajes) {
             if (mensajes.length ) {
                 apex.message.clearErrors();
                 apex.message.showErrors(mensajes);
             }
         } );*/
    };
    GuardadoAutomatico.prototype.guardar_formulario = function () {
        var $this = this;
        if ($this.g_campos.length == 0) {
            return;
        }
        /** se toman los primeros 3 campos */
        var campos_enviar = __spreadArray([], $this.g_campos, true).filter(function (v, i) { return i < 3; });
        var data = { pageItems: "#" + $this.id_campo };
        var indice = 0;
        campos_enviar.forEach(function (v, i) {
            var _a;
            var item = apex.item(v);
            /**
             * Los campos se contruyen de la siguiente manera
             * x01: NOMBRE CAMPO 1
             * x02: VALOR CAMPO 2
             * x03: NOMBRE CAMPO 2
             * x04: VALOR CAMPO 2
             * hasta completar los tres campos
             */
            data[$this.generador_id(++indice)] = v; // x01: P1_CAMPO;
            if (Array.isArray(item.getValue())) {
                data[$this.generador_id(++indice)] = item.getValue().join((_a = item.separator) !== null && _a !== void 0 ? _a : ";").toUpperCase().trim();
            }
            else {
                data[$this.generador_id(++indice)] = item.getValue().toString().toUpperCase().trim(); // x02: Valor de P1_CAMPO;
            }
        });
        ///var v_refreshObject = campos_enviar.map((v) => "#" + v ).join(",");
        var spinner = apex.util.showSpinner(apex.jQuery("body"));
        apex.server.process($this.ajax_proceso, data, {
            success: function (resp) {
                if (resp['mensaje']) {
                    /**se filtra la cola de campos dejando solo lo que no han sido enviados */
                    $this.g_campos = $this.g_campos.filter(function (v, i) {
                        return !campos_enviar.find(function (v1) { return v1 == v; });
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
            error: function (err) {
                if (spinner) {
                    spinner.remove();
                }
            }
        });
    };
    GuardadoAutomatico.prototype.boton_onclick = function (e) {
        var $this = this;
        // se filtran los items que han sido cambiados y que no esten vacios
        var items = Object.entries(apex.items).filter(function (v) { return v[1].isChanged() && !v[1].isEmpty(); }).map(function (v) { return v[1]; });
        // se ejecuta la validacion para todos los campos de manera asincrona
        (function () {
            return __awaiter(this, void 0, void 0, function () {
                var mensajes_global, _a, _b, _i, i, item, mensajes;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            mensajes_global = [];
                            _a = [];
                            for (_b in items)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            i = _a[_i];
                            item = items[i];
                            if (!$this.validaciones[item.id]) return [3 /*break*/, 3];
                            return [4 /*yield*/, $this.validar_campos($this.validaciones[item.id].reglas, item)];
                        case 2:
                            mensajes = _c.sent();
                            mensajes_global.push.apply(mensajes_global, mensajes);
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, mensajes_global];
                    }
                });
            });
        })().then(function (v) {
            /** si hay errores se muestran los mensajes */
            if (v.length) {
                apex.message.clearErrors();
                apex.message.showErrors(v);
            }
            else {
                /**si todo es valido se envia el formulario */
                apex.submit({ request: $this.proceso_formulario, validate: false });
            }
        });
    };
    return GuardadoAutomatico;
}());
