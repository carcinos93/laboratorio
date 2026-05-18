<?php

function sc_sql_total_filas($tabla, $condiciones = "", $group_by = "", $agrupadores = []) {
    $where = "1=1";
    if (!empty($condiciones)) {
        $where .= " AND $condiciones ";
    }

    $agrupadores_query = "";
    foreach ($agrupadores as $campo => $condicion) {
        $agrupadores_query .= "SUM(CASE WHEN $condicion THEN 1 ELSE 0 END) AS $campo, ";
    }

    // El query ahora asegura que la coma solo exista si hay agrupadores
    $query = "SELECT " . $agrupadores_query . "COUNT(*) FROM $tabla WHERE $where $group_by";

    // Usamos sc_lookup correctamente
    sc_lookup_field(ds_temp, $query);

    // Validar error en la consulta
    if ({ds_temp} === false) {
        return null;
    }
    
    // Validar si el dataset está vacío
    if (empty({ds_temp})) {
        return 0;
    }

    $resultado = {ds_temp};

    // Caso 1: Solo un COUNT(*) (Sin agrupadores ni GROUP BY)
    if (empty($group_by) && empty($agrupadores)) {
        return $resultado[0][0]; 
    }

    // Caso 2: Una sola fila (con agrupadores pero sin GROUP BY multi-fila)
    if (count($resultado) == 1) {
        return $resultado[0]; // Retorna el primer array de resultados
    }

    // Caso 3: Múltiples filas (debido a un GROUP BY)
    return $resultado;
}



function sc_sql_insert($_sc_sql_tabla, $_sc_sql_valores = []) {
    $_sc_sql_variables =[ 
        "{now}" => "getdate()",
    ];
    $q_campos = implode(", ", array_keys($_sc_sql_valores));
    $q_valores = implode(", ", array_map(function ($v) use ($_sc_sql_variables) {
        $value = $v;

        if (is_null($v)) {
            $value = "NULL";
        } 
        elseif (isset($_sc_sql_variables[$v])) {
            $value = $_sc_sql_variables[$v];
        }
        elseif (is_numeric($v)) {
            $value = $v;
        } elseif (is_bool($v)) {
            $value = $v ? "1" : "0";
        } elseif (is_string($v)) {
            $value = "'".addslashes($v)."'";
        }
        
        return $value;

    }, $_sc_sql_valores));

    $query = "INSERT INTO $_sc_sql_tabla ($q_campos) VALUES ($q_valores)";
    sc_exec_sql($query);

    // retornar el ultimo id generador
    sc_lookup_field(ds_last_id, "SELECT SCOPE_IDENTITY()");
    return empty({ds_last_id}) ? null : {ds_last_id}[0][0];

}
function sc_sql_update($tabla, $valores = [], $condiciones = "") {
    $variables =[ 
        "{now}" => "now()",
    ];
    $q_campos = implode(", ", array_map(function ($k, $v) use ($variables) {
        $value = $v;

        if (is_null($v)) {
            $value = "NULL";
        } 
        elseif (isset($variables[$v])) {
            $value = $variables[$v];
        }
        elseif (is_numeric($v)) {
            $value = $v;
        } elseif (is_bool($v)) {
            $value = $v ? "1" : "0";
        } elseif (is_string($v)) {
            $value = "'".addslashes($v)."'";
        }
        
        return $k . " = " . $value;

    }, array_keys($valores), array_values($valores)));

    $query = "UPDATE $tabla SET $q_campos WHERE $condiciones";
    sc_exec_sql($query);
}

/**
 * Obtiene el valor de un correlativo
 * @param string $sc_correlativo_clave Clave del correlativo
 * @param bool $aumentar Si se debe aumentar el correlativo
 * @param bool $crear_si_no_existe Si se debe crear el correlativo si no existe
 * @return int Valor del correlativo
 */
function sc_obtener_correlativo($sc_corre_clave, $sc_corre_aumentar = true, $sc_corre_crear_si_no_existe = false) {
    $sc_corre_clave = sc_sql_injection($sc_corre_clave);
    sc_lookup_field($ds, "SELECT Valor FROM db_sistema.Parametro  WHERE Clave = " . $sc_corre_clave);
    if (!empty($ds)) {
        $valor = $ds[0]["Valor"];
        if ($sc_corre_aumentar) {
            sc_sql_update("db_sistema.Parametro", ["Valor" => $valor + 1], "Clave = " . $sc_corre_clave);
        }
        return $valor;
    }
    if ($sc_corre_crear_si_no_existe) {
        sc_sql_insert("db_sistema.Parametro", ["Clave" => $sc_corre_clave, "Valor" => 1]);
        return 1;
    }
    sc_error_message("El correlativo $sc_corre_clave no existe");
    sc_error_exit();
}

?>