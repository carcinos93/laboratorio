(function ($) {
    $.fn['carusel'] = function (options: options)  {
        let html = `<div  class="p-carousel p-carousel-horizontal">
            <div class="p-carousel-content">
                <div class="p-carousel-container p-grid">
                <div class="p-col-1">
                    <button type="button" pripple="" class="p-ripple p-element ng-star-inserted p-carousel-prev p-link"><span class="p-carousel-prev-icon pi pi-chevron-left"></span><span class="p-ink"></span></button>
                </div>
                <div class="p-carousel-items-content p-col-align-center p-col-10">
                    <div class="p-carousel-items-container p-m-auto">
                        <div class="p-carousel-item ">
                            Works
                        </div>
                    </div>
                </div>
                <div class="p-col-1">
                <button type="button" pripple="" class="p-ripple p-element ng-star-inserted p-carousel-next p-link"><span class="p-carousel-prev-icon pi pi-chevron-right"></span><span class="p-ink"></span></button>
                </div>

                </div>
            </div>
        </div>`;

        let o = $(html);

        

        let opts = $.extend( {
            items: []
        }, options );


        this.append( o );

        return this;
    }
}(jQuery));


export interface options 
{
    items: any[]
}

