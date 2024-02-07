

var excluir = ["P4_CANTON_M", 
"P4_PRIMER_APELLIDO_P","P4_SEGUNDO_APELLIDO_P","P4_PRIMER_NOMBRE_P","P4_SEGUNDO_NOMBRE_P","P4_TIPO_DOC_P",
"P4_DUI_P","P4_NUMERO_DOC_P","P4_FECHA_NAC_P","P4_FECHA_NAC_P_input","P4_EDAD_PADRE","P4_NACIONALIDAD_P",
"P4_PAIS_NACI_P","P4_DIRECCION_IGUAL_MADRE","P4_DIRECCION_P","P4_N_TELEFONICO_P",
"P4_DEPARTAMENTO_P","P4_MUNICIPIO_P","P4_CANTON_P","P4_AREA_P","P4_BARRIO_COL_P",
"P4_CALLE_PJE_P","P4_QUIEN_APORTA_DATOS","P4_NOMBRE_PERSONA_APORTO_DA","P4_TIPO_DOC_APORTO_DATOS",
"P4_NUM_DOC_APORTO_DATOS","P4_NUM_DOC_APORT_DAT_DUI","P4_NUMERO_TELEFO_APORTA","P4_NOMBRE_CONTAC_EMER",
"P4_NUM_CONTAC_EMERGENCIA","P4_ESTABL_SEGUIMIENTO"
];

var items = Object.entries(apex.items).filter((v) => v[0].startsWith('P4') && !excluir.find((v1) => v1 == v[0])).map((v) => v[1]);
var errores = []
items.forEach((v) => {
    if (!v.getValue().trim().length && v.element.is(':visible')) {
        var etiq = apex.jQuery("label[for='"+ v.id +"']").text();

        errores.push({ 
            location: ['page', 'inline'],
            message: etiq + ' es requerido',
            pageItem: v.id } 
        );
    }
});

if (errores.length) {
    apex.da.cancel();
    apex.message.clearErrors();
    apex.message.showErrors(errores);
}

var ids = "";
$("#R316184368139893517 [id^='P4_']").each((i, e) => {
    var el = apex.items[e.id];
    if (el) {
        ids += el.id + (i > 0 ? "," : "");
    }    
});

console.log(ids);


$("#PopupLov_2_P2_NEW_dlg input").on('focus', function (e) {
    console.log('focus');
  });


  