/**
 * validaciones
 */

function es_nulo(valor) {
    return valor == null || valor == undefined || valor.trim().length == 0;
}
function no_nulo(valor) {
    return !es_nulo(valor);
}



function validar_campo(pCampo, pValidacion) {
    
    var campo = apex.item(pCampo);
    var validacion = pValidacion[pCampo];
    var campo_valido = true;
    if (validacion) {
        
        validacion.validaciones.forEach(function (v, i)  {
            var metodo = null;
            if (typeof v.metodo == "function") {
                metodo = v.metodo;
            } else  {
                if (typeof window[metodo] == "function") {
                    metodo = window[metodo];
                }   
            }
            if (metodo != null) {
                var valido = metodo(campo);
                console.log(valido);
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
    return campo_valido;
}
/*

var validaciones =  {'P2_FECHA':  {validaciones : [ 
    { metodo: function (campo) {
        var fecha = campo.getNativeValue();
        var fecha_actual =  new Date();
        return fecha < fecha_actual;
    }, mensaje: 'La fecha no puede ser mayor a la actual'}
]}};
console.log(validar_campo('P2_FECHA', validaciones));*/
