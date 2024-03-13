
/**
 * 
 * @param {string} titulo Titulo de la ventana de dialogo
 * @param {string} contenedor Selector (#id, .class) del contenedor
 * @param {string} mensaje Mensaje 
 * @param {string} confirm_label Etiqueta de confirmacion
 * @param {string} cancel_label Etiqueta de cancelar
 * @param {void} confirm_handler Funcion que se ejecuta cuando se da clic en el boton de confirmar
 * @param {void} cancel_handler Funcion que se ejecuta cuando se da clic en el boton de cancelar
 */
function confirmarDialogo(titulo, contenedor, mensaje,confirm_label, cancel_label, confirm_handler = function (){}, cancel_handler = function () {}) {
    var botones = {};
    botones[confirm_label] = function () {
        if (typeof confirm_handler == "function") {
              confirm_handler(apex.jQuery(this));
        } 
        //dialog("close");
    }
    botones[cancel_label] = function() {
        cancel_handler();
        apex.jQuery(this).dialog("close");
      };
    apex.jQuery(contenedor + '_heading').html(mensaje)
    apex.jQuery(contenedor)
    .dialog({
      modal: true,
      open: function() {
        // el titulo no soporte html directo, asi al abrir la ventana se busca el contenedor del titulo
        
        $(this).parent().find(".ui-dialog-title").append("<span class='title'>" + titulo + "</span>");
      },
      title: '',
      zIndex: 10000,
      autoOpen: true,
      width: '500px',
      resizable: false,
      buttons: botones,
      close: function(event, ui) {
        ///apex.jQuery(this).remove();
      }
    });
}