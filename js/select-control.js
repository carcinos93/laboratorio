odoo.define('portal_extender.select-control', function (require) {
    (function ($) {

        $.fn.select_control = function (opciones) {
            var defaults = {
                etiqueta: 'description',
                valor: 'id',
                padre: '#padre',
                padre_variable: 'v',
                ondata: function (data) { return data;},
                ajax_opts: { 
                    url: '',
                    dataType: 'json',
                    method: 'GET'
                },
                onchange: function (value, el) {}
            };
            var opts  = $.extend({}, defaults,  opciones);
    
            var obtener_valores = function ($this, data = null, sel = true) {
                var ajax_opts = $.extend({},  { 'data': data, success: function (_response) {
                    var response = opts.ondata(_response);
                    if (response) {
                        $this.find("option").remove();
                        $this.append( $("<option value=''>--Seleccionar--</option>") );
                        response.forEach(function (v, i) {
                            var valor = v[opts.valor];
                            var descripcion = v[opts.etiqueta]
                            var opt_select = $("<option/>");
                            opt_select.attr('value', valor  );
                            opt_select.html(descripcion);
    
                            if ($this.data('value') ==  valor && sel) {
                                opt_select.attr('selected', 'selected');
                                $this.val(valor)
                            }
    
                            $this.append(opt_select);
                        });
                    }
                   
                } }, opts.ajax_opts);
                $.ajax( ajax_opts );
            }
            return this.each(function () {
                var $this = $(this);
    
                var data = {};
                if (opts.padre) {
                    data[opts.padre_variable] = $(opts.padre).val();
                }
                obtener_valores($this , data);
                
                if (opts.padre ) {
                    $(opts.padre).on('change', function (e) {
                        var d = {};
                        d[opts.padre_variable] = $(opts.padre).val();
                        obtener_valores($this , d, false); 
                        $this.val(null);   
                    });  
                }
    
                $this.on('change', function (e) {
                    $this.data('value', e.target.value);
                    opts.onchange( e.target.value, $(this)  );
                })
    
                return this;
            });
        }
    
    })($);
});

