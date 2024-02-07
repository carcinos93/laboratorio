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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var validaciones = {
    rango: function (campo, n1, n2) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : campo.getValue(); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1 && n0 <= n2;
    },
    menor: function (campo, n1) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : campo.getValue(); //apex.locale.toNumber(campo.getValue());
        return n0 <= n1;
    },
    mayor: function (campo, n1) {
        var n0 = typeof campo['getNativeValue'] == "function" ? campo['getNativeValue']() : campo.getValue(); //apex.locale.toNumber(campo.getValue());
        return n0 >= n1;
    },
    regex: function (campo, reg) {
        return campo.getValue().toString().match(reg);
    },
    ajax: function (config) { return __awaiter(_this, void 0, void 0, function () {
        var respuesta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apex.server.process(config.nombre, config.data)];
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
var guardado_automatico = {
    proceso: '',
    botones: '',
    id: '',
    validaciones: {},
    /**
     * Inicializacion de proceso de guardado automatico
     * @param pId Nombre del item que es id
     * @param pProceso Proceso que enviara la informacion
     * @param pBotones Botones
     * @param pValidaciones Lista de validaciones
     */
    init: function (pId, pProceso, pBotones, pValidaciones) {
        var $obj = this;
        $obj.proceso = pProceso;
        $obj.id = pId;
        $obj.validaciones = pValidaciones;
        if (pBotones) {
            apex.jQuery(pBotones).on('click', $obj.boton_onclick.bind($obj));
        }
        (function (jQuery) {
            /**
             *  Se toman los campo que no esten excluidos y que comiencen con P
             */
            var items = Object.entries(apex.items)
                .filter(function (v) { return !EXCLUIR_CAMPOS.find(function (v1) { return v[1].item_type == v1; }) && v[1].id.startsWith('P'); }).map(function (v) { return v[1]; });
            var opts_default = { procesar: true, reglas: [] }; // variable por defecto
            items.forEach(function (item) {
                var _a;
                var data = { 'item': item }; // 
                var opts = $.extend(true, (_a = pValidaciones[item.id]) !== null && _a !== void 0 ? _a : {}, opts_default);
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
                    }
                    else {
                        item.element.on('change', data, $obj.item_change.bind($obj));
                    }
                }
            });
        })(apex.jQuery);
    },
    /**
     * Funcion que valida el campo segun las reglas
     * @param regla
     * @param item Campo del formulario
     * @returns boolean
     */
    validar_campo: function (regla, item) {
        return __awaiter(this, void 0, void 0, function () {
            var valido, respuesta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        valido = true;
                        if (!(typeof regla.metodo == "object")) return [3 /*break*/, 2];
                        return [4 /*yield*/, validaciones.ajax(regla.metodo)];
                    case 1:
                        respuesta = _a.sent();
                        /** el metodo ajax debe retornar 1 como verdadero o 0 como falso */
                        valido = respuesta == "1";
                        return [3 /*break*/, 3];
                    case 2:
                        if (typeof regla.metodo == "string") {
                            /** si es una cadena se buscara en las funciones de validacion  */
                            valido = validaciones[regla.metodo].apply(validaciones, __spreadArray([item], regla.parametros, false));
                        }
                        else if (typeof regla.metodo == "function") {
                            /** si no existe la funcion en validacion se puede implentar una funcion en las reglas */
                            valido = regla.metodo(item);
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/, valido];
                }
            });
        });
    },
    validar_campos: function (reglas, item) {
        return __awaiter(this, void 0, void 0, function () {
            var mensajes, $this, _a, _b, _c, _i, v, valido;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        mensajes = [];
                        $this = this;
                        _a = reglas;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 3];
                        v = _c;
                        return [4 /*yield*/, $this.validar_campo(reglas[v], item)];
                    case 2:
                        valido = _d.sent();
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
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, mensajes];
                }
            });
        });
    },
    item_keyup: function (e) {
    },
    item_change: function (e, cls) {
        var item = e.data.item;
        var reglas = e.data.validaciones.reglas;
        this.validar_campos(reglas, item).then(function (mensajes) {
            if (mensajes.length) {
                apex.message.clearErrors();
                apex.message.showErrors(mensajes);
            }
        });
        /* this.validar_campos(reglas, item).then(function (mensajes) {
             if (mensajes.length ) {
                 apex.message.clearErrors();
                 apex.message.showErrors(mensajes);
             }
         } );*/
    },
    boton_onclick: function (e) {
        var $this = this;
        var items = Object.entries(apex.items).filter(function (v) { return v[1].isChanged(); }).map(function (v) { return v[1]; });
        (function () {
            return __awaiter(this, void 0, void 0, function () {
                var mensajes_global, _a, _b, _c, _i, i, item, mensajes;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            mensajes_global = [];
                            _a = items;
                            _b = [];
                            for (_c in _a)
                                _b.push(_c);
                            _i = 0;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _b.length)) return [3 /*break*/, 4];
                            _c = _b[_i];
                            if (!(_c in _a)) return [3 /*break*/, 3];
                            i = _c;
                            item = items[i];
                            console.log($this.validaciones[item.id].reglas, item);
                            return [4 /*yield*/, $this.validar_campos($this.validaciones[item.id].reglas, item)];
                        case 2:
                            mensajes = _d.sent();
                            mensajes_global.push.apply(mensajes_global, mensajes);
                            _d.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, mensajes_global];
                    }
                });
            });
        })().then(function (v) {
            apex.message.clearErrors();
            apex.message.showErrors(v);
        });
    }
};
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
