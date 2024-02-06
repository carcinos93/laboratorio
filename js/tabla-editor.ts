/// <reference types="orclapex-js" />

Object.entries(apex.items)
.filter(function (v) { return v[1].element.parents("#REGION_PARTO_VAGINAL").length })
.forEach(function (v) {
    console.log(`apex.item("${v[1].id}").setValue(null);`  )
})

v[1].setValue(null);

apex.item("P8_CAUSA_CESAREA_OTRO").setValue(null);
apex.item("P8_CARACTERISTICA_CESAREA").setValue(null);
apex.item("P8_CESAREA_PROVINCULO").setValue(null);
apex.item("P8_TIPO_CESAREA").setValue(null);
apex.item("P8_CAUSA_CESAREA").setValue(null);