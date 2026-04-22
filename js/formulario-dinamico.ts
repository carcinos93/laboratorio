/**
 * inicio
 */

interface IBaseControl {
        init: () => void;
        initControl: () => void;
        element: () => HTMLElement;
        value: string;
        field: string;
        required: boolean;
        validaciones: Array<Object>;
        validate: () => void;
        $dispatch?: (event: string, detail?: any) => void;
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
        }}
    


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

    const baseControl = (field: string,selector: string, required: boolean = false, validaciones: Array<Object> = []): IBaseControl => ({
        init() {
            if (this.required) {
                this.validaciones.push({
                    Metodo: 'requerido',
                    Mensaje: 'Campo requerido',
                })
            }
            this.initControl();
            this.$nextTick(() => {
                this.$watch('value', (value: any) => {
                    this.validate()
                });
            });

        },
        initControl() {},
        element() {
            const el = this.$el.querySelector(selector);
            return el;
        },
        value: '',
        field: field,
        required: required,
        validaciones: validaciones,
        validate() {
            const el: HTMLElement = this.element();
            if (!el) return; 
            const error = el.parentElement?.querySelector('.error');
                error.textContent = '';
                error.classList.remove('show');
                for (const validacion of this.validaciones) {
                    const argumentos = (validacion.Argumentos ?? "").split(",");
                    const resultado = listaValidaciones[validacion.Metodo](this.value, validacion.Mensaje, ...argumentos);
                    if (resultado !== true) {
                        error.textContent = resultado;
                        error.classList.add('show');
                        break;
                    }
                }
            
        }
    })
    // @ts-ignore
    Alpine.data("textbox", (field: string, required: boolean = false, validaciones: Array<Object> = []) => {
        return {...baseControl(field,"input",required, validaciones) };
    })

    // @ts-ignore
    Alpine.data("textarea", (field: string, required: boolean = false, validaciones: Array<Object> = []) => {
        return {...baseControl(field,"textarea",required, validaciones) };
    })
    // @ts-ignore
    Alpine.data("select2", (field: string, ismulti: boolean = false, required: boolean = false, validaciones: Array<Object> = []): IBaseControlSelect => ({
        ...baseControl(field,"select",required, validaciones),
        ismulti: ismulti,
        initControl() {
            var $this: IBaseControlSelect = this ;
            $($this.element()).select2({
                allowClear: true,
                multiple: this.ismulti,

            });
            if ($this.registro[$this.field] && $this.registro[$this.field] !== '') {
                const val = $this.ismulti ? ($this.registro[$this.field] as string).split(";") : $this.registro[$this.field];
                console.log($this.field, val);
                $($this.element()).val(val as any);
                $($this.element()).trigger('change');
            }

            $($this.element()).on('change', (e: any) => {
                const val =  $this.ismulti ? $(e.target).val().join(";") : $(e.target).val();
                $this.value = val;
                //$this.$dispatch('change-select2', { value: val, field: $this.field });
                $this.registro[$this.field] = val;
            });
        }
    }

    ))
})