<?php

function templateValores($valores)
{
    $html = "";
    if (!empty($valores)) {
        $valores = explode(";", $valores);
        foreach ($valores as $valor) {
            $html .= "<option value='" . $valor . "'>" . $valor . "</option>";
        }
    }
    return $html;
}
function replaceTemplate($html, $el)
{
    foreach ($el as $key => $value) {
        $pattern = "/%\\s*" . $key . "\\s*%/";
        $html = preg_replace($pattern, $value, $html);
    }
    return $html;
}

function templateLabel($campo, $incluirEtiqueta = true)
{
    return replaceTemplate("<label class='form-label font-weight-bold'>% nombre %</label>", [
        'nombre' => $incluirEtiqueta ?  $campo['Nombre'] . " (" . $campo['Etiqueta'] . ")" : $campo['Nombre']
    ]);
}


/**
 * Genera el HTML para un campo de tipo textbox.
 * @param array $campo Un array que contiene la configuración del campo.
 * @param bool $incluirEtiqueta Indica si se debe incluir la etiqueta del campo.
 * @param string $variable_registro Nombre de la variable de registro de Alpine.js.
 * @return string El HTML generado para el campo.
 */
function textbox($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    $html = replaceTemplate("<div x-data='textbox(\"% tabla_columna %\",\"% variable_registro %\",% requerido %, % validaciones %)' class='form-group'>
            % label %
            <input type='text' x-model='% variable_registro %.% tabla_columna %' class='form-control control' placeholder='% placeholder %' x-init='init()'/>
            <div class='error' x-show='Object.values(errores[\"% tabla_columna %\"] || {}).length > 0'>
                <template x-for='(error, index) in Object.values(errores[\"% tabla_columna %\"] || {})' :key='index'>
                    <span x-text='error' class='error-message'></span>
                </template>
            </div>
        </div>", [
        'variable_registro' => $variable_registro,
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'placeholder' => isset($campo['Sugerencia']) ? $campo['Sugerencia'] : '',
        'label' => templateLabel($campo, $incluirEtiqueta)
    ]);

    return $html;
}

/**
 * Genera el HTML para un campo tipo textarea.
 * @param array $campo Un array que contiene la configuración del campo.
 * @param bool $incluirEtiqueta Indica si se debe incluir la etiqueta del campo.
 * @param string $variable_registro Nombre de la variable de registro de Alpine.js.
 * @return string El HTML generado para el campo.
 */
function textarea($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    $html = replaceTemplate("<div x-data='textarea(\"% tabla_columna %\", \"% variable_registro %\",% requerido %, % validaciones %)' class='form-group'>
            % label %
            <textarea class='form-control control' x-model='% variable_registro %.% tabla_columna %' placeholder='% placeholder %' x-init='init()'></textarea>
            <div class='error'  x-show='Object.values(errores[\"% tabla_columna %\"] || {}).length > 0'>
                <template x-for='(error, index) in Object.values(errores[\"% tabla_columna %\"] || {})' :key='index'>
                    <span x-text='error' class='error-message'></span>
                </template>
            </div>
        </div>", [
        'variable_registro' => $variable_registro,
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'placeholder' => isset($campo['Sugerencia']) ? $campo['Sugerencia'] : '',
        'label' => templateLabel($campo, $incluirEtiqueta)
    ]);

    return $html;
}

function select2($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    $html = replaceTemplate("<div x-data='select2(\"% tabla_columna %\",\"% variable_registro %\", % ismulti %, % requerido %, % validaciones %)' class='form-group'>
            % label %
            <select class='form-control control' placeholder='% placeholder %' x-init='init()'>
                % primerOpcion %
                % valores %
            </select>
            <div class='error'  x-show='Object.values(errores[\"% tabla_columna %\"] || {}).length > 0'>
                <template x-for='(error, index) in Object.values(errores[\"% tabla_columna %\"] || {})' :key='index'>
                    <span x-text='error' class='error-message'></span>
                </template>
            </div>
        </div>", [
        'variable_registro' => $variable_registro,
        'multiple' =>  $campo["Multiple"] ? 'multiple="multiple"' : '',
        'ismulti' => $campo["Multiple"] ? 'true' : 'false',
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'placeholder' => isset($campo['Sugerencia']) ? $campo['Sugerencia'] : '',
        'label' => templateLabel($campo, $incluirEtiqueta),
        'valores' => templateValores($campo['Valores']),
        'primerOpcion' => $campo["Multiple"] ? "" : "<option value=''>Seleccione una opción</option>"
    ]);

    return $html;
}

function date2($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    $html = replaceTemplate("<div x-data='date2(\"% tabla_columna %\",\"% variable_registro %\", % requerido %, % validaciones %, % validateConfig %)' class='form-group'>
            % label %
            <input autocomplete='off' class='form-control control' placeholder='% placeholder %' x-init='init()'>
            <div class='error' x-show='Object.values(errores[\"% tabla_columna %\"] || {}).length > 0'>
                <template x-for='(error, index) in Object.values(errores[\"% tabla_columna %\"] || {})' :key='index'>
                    <span x-text='error' class='error-message'></span>
                </template>
            </div>
        </div>", [
        'variable_registro' => $variable_registro,
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'placeholder' => isset($campo['Sugerencia']) ? $campo['Sugerencia'] : '',
        'label' => templateLabel($campo, $incluirEtiqueta),   
        'validateConfig' => json_encode([
            'onBlur' => true,
            'onInput' => true
        ])
    
    ]);

    return $html;
}
function gridForm($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    // Generamos el HTML de los campos internos.
    // IMPORTANTE: Los campos internos deben usar 'fila' como variable de registro en lugar de 'registro'
    $camposInternosHtml = generarFormularioHTML($campo, false, 'fila');

    $html = replaceTemplate("
        <div x-data='gridForm(\"% tabla_columna %\",\"% variable_registro %\", % requerido %, % validaciones %)' class='form-group gridForm'>
            % label %
            <div class='control' x-init='init()'>
                % htmlTable %
                <button type='button' class='btn btn-success btn-sm' @click='addFila({})'>
                    <i class='fa fa-plus'></i> Agregar Fila
                </button>
            </div>
            <span class='error'></span>
        </div>", [
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode($campo['Validaciones'] ?? []),
        'tabla_columna' => $campo['TablaColumna'],
        'variable_registro' => $variable_registro,
        'label' => templateLabel($campo, $incluirEtiqueta),
        'htmlTable' => $camposInternosHtml
    ]);

    return $html;
}

// Actualiza generarFormularioHTML para aceptar el nombre de la variable de registro
function generarFormularioHTML($campo, $incluirEtiqueta = true, $variable_registro = 'registro')
{
    $html = "";
    $encabezados = "<tr>";

    // construir el encabezado 
    foreach ($campo['Formulario'] as $campo_formulario) {
        $encabezados .= "<th>" . $campo_formulario['Nombre'] . "</th>";
    }

    $encabezados .= "<th style='width: 50px;'>Acciones</th></tr>";


    $cuerpo = "<template x-for='(fila, index) in filas' :key='index'><tr>";
    foreach ($campo['Formulario'] as $campo_formulario) {

        switch ($campo_formulario['Control']) {
            case 'textbox':
                $cuerpo .= "<td>" . textbox($campo_formulario , $incluirEtiqueta, $variable_registro) . "</td>";
                break;
            case 'textarea':
                $cuerpo .= "<td>" . textarea($campo_formulario, $variable_registro, $incluirEtiqueta) . "</td>";
                break;
            case 'select2':
                $cuerpo .= "<td>" . select2($campo_formulario, $variable_registro, $incluirEtiqueta) . "</td>";
                break;
            case 'date2':
                $cuerpo .= "<td>" . date2($campo_formulario, $variable_registro, $incluirEtiqueta) . "</td>";
                break;
        }
    }
    $cuerpo .= "<td> <button type='button' class='btn btn-danger btn-sm' @click='confirm(\"¿Desea continuar?\") ? removeFila(index): null'>Quitar</button> </td>";
    $cuerpo .= "</tr></template>";
    $html = "<table class='table table-sm table-bordered'> <thead> $encabezados </thead> <tbody> $cuerpo </tbody> </table>";
    return $html;
}


?>