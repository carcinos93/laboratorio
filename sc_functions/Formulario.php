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
    return $incluirEtiqueta ? replaceTemplate("<label for='% nombre %'>% nombre % % etiqueta %</label>", [
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta']
    ]) : "";

}
	
function textbox($campo, $incluirEtiqueta = true)
{
    $html = replaceTemplate("<div x-data=\"textbox('% tabla_columna %', % requerido %, % validaciones %)\" class='form-group'>
            % label %
            <input type='text' x-model='registro.% tabla_columna %' class='form-control' placeholder='% nombre %' x-init='init()'/>
            <span class='error'></span>
        </div>", [
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'label' => templateLabel($campo, $incluirEtiqueta)
    ]);

    return $html;
}

function textarea($campo, $incluirEtiqueta = true)
{
    $html = replaceTemplate("<div x-data='textarea(\"% tabla_columna %\",% requerido %, % validaciones %)' class='form-group'>
            % label %
            <textarea class='form-control' x-model='registro.% tabla_columna %' placeholder='% nombre %' x-init='init()'></textarea>
            <span class='error'></span>
        </div>", [
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'label' => templateLabel($campo, $incluirEtiqueta)
    ]);

    return $html;
}

function select2($campo, $incluirEtiqueta = true)
{
    $html = replaceTemplate("<div x-data='select2(\"% tabla_columna %\", % ismulti %, % requerido %, % validaciones %)' class='form-group'>
            % label %
            <select class='form-control' placeholder='% nombre %' x-init='init()'>
                % primerOpcion %
                % valores %
            </select>
            <span class='error'></span>
        </div>", [
        'multiple' =>  $campo["Multiple"] ? 'multiple="multiple"' : '',
        'ismulti' => $campo["Multiple"] ? 'true' : 'false',
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'label' => templateLabel($campo, $incluirEtiqueta),
        'valores' => templateValores($campo['Valores']),
        'primerOpcion' => $campo["Multiple"] ? "" : "<option value=''>Seleccione una opción</option>"
    ]);

    return $html;
}

function date($campo, $incluirEtiqueta = true)
{
    $html = replaceTemplate("<div x-data='date(\"% tabla_columna %\", % requerido %, % validaciones %)' class='form-group'>
            % label %
            <input type='date' x-model='registro.% tabla_columna %' class='form-control' placeholder='% nombre %' x-init='init()'>
            <span class='error'></span>
        </div>", [
        'requerido' => $campo['Requerido'] ? 'true' : 'false',
        'validaciones' => json_encode(isset($campo['Validaciones']) ? $campo['Validaciones'] : []),
        'tabla_columna' => $campo['TablaColumna'],
        'nombre' => $campo['Nombre'],
        'etiqueta' => $campo['Etiqueta'],
        'label' => templateLabel($campo, $incluirEtiqueta)
    ]);

    return $html;
}



?>