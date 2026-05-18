<?php

require_once "sc_functions/miniKernel.php";

$q_formulario = "select Tabla from db_biblioteca.Formulario where IdFormulario = " . sc_sql_injection($pIdFormulario);

sc_lookup_field(rs_form, $q_formulario);

$tabla = {rs_form[0]['Tabla']};

// todo funcionalidad para replicar
$material = cargarModelo("db_biblioteca.Material", ["Anio"], $pIdMaterial, "IdMaterial");

$replica = ["Anio" => "c_000000000006"];

$q_registro = "select * from db_biblioteca.$tabla where IdMaterial = " . sc_sql_injection($pIdMaterial) ;

sc_lookup_field(rs_registro, $q_registro);
$registro = {rs_registro[0]};

foreach ($registro as $key => $value) {
     foreach ($replica as $k => $v) {
        if($key == $k) {
            $registro[$key] = $material->$k;
        }
     }
     $q_campo = "select Campo.IdFormulario as IdFormulario, FormularioCampo.IdCampo from db_biblioteca.FormularioCampo inner join db_biblioteca.Campo on Campo.IdCampo = FormularioCampo.IdCampo where FormularioCampo.TablaColumna = '$key' and FormularioCampo.IdFormulario = $pIdFormulario";
     sc_lookup_field(rs_campo, $q_campo);
     $registro_campo = {rs_campo};
     if (!empty($registro_campo)) {
        $id_sub_formulario = $registro_campo[0]["IdFormulario"];
		$id_sub_formulario_campo = $registro_campo[0]["IdCampo"];
        $ds_form_sub = cargarModelo("db_biblioteca.Formulario", ["Tabla"], $id_sub_formulario, "IdFormulario");
        $tabla_sub_registro = $ds_form_sub->Tabla;
        $q_sub_registro = "select * from db_biblioteca.$tabla_sub_registro where IdMaterial = " . sc_sql_injection($pIdMaterial) . " and IdFormulario = " . sc_sql_injection($id_sub_formulario) . " and IdCampo = " . $id_sub_formulario_campo;
        sc_lookup_field(rs_sub_registro, $q_sub_registro);
        $registro_sub_registro = {rs_sub_registro};
        if (!empty($registro_sub_registro)) {
            $registro[$key] = array_map(function ($value)  {
                return array_filter($value, function ($v) {
                    return str_starts_with($v, 'c_');
                }, ARRAY_FILTER_USE_KEY);
            }, $registro_sub_registro);
        }
     }
}

if (!empty($registro)) {
	return $registro;
} else {
	return false;
}


