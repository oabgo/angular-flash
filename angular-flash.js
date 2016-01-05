angular.module('angularFlash', [])

    .factory('flash', ['$rootScope', '$timeout', function ($rootScope, $timeout) {

        $rootScope.flash = {};
        $rootScope.flashModal = {};
        $rootScope.flash_hide = true;
        $rootScope.flashModal_hide = true;

        var cleanup = function () {
            $rootScope.flash.messages = [];
            $rootScope.flash_hide = true;
            $rootScope.flashModal.messages = [];
            $rootScope.flashModal_hide = true;
        };

        var emit = function (obj) {
            if ($('#divModal').attr('id') === undefined) {
                $rootScope.flash = obj;
                $rootScope.flash_hide = false;
            } else {
                $rootScope.flashModal = obj;
                $rootScope.flashModal_hide = false;
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
            // Eleva a página ao topo
            $('body').animate({scrollTop: 0}, 'slow');

            if ($('#divModal').attr('id') === undefined) {
                $rootScope.flash_hide = true;
            } else {
                $rootScope.flashModal_hide = true;
            }

            $timeout(function () {
                emit({
                    type: {custom: true},
                    messages: angular.isArray(messages) ? messages : [messages],
                    level: level
                });
            });
        };

        return flash;
    }]);