var level_message;
angular.module('flash', [])
    .factory('flash', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var messages = [];
        var reset;
        var cleanup = function () {
            $timeout.cancel(reset);
            reset = $timeout(function () {
                messages = [];
            });
        };

        var emit = function () {
            $rootScope.$emit('flash:message', messages, cleanup);
        };

        $rootScope.$on('$locationChangeSuccess', emit);
        $rootScope.$on('cleanup-flash-message', emit);

        var asMessage = function (level, text) {
            if (!text) {
                text = level;
                level = 'success';
            }
            return { level: level, text: text };
        };

        var asArrayOfMessages = function (text, level) {
            if (text instanceof Array) return text.map(function (message) {
                return message.text ? message : asMessage(level, message);
            });
            return text ? [
                { level: level, text: text }
            ] : [asMessage(level, text)];
        };

        var flash = function (text, level) {
            $('html').animate({scrollTop: 0},'slow');
            level_message = level;
            emit(messages = asArrayOfMessages(text, level));
        };

        ['danger', 'warning', 'info', 'success'].forEach(function (level) {
            flash[level] = function (text) {
                flash(level, text);
            };
        });

        return flash;
    }])

    .directive('flashMessages', ['$timeout', function ($timeout) {
        var directive = { restrict: 'EA', replace: true };
        directive.template =
            '<div id="flash-messages" class="alert alert-{{level_message}} text-center flash-message-container am-slide-top" ng-show="messages">' +
                '<button type="button" class="close" ng-click="messages = []">×</button>' +
                '<span class="glyphicon glyphicon-ok" ng-if="level_message == \'success\'"></span>' +
                '<span class="glyphicon glyphicon-warning-sign glyphicon-alert-big" ng-if="level_message == \'danger\'"></span>' +
                '<div ng-repeat="m in messages">{{m.text}}</div>' +
            '</div>';

        directive.controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
            $rootScope.$on('flash:message', function (_, messages, done) {
                $scope.messages = [];

                $timeout(function () {
                    $scope.messages = messages;
                    $scope.level_message = level_message;
                });

                done();
            });
        }];

        return directive;
    }])

    // Flash modal
    .factory('flashModal', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var messagesModal = [];
        var reset;
        var cleanup = function () {
            $timeout.cancel(reset);
            reset = $timeout(function () {
                messagesModal = [];
            });
        };

        var emit = function () {
            $rootScope.$emit('flash:modal', messagesModal, cleanup);
        };

        $rootScope.$on('$locationChangeSuccess', emit);
        $rootScope.$on('cleanup-flash-modal', emit);

        var asMessage = function (level, text) {
            if (!text) {
                text = level;
                level = 'success';
            }
            return { level: level, text: text };
        };

        var asArrayOfMessages = function (text, level) {
            if (text instanceof Array) return text.map(function (message) {
                return message.text ? message : asMessage(level, message);
            });
            return text ? [
                { level: level, text: text }
            ] : [asMessage(level, text)];
        };

        var flashModal = function (text, level) {
            $('#divModal').animate({scrollTop: 0},'slow');
            level_message = level;
            emit(messagesModal = asArrayOfMessages(text, level));
        };

        ['danger', 'warning', 'info', 'success'].forEach(function (level) {
            flashModal[level] = function (text) {
                flashModal(level, text);
            };
        });

        return flashModal;
    }])

    .directive('flashModal', ['$timeout', function ($timeout) {
        var directive = { restrict: 'EA', replace: true };
        directive.template =
            '<div id="flash-modal" class="alert alert-{{level_message}} text-center flash-message-container am-slide-top" ng-show="messagesModal">' +
                '<button type="button" class="close" ng-click="messagesModal = []">×</button>' +
                '<span class="glyphicon glyphicon-ok" ng-if="level_message == \'success\'"></span>' +
                '<span class="glyphicon glyphicon-warning-sign glyphicon-alert-big" ng-if="level_message == \'danger\'"></span>' +
                '<div ng-repeat="m in messagesModal">{{m.text}}</div>' +
            '</div>';

        directive.controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
            $rootScope.$on('flash:modal', function (_, messagesModal, done) {
                $scope.messagesModal = [];

                $timeout(function () {
                    $scope.messagesModal = messagesModal;
                    $scope.level_message = level_message;
                });

                done();
            });
        }];

        return directive;
    }]);
