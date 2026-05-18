/**
 * inicio
 */

interface IBaseControl {
        init: () => void;
        initControl: () => void;
        element: () => HTMLElement;
        value: string;
        field: string;
        variable_registro: string;
        required: boolean;
        validaciones: Array<Object>;
        validate: () => void;
        isValid: boolean;
        $dispatch?: (event: string, detail?: any) => void;
        $watch?: (property: string, callback: (value: any, oldValue: any) => void) => void;
        errores?: { [index: string]: Array<string> };
        registro?: { [index: string]: string | number | boolean | Array<string> };
    }
interface IBaseControlSelect extends IBaseControl {
    ismulti: boolean;
}

class formulario_init {
    el_frame: HTMLIFrameElement | null = null;
    cambiarUrl(url: string) {
        this.el_frame.src = url;
    }
    constructor(id_frame: string, container: Element | string, acciones: { [key: string]: () => void }) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.innerHTML = '';
        this.el_frame = document.createElement('iframe');
        //this.el_frame.src;
        this.el_frame.id = id_frame;
        this.el_frame.style.width = '100%';
        this.el_frame.style.border = 'none !important';
        this.el_frame.style.overflow = 'hidden';
        this.el_frame.scrolling = 'no';
        this.el_frame.setAttribute('seamless', 'seamless');
        container.appendChild(this.el_frame);
        this.el_frame.onload = () => {
            if (this.el_frame.contentWindow) {
                const doc = this.el_frame.contentWindow.document;
                const body = doc.body;
                const html = doc.documentElement;
                const height = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );
                this.el_frame.style.height = (height + 20) + 'px';
            }
        }

        window.addEventListener('message', (evt: any) => {
            if (evt.origin !== window.location.origin) return;
            const data = evt.data;
            for (const key in acciones) {
                if (data.type === 'formulario' && data.accion === key) {
                    acciones[key].call(this, data);
                }
            }
        })
    }
    ejecutarAccion(accion: string) {
        if (this.el_frame) {
            this.el_frame.contentWindow.postMessage({ type: 'formulario', accion: accion, id_frame: this.el_frame.id }, window.location.origin);
        }
    }
}

function loadForm(url: string, query: string, id_frame: string, accionGuardar: () => void = () => {}) {
    const container: HTMLElement = document.querySelector(query);
    if (container) {
        container.innerHTML = '';
        const iframe: HTMLIFrameElement = document.createElement('iframe');
        iframe.src = url;
        iframe.id = id_frame;
        iframe.style.width = '100%';
        iframe.style.border = 'none !important';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';
        iframe.setAttribute('seamless', 'seamless');
        container.appendChild(iframe);
        iframe.onload = () => {
            if (iframe.contentWindow) {
                const doc = iframe.contentWindow.document;
                const body = doc.body;
                const html = doc.documentElement;
                const height = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight
                );
                iframe.style.height = (height + 20) + 'px';
            }
        }

        window.addEventListener('message', (evt: any) => {
            if (evt.origin !== window.location.origin) return;
            const data = evt.data;
            if (data.type === 'formulario' && data.accion === 'guardar') {
                accionGuardar();
            }
        })

        // objeto a nivel de windows del formulario del iframe para que pueda ser llamado desde el formulario
        window[id_frame] = {
            guardar: () => {
                iframe.contentWindow.postMessage({ type: 'formulario', accion: 'guardar', id_frame: id_frame }, window.location.origin);
            }
        }
    }
}

function ejecutarApi(data: Object, url: string, metodo: string = 'POST', evento: string = 'formulario') {
   $.ajax({
        type: metodo,
        url: url, // La misma app
        data: data,
        success: function(response) {
            console.log("Respuesta del servidor: ", response);
            window.parent.postMessage({ type: 'formulario', accion: evento, response: response }, window.location.origin);
        },
        error: function(error) {
            console.error("Error: ", error);
        }
    });
}

document.addEventListener("alpine:init", () => {

    window.addEventListener('message', (evt: any) => {
        if (evt.origin !== window.location.origin) return;
        const data = evt.data;
        if (data.type === 'dialog') {
            window.dispatchEvent(new CustomEvent('dialog', {
                    detail: { ...data }
            }));
        }
        /*if (data.type === 'formulario' && data.accion === 'guardar') {
            alert(data.id_frame);
        }*/
    })
    // combinar validaciones con validaciones que vienen de la base de datos
    const formatMessage = (message:string, vars: any = {}) => {
        Object.keys(vars).forEach((key) => {
            message = message.replace(new RegExp(`{${key}}`, 'g'), String(vars[key]));
        })
        return message;
    }
    const listaValidaciones = {
        // @ts-ignore
        ...window.validaciones,
        regex: (value: string, message: string = 'Valor invalido', regex: string) => {
            const testRegex = new RegExp(regex);
            if (value !== '' && !(testRegex.test(value))) {
                return message;
            }
            return true;
        },
        requerido: (value: string, message: string = 'Valor requerido') => {
            if (value === '' || value === null || value === undefined) {
                return message;
            }
            return true;
        },
        longitudMaxima: (value: string, message: string = 'Valor excede la longitud maxima', maxLength: number) => {
            if (value !== '' && value.length > maxLength) {
                return message;
            }
            return true;
        },
        longitudMinima: (value: string, message: string = 'Valor no cumple con la longitud minima', minLength: number) => {
            if (value !== '' && value.length < minLength) {
                return message;
            }
            return true;
        },
        soloNumeros: (value: string, message: string = 'Solo se permiten numeros') => {
            if (value !== '' && !/^[0-9]+$/.test(value)) {
                return message;
            }
            return true;
        },
        entreValores: (value: any, message: string = 'Valor no esta entre los valores permitidos', min: any, max: any) => {
            const valor = Number(value);
            const valorMin = Number(min);
            const valorMax = Number(max);
            if (value !== '' && (valor < valorMin || valor > valorMax)) {
                return message;
            }
            return true;
        },
        contarPalabras: (value: string, message: string = 'Valor no cumple con la cantidad de palabras: {maximo}', maximo: number) => {
            const palabras = value.split(' ').filter((palabra: string) => palabra.trim() !== '');
            if (value !== '' && palabras.length > maximo) {
                return formatMessage(message, {maximo});
            }
            return true;
        }
    }
    


    // @ts-ignore
    Alpine.data("dialog", () => ({
        show: false,
        loading: false,
        url: '',
        open(url: string) {
            this.url = url;
            this.show = true;
            this.loading = true;
        },
        close() {
            this.show = false;
            this.url = '';
            this.loading = false;
        }
    }))

    const baseControl = (field: string,selector: string, required: boolean = false, validaciones: Array<Object> = [], variable_registro: string): IBaseControl => ({
        isValid: false,
        value: '',
        field: field,
        required: required,
        validaciones: validaciones,
        variable_registro: variable_registro,
        init() {
            let $this = this; 
            if (!$this) return;
            if ($this.required) {
                $this.validaciones.push({
                    Metodo: 'requerido',
                    Mensaje: 'Campo requerido',
                })
            }
            $this.initControl();
            $this.$nextTick(() => {
                $this.$watch($this.variable_registro + '.' + $this.field, (value: any) => {
                    $this.value = value;
                    $this.validate()
                });
            });

        },
        initControl() {},
        element() {
            const el = this.$el.querySelector(selector);
            return el;
        },

        validate() {
            const el: HTMLElement = this.element();
            if (!el) return; 
                /*const error = el.parentElement?.querySelector('.error');
                error.textContent = '';
                error.classList.remove('show');*/
                this.isValid = true;
                // antes de validar los errores, se inicializa como vacio, para quitar las validaciones anteriores
                for (const validacion of this.validaciones) {

                    const argumentos = (validacion.Argumentos ?? "").split(",");
                    const resultado = listaValidaciones[validacion.Metodo](this.value, validacion.Mensaje, ...argumentos);
                    if (resultado !== true) {
                        this.errores = this.errores ?? {};
                        this.errores[field] = this.errores[field] ?? {};
                        this.errores[field][validacion.Metodo] = resultado;
                        //error.textContent = resultado;
                        //error.classList.add('show');
                        this.isValid = false;
                    } else {
                        if (this.errores[field] && this.errores[field][validacion.Metodo]) {
                            delete this.errores[field][validacion.Metodo];
                            if (Object.keys(this.errores[field]).length === 0) {
                                delete this.errores[field];
                            }
                        }
                    }
                }
            
        }
    })
    // @ts-ignore
    Alpine.data("textbox", (field: string, variable_registro: string = 'registro', required: boolean = false, validaciones: Array<Object> = []) => {
        return {...baseControl(field,"input.control",required, validaciones, variable_registro) };
    })

    // @ts-ignore
    Alpine.data("date2", (field: string, variable_registro: string = 'registro', required: boolean = false, validaciones: Array<Object> = [], validateConfig?: {
        onBlur?: boolean,
        onInput?: boolean,
    }) => {
        let config = {
            onBlur: false,
            onInput: false,
            ...validateConfig
        }
        return {...baseControl(field,"input.control",required, validaciones, variable_registro),    
        
        initControl() {
            var $this: IBaseControl = this ;
            // @ts-ignore
            if (window.flatpickr && $this.element()) {
                // @ts-ignore
                const flatpickr = window.flatpickr($this.element(), {
                    dateFormat: 'Y-m-d',
                    locale: 'es',
                    allowInput: true,
                    altInput: false,
                    altFormat: 'Y-m-d',
                    onChange: (selectedDates: any[], dateStr: string, instance: any) => {
                        $this.value = dateStr;
                        $this.validate();
                        $this[variable_registro][$this.field] = dateStr;
                    },
                    onReady: (selectedDates: any[], dateStr: string, instance: any) => {
                        if (config.onBlur) {
                            $this.element().addEventListener('blur', () => {
                                $this.value = ($this.element() as any).value
                                $this.validate();
                            });
                        }
                        if (config.onInput) {
                            $this.element().addEventListener('input', () => {
                                $this.value = ($this.element() as any).value
                                $this.validate();
                            });
                        }
                    }
                });
       
                if ($this[variable_registro] && $this[variable_registro][$this.field] && $this[variable_registro][$this.field] !== '') {
                    flatpickr.setDate($this[variable_registro][$this.field], true, 'Y-m-d');
                 
                }
                
            }
        },
    }
    })

    // @ts-ignore
    Alpine.data("textarea", (field: string, variable_registro: string = 'registro',required: boolean = false, validaciones: Array<Object> = []) => {
        return {...baseControl(field,"textarea.control",required, validaciones, variable_registro) };
    })
    // @ts-ignore
    Alpine.data("select2", (field: string, variable_registro: string, ismulti: boolean = false, required: boolean = false, validaciones: Array<Object> = []): IBaseControlSelect => ({
        ...baseControl(field,"select.control",required, validaciones, variable_registro),
        ismulti: ismulti,
        initControl() {
            var $this: IBaseControlSelect = this ;
            $($this.element()).select2({
                allowClear: true,
                multiple: this.ismulti,

            });
            $($this.element()).val("").trigger('change');

            if ($this[variable_registro] && $this[variable_registro][$this.field] && $this[variable_registro][$this.field] !== '') {
                const val = $this.ismulti ? ($this[variable_registro][$this.field] as string).split(";") : $this[variable_registro][$this.field];
                $($this.element()).val(val as any);
                $($this.element()).trigger('change');
            }

            $($this.element()).on('change', (e: any) => {
                const val =  $this.ismulti ? $(e.target).val().join(";") : $(e.target).val();
                $this.value = val;
                //$this.$dispatch('change-select2', { value: val, field: $this.field });
                $this[variable_registro][$this.field] = val;
            });
        }
    }
    ));

    // @ts-ignore
    Alpine.data('gridForm', (field: string, variable_registro: string = 'registro', required: boolean = false, validaciones: Array<Object> = []) => {
    return {
        ...baseControl(field, "div.control", required, validaciones, variable_registro),
        filas: [],
        initControl() {

            // Inicializar con los datos existentes o un array vacío
            if (this[variable_registro] ) {
                if (this[variable_registro][this.field]) {
                    this.filas = this[variable_registro][this.field];
                } else {
                    this.filas = [];
                    this[variable_registro][this.field] = this.filas;
                }
            }
        },

        addFila(objetoInicial: any = {}) {
            this.filas.push(objetoInicial);
        },

        removeFila(index: number) {
            this.filas.splice(index, 1);
        }
    };
});
   
})