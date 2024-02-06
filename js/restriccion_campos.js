
function restriccion_campos() {
    // Solo numeros 
    apex.jQuery('.solo-numeros').each(function (index, el) {
        
        apex.jQuery(el).on('keypress', function (e) {
            var key = e.key ? e.key.charCodeAt(0) : e.keyCode;
            if (key < 48 || key > 57) {
                e.preventDefault();
            }
        })
    });

   
    apex.jQuery('.limite-palabras').each(function (index, el) {
        var campo = apex.jQuery(el);
        var contador = apex.jQuery("<span/>");
        var limite = campo.data('limite');
        if (limite) {
            contador.text( campo.val().split(" ").length.toString() + '/' + limite);
        }
        campo.after(contador);

        campo.on('keydown', function (e) {
            var $this = apex.jQuery(this);
            var palabras = $this.val().split(" ");
            if (limite && !(e.key === "Backspace" || e.key === "Delete")) {
                if (palabras.length > parseInt(limite)) {
                    e.preventDefault();
                } 
            }
            contador.text(palabras.filter((v) => v!="").length.toString()+'/' + limite);
        });

        campo.on('paste', function (e) {
            var el = apex.jQuery(this);
            setTimeout(function () {
              var valor = el.val().toString().split(" ");
              if (valor.length > limite) {
                  el.val(valor.filter((v,  i) => i < limite ).join(" ") );
                  el.trigger('keydown');
              }
            },  0);
          });

   });
   
}

