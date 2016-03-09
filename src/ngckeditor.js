/**
 * ngCkeditor
 *
 * @author Douglas Lira <douglas.lira.web@gmail.com>
 * @url https://github.com/douglaslira/directives/ngckeditor/
 */

(function(){

    'use strict';

    angular.module('nyx.components', []);
    angular.module('nyx.components').directive('ngCkeditor', ngCkeditor);

    ngCkeditor.$inject = ['$parse'];

    function ngCkeditor($parse) {

        CKEDITOR.disableAutoInline = true;
        var counter = 0, prefix = '__htmlEDITOR_';

        return {
            restrict: 'A',
            link: link
        };

        ////////////////////////////

        function link(scope, element, attrs) {
            var gets = $parse(attrs.ngCkeditor),
                sets = gets.assign,
                type = attrs.editorType,
                options = {},
                mustRefreshEditor = true;

            attrs.$set('contenteditable', true);
            if (!attrs.id) {
                attrs.$set('id', prefix + (++counter));
            }

            if(type == "simple") {
                options.toolbarGroups = [
                    { name: 'document',    groups: [ 'mode', 'document', 'doctools' ] },
                    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
                    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
                    { name: 'forms' },
                    '/',
                    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
                    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
                    { name: 'links' },
                    { name: 'insert' },
                    '/',
                    { name: 'styles' },
                    { name: 'colors' },
                    { name: 'tools' },
                    { name: 'others' },
                    { name: 'about' }
                ]
            }

            options.disableNativeSpellChecker = true;
            options.extraPlugins = 'dialog,scayt,wsc,image';

            // UPLOAD URL
            options.filebrowserImageUploadUrl = 'index.php';

            options.on = {
                "change": function (e) {
                    if (e.editor.checkDirty()) {
                        var ckValue = e.editor.getData();
                        scope.$apply(function () {
                            mustRefreshEditor = false;
                            sets(scope, ckValue);
                        });
                        ckValue = null;
                        e.editor.resetDirty();
                    }
                }
            };

            // Initialize
            var editorComponent = CKEDITOR.replace(element[0], options);
            scope.$watch(attrs.ngCkeditor, function (value) {
                if (mustRefreshEditor) {
                    editorComponent.setData(value);
                } else {
                    mustRefreshEditor = true;
                }
            });
        }

    };

})();