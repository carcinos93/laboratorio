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
function modificar_radio_group(item, valores = []) {
    var campo = apex.item(item);
    var opciones = campo.element.find('.apex-item-option');
    opciones.each(function (index, el) {
        if (valores.find(function (v, i) { return  v.trim() == el.innerText.trim() } )) {
            var $this = apex.jQuery(el);
            $this.find('input').hide();
        }
    });
}   