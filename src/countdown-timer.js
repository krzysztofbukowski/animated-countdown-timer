/**
 * Created by krzysztof <ja@krzysztofbukowski.pl> on 11/17/16.
 */
(function ($) {
    "use strict";

    /**
     * Builds the clock template based on specified values
     */
    function TemplateBuilder(formatter) {
        var _hours = '00',
            _minutes = '00',
            _seconds = '00',
            _separator = ':';


        this.setMinutes = function(minutes) {
            _minutes = minutes;
            return this;
        };

        this.setSeconds = function(seconds) {
            _seconds = seconds;
            return this;
        };

        this.setHours = function(hours) {
            _hours = hours;
            return this;
        };

        this.setSeparator = function(separator) {
            _separator = separator;
            return this;
        };

        this.build = function() {
            var result = '<div class="hours part"><span class="new">{hours}</span></div>' +
                '<div class="separator">{separator}</div>' +
                '<div class="minutes part"><span class="new">{minutes}</span></div>' +
                '<div class="separator">{separator}</div>' +
                '<div class="seconds part"><span class="new">{seconds}</span></div>';

            return result.replace(/\{hours\}/g, _hours)
                .replace(/\{minutes\}/g, _minutes)
                .replace(/\{seconds\}/g, _seconds)
                .replace(/\{separator\}/g, _separator);
        }
    }

    function getTimeParts(finalDate, formatter) {
        var current = (new Date().getTime());
        var diff = Math.floor((finalDate - current)/1000),
            hours = 0,
            minutes = 0,
            seconds = 0;

        minutes = Math.floor(diff/60);
        seconds = diff - minutes * 60;

        if (minutes >= 60) {
            hours = Math.floor(minutes/60);
            minutes = minutes - hours * 60;
        }

        return {
            seconds : formatter.format(seconds),
            minutes : formatter.format(minutes),
            hours : formatter.format(hours)
        }
    }

    function PrependZeroFormatter() {
        return {
            format: function(part) {
                if (part < 10) {
                    part = '0' + part;
                }
                return part;
            }
        }
    }

    /**
     * CountdownTimer class
     */
    function CountdownTimer(options, element) {
        this.options = $.extend({
            separator: ':'
        }, options );

        this.element = element;

        var finalDate = (new Date(options.finalDate)).getTime(),
            templateBuilder = new TemplateBuilder(),
            _instance = this;

        var parts = getTimeParts(finalDate, new PrependZeroFormatter());
        templateBuilder
            .setSeconds(parts.seconds)
            .setMinutes(parts.minutes)
            .setHours(parts.hours);

        element.html(templateBuilder.build());
        var $hours = element.find('.hours'),
            $minutes = element.find('.minutes'),
            $seconds = element.find('.seconds');

        if (typeof options.onReady == 'function') {
            options.onReady(element);
        }

        setInterval(function() {
            var parts = getTimeParts(finalDate, new PrependZeroFormatter());

            $hours.find('.new').html(parts.hours);
            $minutes.find('.new').html(parts.minutes);
            $seconds.find('.new').html(parts.seconds);

            if (typeof options.onUpdate == 'function') {
                options.onUpdate(_instance);
            }
        }, 1000, templateBuilder, finalDate);
    };


    $.fn.countdownTimer = function(options) {
        var instances = {};
        var selector = $(this).selector;

        $(this).each(function(index) {
            instances[selector] = instances[selector] || [];
            instances[selector][index] = new CountdownTimer(options, $(this));
        });
    };
})(window.jQuery);
