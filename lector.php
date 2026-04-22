<?php


$resultados_json = json_encode($resultado[0]);

$html= <<<HTML
<div class="container mt-4" >
    <div class="card mb-4">
        <div class="card-header bg-primary text-white">
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
    
    <div class="card" x-data="{material: $resultados_json}">
        <div class="card-header bg-secondary text-white">
            <h5 class="mb-0">Lista de Productos</h5>
        </div>
        <div class="card-body grid-container">
            <!-- formulario para regresar material -->
            <form method="post" action="">
                <div >
                        <div class="row">
                            <input name="IdMaterial" type="hidden" x-model="material.IdMaterial" />
                            <div class="col-md-6">
                                <label for="numeroInventario">N° Inventario:</label>
                                <input name="numeroInventario" type="text" class="form-control" id="numeroInventario" x-model="material.NumeroMaster">
                            </div>
                            <div class="col-md-6">
                                <label for="titulo">Título:</label>
                                <input name="titulo" type="text" class="form-control" id="titulo" x-model="material.Titulo">
                            </div>
                            <div class="col-md-6">
                                <label for="ubicacionEstante">Ubicación Estante:</label>
                                <input name="ubicacionEstante" type="text" class="form-control" id="ubicacionEstante" x-model="material.UbicacionEstante">
                            </div>
                            <div class="col-md-6">
                                <label for="tipoMaterial">Tipo Material:</label>
                                <input name="tipoMaterial" type="text" class="form-control" id="tipoMaterial" x-model="material.TipoMaterial">
                            </div>
                            <div class="col-md-12">
                                <button class="btn btn-primary" x-if="material.IdMaterial != null" type="submit">Devolver</button>
                            </div>
                        </div>
                    
                </div>
            </form>
            
            <!-- Mensaje cuando no hay resultados -->
            <div x-show="material.IdMaterial == null" class="alert alert-warning text-center">
                Material no encontrado
            </div>
        </div>
    </div>
</div>
HTML;

echo $html;

