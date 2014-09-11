angular.module('angularFlash', [])

    .factory('flash', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        $rootScope.flash = {};
        $rootScope.flashModal = {};

        var cleanup = function () {
            $rootScope.flash.messages = [];
            $rootScope.flashModal.messages = [];
        };

        var emit = function (obj) {
            if ($('#divModal').attr('id') === undefined) {
                $rootScope.flash = obj;
            } else {
                $rootScope.flashModal = obj;
            }
        };

        $rootScope.$on('$locationChangeSuccess', cleanup);
        $rootScope.$on('cleanup-flash-messages', cleanup);

        $rootScope.onEscPress = function (event) {
            if (event.keyCode === 27) {
                cleanup();
            }
        };

        var flash = function (messages, level) {
            cleanup();

            // Eleva a página ao topo
            $('html').animate({scrollTop: 0},'slow');

            $timeout(function () {
                emit({
                    type: { custom: true },
                    messages: angular.isArray(messages) ? messages : [messages],
                    level: level
                });
            });
        };

        return flash;
    }])
;
