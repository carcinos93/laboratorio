"use strict";
exports.__esModule = true;
(function ($) {
    $.fn['carusel'] = function (options) {
        var html = "<div  class=\"p-carousel p-carousel-horizontal\">\n            <div class=\"p-carousel-content\">\n                <div class=\"p-carousel-container p-grid\">\n                <div class=\"p-col-1\">\n                    <button type=\"button\" pripple=\"\" class=\"p-ripple p-element ng-star-inserted p-carousel-prev p-link\"><span class=\"p-carousel-prev-icon pi pi-chevron-left\"></span><span class=\"p-ink\"></span></button>\n                </div>\n                <div class=\"p-carousel-items-content p-col-align-center p-col-10\">\n                    <div class=\"p-carousel-items-container p-m-auto\">\n                        <div class=\"p-carousel-item \">\n                            Works\n                        </div>\n                    </div>\n                </div>\n                <div class=\"p-col-1\">\n                <button type=\"button\" pripple=\"\" class=\"p-ripple p-element ng-star-inserted p-carousel-next p-link\"><span class=\"p-carousel-prev-icon pi pi-chevron-right\"></span><span class=\"p-ink\"></span></button>\n                </div>\n\n                </div>\n            </div>\n        </div>";
        var o = $(html);
        var opts = $.extend({
            items: []
        }, options);
        this.append(o);
        return this;
    };
}(jQuery));
