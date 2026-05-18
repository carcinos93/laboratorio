<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<style>

:root {
    --offset-x: 1mm;
    --offset-y: 0.5mm;
}

@media print {
    .encabezado {
        display: none;
        width: 0mm;
        height: 0mm;
        margin: 0;
        padding: 0;
    }

    body { margin: 0; }
}

@page {
    size: letter;
    margin: 0;
}

body {
    margin: 0;
    padding: 0;
    background: white;
    font-family: Arial, sans-serif;
}

.sheet {
    width: 215.9mm;
    height: 279.4mm;

    padding-top: 12.7mm;
    padding-left: 4.76mm;

    box-sizing: border-box;

    display: grid;

    grid-template-columns: repeat(3, 66.675mm);
    grid-auto-rows: 25.4mm;

    column-gap: 3.175mm;
    row-gap: 0mm;
}

.label {

    width: 66.675mm;
    height: 25.4mm;

    box-sizing: border-box;

    padding: 1.5mm;

    display: flex;

    justify-content: space-between;

    align-items: center;

    overflow: hidden;
}

@media screen {
    .label {
        border: 1px dashed #ccc;
    }
}




.title {
    font-size: 10pt;
    font-weight: bold;
}

.text {
    font-size: 8pt;
}

.barcode {
    margin-top: 2mm;
    height: 8mm;
}
.right {

    width: 32mm;

    display: flex;

    justify-content: flex-end;

    align-items: center;
}

.left {

    width: 28mm;

    display: flex;
    flex-direction: column;

    justify-content: center;

    overflow: hidden;
}

.btn-imprimir {
    display: block;
    margin: 0 auto;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    background-color: #007bff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

</style>
<body>
    <?php 
        $materiales = array_map(function ($key) {
            return ["NumeroMaster" => $key];
        }, range(1001, 1030));

        $materiales_json = json_encode($materiales);

echo <<<EOT

<div class="contenedor" x-data='{ materiales: {$materiales_json}, imprimir: function() { window.print(); } }'>
    <div class="encabezado" >
        <button class="btn-imprimir" @click="imprimir()">Imprimir</button>
        <h5 x-text="materiales.length"></h5>
    </div>
    <div class="sheet">
            <template x-for="material in materiales">
                <div class="label" x-data="generador(material)" x-init="init()">
                     <div class="left">
                        <div class="code" x-text="material.NumeroMaster"></div>
                    </div>

                    <div class="right">
                        <svg class="barcode"></svg>
                    </div>
                </div>
            </template>
    </div>
</div>
EOT;
    ?>
   
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
    <script>

            document.addEventListener("alpine:init", () => {
                Alpine.data("generador", (material) => {
                    return {
                        material: material,
                        init() {
                            const el = this.$el.querySelector(".barcode");
                            JsBarcode(el, this.material.NumeroMaster, {
                                format: "CODE128",
                                width: 1,
                                height: 25,
                                displayValue: false,
                            margin: 0
                        });
                    }
                }});
            });

    </script>

</body>
</html>