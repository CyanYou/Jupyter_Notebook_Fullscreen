define([
    'base/js/namespace'
], function(
    Jupyter // include Jupyter to add button
) {

    function toggleFullscreen(elem) { // function to make element (content) fullscreen on most browsers
        elem = elem || document.documentElement;
        if (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } 
        }
    }

    function load_ipython_extension() {
        var handler = function () {
            $('.cell.code_cell.selected').each(function() {
                var outputArea = $(this).find('.output_area'); // select the output area
                if (outputArea.length) {
                    var content = outputArea.find('.output_subarea'); // find the content inside the output area
                    if (content.length) {
                        // Apply CSS to remove edges and ensure fullscreen
                        content.css({
                            'background-color': 'transparent',
                            'margin': 0,
                            'padding': 0,
                            'border': 'none',
                            'position': 'relative',
                            'width': '100%',
                            'height': '100%',
                            'overflow': 'hidden'
                        });
                        toggleFullscreen(content[0]); // fullscreen the content

                        // Additional handling for GL viewer canvas
                        var canvas = content.find('canvas');
                        if (canvas.length) {
                            content.css({
                                'position': 'relative',
                                'width': '100%',
                                'height': '100%',
                                'padding-bottom': '100%' // Create a square aspect ratio
                            });
                            canvas.css({
                                'position': 'absolute',
                                'top': 0,
                                'left': 0,
                                'width': '100%',
                                'height': '100%',
                                'object-fit': 'contain' // Maintain aspect ratio
                            });
                        }
                    }
                }
            });
        };

        var action = {
            icon: 'fa-arrows-alt', // cross of arrows to indicate expand to fullscreen
            help: 'expand cell output content to fullscreen', // mouseover text
            help_index: 'zz',
            handler: handler
        };
        var prefix = 'expand-cell-fullscreen';
        var action_name = 'expand-cell-fullscreen';

        var full_action_name = Jupyter.actions.register(action, action_name, prefix);
        Jupyter.toolbar.add_buttons_group([full_action_name]); // add button to toolbar
    }

    return {
        load_ipython_extension: load_ipython_extension
    };
});
