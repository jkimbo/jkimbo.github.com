
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

/*
 * Bigtext.js
 */

;(function(window, $)
{
    var counter = 0,
        $headCache = $('head'),
        BigText = {
            STARTING_PX_FONT_SIZE: 32,
            DEFAULT_MAX_FONT_SIZE_PX: 528,
            GLOBAL_STYLE_ID: 'bigtext-style',
            STYLE_ID: 'bigtext-id',
            LINE_CLASS_PREFIX: 'bigtext-line',
            EXEMPT_CLASS: 'bigtext-exempt',
            DEFAULT_CHILD_SELECTOR: '> div',
            childSelectors: {
                div: '> div',
                ol: '> li',
                ul: '> li'
            },
            init: function()
            {
                if(!$('#'+BigText.GLOBAL_STYLE_ID).length) {
                    $headCache.append(BigText.generateStyleTag(BigText.GLOBAL_STYLE_ID, ['.bigtext * { white-space: nowrap; }',
                                                                                    '.bigtext .' + BigText.EXEMPT_CLASS + ', .bigtext .' + BigText.EXEMPT_CLASS + ' * { white-space: normal; }']));
                }
            },
            bindResize: function(eventName, resizeFunction)
            {
                if($.throttle) {
                    // https://github.com/cowboy/jquery-throttle-debounce
                    $(window).unbind(eventName).bind(eventName, $.throttle(100, resizeFunction));
                } else {
                    if($.fn.smartresize) {
                        // https://github.com/lrbabe/jquery-smartresize/
                        eventName = 'smartresize.' + eventNamespace;
                    }
                    $(window).unbind(eventName).bind(eventName, resizeFunction);
                }
            },
            getStyleId: function(id)
            {
                return BigText.STYLE_ID + '-' + id;
            },
            generateStyleTag: function(id, css)
            {
                return $('<style>' + css.join('\n') + '</style>').attr('id', id);
            },
            clearCss: function(id)
            {
                var styleId = BigText.getStyleId(id);
                $('#' + styleId).remove();
            },
            generateCss: function(id, linesFontSizes, lineWordSpacings)
            {
                var css = [];

                BigText.clearCss(id);

                for(var j=0, k=linesFontSizes.length; j<k; j++) {
                    css.push('#' + id + ' .' + BigText.LINE_CLASS_PREFIX + j + ' {' + 
                        (linesFontSizes[j] ? ' font-size: ' + linesFontSizes[j] + 'px;' : '') + 
                        (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') +
                        '}');
                }

                return BigText.generateStyleTag(BigText.getStyleId(id), css);
            }
        };

    function testLineDimensions($line, maxWidth, property, size, interval, units)
    {
        var width;
        $line.css(property, size + units);

        width = $line.width();

        if(width >= maxWidth) {
            $line.css(property, '');

            if(width == maxWidth) {
                return {
                    match: 'exact',
                    size: parseFloat((parseFloat(size) - .1).toFixed(3))
                };
            }

            return {
                match: 'estimate',
                size: parseFloat((parseFloat(size) - interval).toFixed(3))
            };
        }

        return false;
    }

    function calculateSizes($t, childSelector, maxWidth, maxFontSize)
    {
        var $c = $t.clone(true)
                    .addClass('bigtext-cloned')
                    .css({
                        'min-width': parseInt(maxWidth, 10),
                        width: 'auto',
                        position: 'absolute',
                        left: -9999,
                        top: -9999
                    }).appendTo(document.body);

        // font-size isn't the only thing we can modify, we can also mess with:
        // word-spacing and letter-spacing.
        // Note: webkit does not respect subpixel letter-spacing or word-spacing,
        // nor does it respect hundredths of a font-size em.
        var fontSizes = [],
            wordSpacings = [],
            ratios = [];

        $c.find(childSelector).css({
            float: 'left',
            clear: 'left'
        }).each(function(lineNumber) {
            var $line = $(this),
                intervals = [4,1,.4,.1],
                lineMax;

            if($line.hasClass(BigText.EXEMPT_CLASS)) {
                fontSizes.push(null);
                ratios.push(null);
                return;
            }

            // TODO we can cache this ratio?
            var autoGuessSubtraction = 20, // px
                currentFontSize = parseFloat($line.css('font-size')),
                lineWidth = $line.width(),
                ratio = (lineWidth / currentFontSize).toFixed(6),
                newFontSize = parseFloat(((maxWidth - autoGuessSubtraction) / ratio).toFixed(3));

            outer: for(var m=0, n=intervals.length; m<n; m++) {
                inner: for(var j=1, k=4; j<=k; j++) {
                    if(newFontSize + j*intervals[m] > maxFontSize) {
                        newFontSize = maxFontSize;
                        break outer;
                    }

                    lineMax = testLineDimensions($line, maxWidth, 'font-size', newFontSize + j*intervals[m], intervals[m], 'px');
                    if(lineMax !== false) {
                        newFontSize = lineMax.size;

                        if(lineMax.match == 'exact') {
                            break outer;
                        }
                        break inner;
                    }
                }
            }

            ratios.push(maxWidth / newFontSize);

            if(newFontSize > maxFontSize) {
                fontSizes.push(maxFontSize);
            } else {
                fontSizes.push(newFontSize);
            }
        }).each(function(lineNumber) {
            var $line = $(this),
                wordSpacing = 0,
                interval = 1,
                maxWordSpacing;

            if($line.hasClass(BigText.EXEMPT_CLASS)) {
                wordSpacings.push(null);
                return;
            }

            // must re-use font-size, even though it was removed above.
            $line.css('font-size', fontSizes[lineNumber] + 'px');

            for(var m=1, n=5; m<n; m+=interval) {
                maxWordSpacing = testLineDimensions($line, maxWidth, 'word-spacing', m, interval, 'px');
                if(maxWordSpacing !== false) {
                    wordSpacing = maxWordSpacing.size;
                    break;
                }
            }

            $line.css('font-size', '');
            wordSpacings.push(wordSpacing);
        }).removeAttr('style');

        $c.remove();

        return {
            fontSizes: fontSizes,
            wordSpacings: wordSpacings,
            ratios: ratios
        };
    }

    $.fn.bigtext = function(options)
    {
        BigText.init();

        options = $.extend({
                    maxfontsize: BigText.DEFAULT_MAX_FONT_SIZE_PX,
                    childSelector: '',
                    resize: true
                }, options || {});
    
        return this.each(function()
        {
            var $t = $(this).addClass('bigtext'),
                childSelector = options.childSelector ||
                            BigText.childSelectors[this.tagName.toLowerCase()] ||
                            BigText.DEFAULT_CHILD_SELECTOR,
                maxWidth = $t.width(),
                id = $t.attr('id');

            if(!id) {
                id = 'bigtext-id' + (counter++);
                $t.attr('id', id);
            }

            if(options.resize) {
                BigText.bindResize('resize.bigtext-event-' + id, function()
                {
                    $('#' + id).bigtext(options);
                });
            }

            BigText.clearCss(id);

            $t.find(childSelector).addClass(function(lineNumber, className)
            {
                // remove existing line classes.
                return [className.replace(new RegExp('\\s*' + BigText.LINE_CLASS_PREFIX + '\\d+'), ''),
                        BigText.LINE_CLASS_PREFIX + lineNumber].join(' ');
            });

            var sizes = calculateSizes($t, childSelector, maxWidth, options.maxfontsize);
            $headCache.append(BigText.generateCss(id, sizes.fontSizes, sizes.wordSpacings));
        });
    };

    window.BigText = BigText;
})(this, jQuery);
