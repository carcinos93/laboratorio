import { options } from './plugin';
interface validacion {
    campo: string;
    mensaje: string;
    validacion: () => boolean | object;
}

var tipos_validacion = {
    rango:  function (value ,min, max) {  return apex.locale.toNumber(value) < min ||  apex.locale.toNumber(value) > max   }
}

function validar_campos( campos: validacion[] ) {

    campos.forEach(function (v, i) {
        var item = apex.item(v.campo);
        var valido = tipos_validacion[ v.validacion['tipo'] ](item.getValue(), v.validacion['max'], v.validacion['min']);
        if (!valido) {
            apex.message.clearErrors();
        }
    
    });
}

function validar_rangos(campo, n1, n2) {
    if (campo.getValue() == '') {
        return true;
    }
    return campo.getNativeValue()>=n1 && campo.getValue()<=n2;

}

var validaciones = {
    'P8_PESO': { 'validaciones': [ { 'metodo': function (campo) { validar_rangos(campo,  ) }  }, 'mensaje':   'El peso debe ser de 4 digitos' }] },
    'P8_TALLA': { 'validaciones': [ { 'metodo': function(campo) {  return campo.getValue().length == 2 }, 'mensaje':   'La talla debe ser de 2 digitos' }] }
    
}

var script = "";
for (var i in apex.items) {
    var item = apex.item(i);
    if (item.item_type == 'NUMBER' && item._max != '') {
        script += ` '${i}': { 'validacion': [ {'metodo': function (campo) { validar_rangos(campo, ${item._min}, ${item._max}); } } ],'mensaje': 'El campo debe estar entre ${item._min} y ${item._max}'},`;
    }

}