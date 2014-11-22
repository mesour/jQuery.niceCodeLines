/*
 * jquery.niceCodeLines
 *
 * @version 0.1.0
 *
 * Copyright (c) 2014 Matouš Němec
 *
 * Licensed under MIT license:
 *      http://www.opensource.org/licenses/mit-license.php
 *
 * Documentation
 *      https://github.com/mesour/jQuery.niceCodeLines#initialization
 */
(function($) {
    $.nice = $.nice || {};
    $.nice.codeLines = {
        version: '0.1.0',
        pluginName: $.nice.codeLines && $.nice.codeLines.pluginName || 'niceCodeLines',
        dataName: 'ncl',
        boxCount: 0,
        options: {

            wrapperClass: 'nice-code-lines',

            scrollAbout: 0,

            applyHashAfterReady: true,

            urlHashMatch: function() {}

        }
    };
    $.fn[$.nice.codeLines.pluginName] = function(parameters) {
        var options = $.extend({}, $.nice.codeLines.options, parameters);
        this.each(function() {
            var $this = $(this);
            if(!$this.is('pre')) return;
            if(!$this.data($.nice.codeLines.dataName)) {
                if(typeof parameters === 'string') return;
                $this.data($.nice.codeLines.dataName, new CodeLines($this, options));
            }
            if(parameters === 'findByHash') {
                $this.data($.nice.codeLines.dataName).findByHash();
            }
        });
    };

    var CodeLines = function(element, options) {
        $.nice.codeLines.boxCount++;
        var boxNum = $.nice.codeLines.boxCount,
            lines = element.html().split("\n");

        element.attr('data-box', boxNum);

        var leftColumn = $('<div>');
        leftColumn.addClass('line-numbers');

        var html = '', line = 0;
        $.each(lines, function(n, elem) {
            line = (n + 1);
            html += '<span data-id="L'+line+'-' + boxNum + '">' + (!elem ? '&nbsp;' : elem) + '</span><br>';
            leftColumn.append('<a id="L' + line + '-' + boxNum + '"><i class="glyphicon glyphicon-link"></i> ' + line + '</a>');
        });

        var wrapper = $('<div>');
        wrapper.addClass(options.wrapperClass);

        var content = $('<code>');
        content.append(html);

        element.wrap(wrapper);
        element.empty().append(content);
        element.before(leftColumn);

        wrapper = content.closest('.' + options.wrapperClass);

        var last_id = 0;

        var removeHighlighted = function() {
            content.find('.highlighted').removeClass('highlighted');
        };

        var changeHash = function(id) {
            if(history.pushState) {
                history.pushState(null, null, '#' + id);
            } else {
                location.hash = '#' + id;
            }
        };

        leftColumn.find('a').on('click', function(e) {
            var _$this = $(this),
                id = _$this.attr('id').split('-')[0],
                num = Number(id.replace('L', ''));

            if(e.shiftKey && last_id !== 0 && last_id !== num) {
                var from, to;
                if(last_id > num) {
                    from = num;
                    to = last_id;
                } else {
                    from = last_id;
                    to = num;
                }
                removeHighlighted();
                for(var x = from; x < to + 1; x++) {
                    content.find('[data-id="L'+x+'-'+boxNum+'"]').addClass('highlighted');
                }
                changeHash('L'+from+'-'+to+'/'+boxNum);
            } else {
                removeHighlighted();
                content.find('[data-id="L'+num+'-'+boxNum+'"]').addClass('highlighted');
                changeHash(id+'/'+boxNum);
                last_id = num;
            }
        });

        var fixBox = function() {
            var padding = $('pre.php').outerHeight()-$('pre.php').height();

            var contentHeight = content.outerHeight() + padding;
            var numbersHeight = leftColumn.outerHeight();

            while(numbersHeight < contentHeight) {
                content.width(content.width()+10);
                contentHeight = content.outerHeight() + padding;
            }
        };
        fixBox();
        $(window).on('resize', fixBox);

        var findByHash = function() {
            var splittedHash = location.hash.split('/'),
                hash = splittedHash[0];

            if(!hash.match(/.+-.+/)) {
                $(window).scrollTop($(hash+'-'+boxNum).offset().top + options.scrollAbout);
                content.find('[data-id="'+(hash.replace('#', ''))+'-' + boxNum + '"]').addClass('highlighted');
            } else {
                var splitted = hash.replace('#', '').replace('L', '').split('-');
                var from = Number(splitted[0]),
                    to = Number(splitted[1]);
                $(window).scrollTop($('#L'+from+'-'+boxNum).offset().top + options.scrollAbout);
                for(var x = from; x < to + 1; x++) {
                    content.find('[data-id="L'+x+'-' + boxNum + '"]').addClass('highlighted');
                }
            }
        };

        this.findByHash = function() {
            findByHash();
        };

        if(location.hash.match(new RegExp("^#L[0-9]+-?[0-9]*/" + boxNum + "$"))) {
            if(options.applyHashAfterReady) {
                findByHash();
            } else {
                options.urlHashMatch.apply(wrapper.get(0), [this]);
            }
        }
    };
})(jQuery);