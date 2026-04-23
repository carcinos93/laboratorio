<?php


$resultados_json = json_encode($resultado[0]);


$html= <<<HTML
<div class="container-fluid mt-4" x-data='$variables_cliente_json' >
    <div class="card mb-4">
        <div class="card-header bg-primary text-white" style="background-color:#123273">
            <h5 class="mb-0">Devolución de material</h5>
        </div>
        <div class="card-body">
            <form action="" method="post" id="formulario-lector">
            <div class="form-group" x-data="{codigoBuscado: '', buscar: function(){
                if (this.codigoBuscado == '') {
                    return;
                }
                document.getElementById('formulario-lector').submit();
            }}">
                <label for="barcode">Escanear / Ingresar Código:</label>
                <input type="text" 
                       id="barcode" 
					   name="codigoBuscado"
                       class="form-control form-control-lg" 
                       x-model="codigoBuscado"
                       @keyup.enter="buscar()"
                       placeholder="Escanea o ingresa el código de barras aquí..."
                       autofocus>
               
            </form>
        </div>
    </div>
    
    <div class="card" x-data='{material: $resultados_json, regresar: function (url) {
        window.location.href = url;
    },
    devolver: function() {
        if (confirm("¿Continuar con la devolución del material?")) {
            document.getElementById("formulario-lector").submit();
        }
    }
}'>
        <div class="card-header text-white" style="background-color:#123273">
            <h5 class="mb-0">Información material</h5>
        </div>
        <div class="card-body grid-container">
            <!-- formulario para regresar material -->
            <form id="formulario-lector" method="post" action="">
                <div >
                        <div class="row">
                            <input name="IdMaterial" type="hidden" x-model="material.id_material" />
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="numeroInventario">N° Inventario:</label>
                                    <input name="numeroInventario" readonly type="text" class="form-control" id="numeroInventario" x-model="material.numero_master">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="titulo">Título:</label>
                                    <input readonly name="titulo" type="text" class="form-control" id="titulo" x-model="material.titulo">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="ubicacionEstante">Ubicación Estante:</label>
                                    <input readonly name="ubicacionEstante" type="text" class="form-control" id="ubicacion" x-model="material.UbicacionEstante">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="tipoMaterial">Tipo Material:</label>
                                    <input readonly name="tipoMaterial" type="text" class="form-control" id="tipoMaterial" x-model="material.tipo_material">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="fechaPrestamo">Fecha de Préstamo:</label>
                                    <input readonly name="fechaPrestamo" type="text" class="form-control" id="fechaPrestamo" x-model="material.fecha_prestamo">
                                </div>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <label for="diasPrestamo">Dias del Préstamo:</label>
                                    <input readonly name="diasPrestamo" type="text" class="form-control" id="diasPrestamo" x-model="material.dias_prestamo">
                                </div>
                            </div>
                            <div x-show="material.atraso != null && parseInt(material.atraso) < 0" class="col-12" >
                                <div class="form-group has-error">
                                    <label for="atraso">Dias de atraso:</label>
                                    <input readonly name="atraso" type="text" class="form-control text-danger" id="atraso" x-model="material.atraso">
                                </div>
                            </div>
                            <div class="col-12 mt-3">
                                <button class="btn btn-primary" :disabled="material.id_material == null" @click="devolver" type="button">Devolver</button>
                                <button class="btn btn-danger" type="button" @click="regresar('$url_menu')">Regresar</button>
                            </div>
                        </div>
                    
                </div>
            </form>
            
            <div x-show="material.id_material == null && codigo_anterior != null" class="alert alert-warning text-center">
                Material no encontrado
            </div>
        </div>
    </div>
</div>
HTML;

echo $html;
