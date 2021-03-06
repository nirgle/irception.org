﻿(function () {
    'use strict';

    var app = angular.module('ircApp');

    app.controller('HomeController', function ($state, Session) {
        var vm = this;

        vm.Session = Session;
        
        return vm;
    });

    app.controller('UserController', function ($state, $stateParams, Session, DataService) {
        var vm = this;

        vm.Session = Session;
        vm.Username = $stateParams.Username;        
        
        DataService.getUser(vm.Username, function (data) {
            vm.User = data.User;
            vm.Signature = data.User.Signature;
            vm.InvitedBy = data.InvitedBy;
            vm.Invitees = data.Invitees;            
        });

        return vm;
    });

    app.controller('ConfigController', function ($state, DataService) {
        var vm = this;

        vm.Networks = [];

        DataService.getConfig(function(data) {
            vm.Networks = data.Networks;
        });
        
        vm.urlLink = function (network, channel) {
            $state.go('channel', {
                networkSlug: network.Slug,
                channelSlug: channel.Slug
            });
        };

        return vm;
    });

    app.controller('MeController', function ($state, $timeout, Session, DataService) {
        var vm = this;

        if (Session.UserID == 0) {
            $state.go('login');
        }

        vm.Session = Session;
        vm.SignatureEdited = vm.Session.Signature;

        vm.editSignature = function () {            
            vm.Editing = true;

            $timeout(function () {
                $('#signature').focus();
            });
        };

        vm.cancelSignature = function () {            
            vm.Editing = false;
        };

        vm.saveSignature = function () {

            DataService.saveSignature(vm.SignatureEdited, function (data) {                                
                vm.Session.Signature = vm.SignatureEdited;
                vm.cancelSignature();
            });            
        };

        vm.logout = function () {
            Session.reset();
            $state.go('login');
        };

        vm.login = function () {
            $state.go('login');
        };
        
        return vm;
    });

    app.controller('LoginController', function ($state, $stateParams, $timeout, Session, DataService) {
        var vm = this;

        vm.username = '';
        vm.password = '';

        vm.login = function () {
            if (vm.username.length == 0) {
                $timeout(function () {
                    $('#inputUsername').focus();
                });
                return;
            }

            if (vm.password.length == 0) {
                $timeout(function () {
                    $('#inputPassword').focus();
                });
                return;
            }

            var params = {
                Username: vm.username,
                Password: vm.password
            };

            // Normal login requires the username and password only.  Auth logins need a SUID
            if ($state.current.name == 'auth') {
                params.SUID = $stateParams.SUID;
            }

            DataService.login(params, function (data) {
                if (data.success) {
                    Session.loggedIn(data);                                        
                    $state.go('me');                    
                } else {
                    vm.error = data.UserMessage;
                }
            });
        };

        $timeout(function () {
            $('#inputUsername').focus();
        });

        return vm;
    });

    app.controller('InviteController', function ($state, $stateParams, $timeout, Session, DataService) {
        var vm = this;

        vm.username = '';
        vm.password = '';
        vm.password2 = '';

        DataService.getInviteeNick($stateParams.SUID, function (nick) {
            if (vm.username == '') {
                vm.username = nick;

                $timeout(function () {
                    $('#inputPassword').focus();
                });
            }
        });

        vm.register = function () {
            if (vm.username.length == 0) {
                $timeout(function () {
                    $('#inputUsername').focus();
                });
                return;
            }

            if (vm.password.length == 0) {
                $timeout(function () {
                    $('#inputPassword').focus();
                });
                return;
            }

            if (vm.password2.length == 0) {
                $timeout(function () {
                    $('#inputPassword2').focus();
                });
                return;
            }

            if (vm.password2 != vm.password) {
                $timeout(function () {
                    $('#inputPassword2').focus();
                });

                vm.error = 'Password mismatch.';
                return;
            }

            var params = {
                Username: vm.username,
                Password: vm.password,
                SUID: $stateParams.SUID
            };
            
            DataService.register(params, function (data) {
                if (data.success) {
                    Session.loggedIn(data);

                    $state.go('me');
                    
                    vm.error = undefined;
                } else {
                    vm.error = 'Error: ' + data.UserMessage;
                }
            });
        };

        $timeout(function () {
            $('#inputUsername').focus();
        });

        return vm;
    });

      
    app.controller('ModController', function ($scope, $state, $stateParams, $interval, DataService, UI, Session) {
        var vm = this;

        vm.autoNSFW = [];
        vm.ignores = [];
        
        DataService.getChannel($stateParams.networkSlug, $stateParams.channelSlug, function (data) {
            vm.Channel = data.Channel;
            vm.NetworkSlug = data.NetworkSlug;
            vm.ChannelSlug = vm.Channel.Slug;
            
            UI.tabTitle(data.NetworkSlug + '/' + data.ChannelSlug + ' - irception.org')

            var channelID = vm.Channel.ChannelID;

            DataService.getChannelModData(channelID, function (data) {
                vm.autoNSFW = data.autoNSFW;
                vm.ignores = data.ignores;
            });
        });

        function toBeImplemented() {
            window.alert('In production, you will need to be a mod to see this page and click this link.');
        }

        vm.deleteFragment = function(autonsfw) {
            toBeImplemented();
        }

        vm.deleteNick = function (nick) {
            toBeImplemented();
        }
        
        return vm;
    });
    
    app.controller('ChannelController', function ($scope, $stateParams, $interval, DataService, UI, Session) {
        var vm = this;

        vm.Channel = { ChannelName: '#' };
        vm.URLs = [];

        var lastURLUpdateHistoryID = 0;

        vm.refreshElapsed = function (secondsPassed) {
            vm.URLs.forEach(function (url) {

                // TODO: improve this
                if (!url.SecondsElapsed)
                    url.SecondsElapsed = 0;

                url.SecondsElapsed += secondsPassed;
                url.ElapsedString = UI.elapsedString(url.SecondsElapsed);
            });
        };

        vm.updateURLs = function (urls) {
            urls.forEach(function (url) {
                var idx = -1;

                for (var i = 0; i < vm.URLs.length; i++) {
                    if (vm.URLs[i].URLID == url.URLID) {
                        idx = i;
                        break;
                    }
                }

                if (idx == -1) {
                    vm.URLs.push(url);
                } else {
                    vm.URLs[idx] = url;
                }
            });
        };

        vm.ChannelSlug = $stateParams.channelSlug;
        vm.NetworkSlug = $stateParams.networkSlug;

        DataService.getChannel($stateParams.networkSlug, $stateParams.channelSlug, function (data) {
            vm.Channel = data.Channel;            
            vm.updateURLs(data.URLs);
            vm.refreshElapsed(0);

            UI.tabTitle(data.NetworkSlug + '/' + data.ChannelSlug + ' - irception.org')

            vm.lastURLUpdateHistoryID = data.luuhid;

            onLogin();
        });

        var interval = $interval(function () {

            DataService.getChannelFromLast($stateParams.networkSlug, $stateParams.channelSlug, vm.lastURLUpdateHistoryID, function (data) {
                vm.updateURLs(data.URLs);
                vm.refreshElapsed(0);
                vm.lastURLUpdateHistoryID = data.luuhid;
            });

            vm.refreshElapsed(5);
        }, 5000);

        $scope.$on('$destroy', function () {
            if (interval) {
                $interval.cancel(interval);
            }
        });
                
        function onLogin() {
            vm.Permission = {};
            vm.Permissions = Session.getChannelPermissions(vm.Channel.ChannelID, vm.Permission);
        };

        $scope.$on('session.login', onLogin);

        vm.setNSFW = function (urlID) {
            DataService.setAttr(urlID, 'nsfw', function () { });

            // Don't wait for the request to finish, tag it in the UI right away
            vm.tag(urlID, '+NSFW');
        };

        vm.unsetNSFW = function (urlID) {
            DataService.unsetAttr(urlID, 'nsfw', function () { });

            vm.tag(urlID, '-NSFW');
        };

        vm.tag = function (id, tag) {
            for (var i = 0; i < vm.URLs.length; i++) {
                if (vm.URLs[i].URLID == id) {
                    var url = vm.URLs[i];

                    switch (tag) {
                        case '+NSFW':
                            url.NSFW = true;
                            break;

                        case '-NSFW':
                            url.NSFW = false;
                            break;
                    }
                    
                    break;
                }
            }
        };

        return vm;
    });

    app.controller('StatsController', function ($scope, $state, $stateParams, Session, DataService) {
        var vm = this;

        vm.Session = Session;
        vm.ChannelSlug = $stateParams.channelSlug;
        vm.NetworkSlug = $stateParams.networkSlug;
        
        DataService.getStats(vm.ChannelSlug, vm.NetworkSlug, 'lines', function (data) {
            $scope.data = [ data.data ];
            $scope.labels = data.labels;
        });

        return vm;
    });

    app.controller('StatsRaceController', function ($scope, $state, $stateParams, $interval, Session, DataService) {
        var vm = this;

        vm.Session = Session;
        vm.ChannelSlug = $stateParams.channelSlug;
        vm.NetworkSlug = $stateParams.networkSlug;

        // Dataset colors
        $scope.colours = ['#50B5F5', '#AAAAAA', '#AA3A50', '#FCDC46', '#666666', '#E8950C', '#DD90CF', '#531DF7', '#21E2A5', '#888888'];
        $scope.options = {
            scaleOverride: true,
            scaleStepWidth: 100
        };

        vm.refreshStats = function () {
            DataService.getStats(vm.ChannelSlug, vm.NetworkSlug, 'race', function (data) {
                $scope.data = data.data;
                $scope.series = data.series;
                $scope.labels = data.labels;

                // Smartly scale the y axis to just fit the data
                $scope.options.scaleSteps = data.data[0][0] / 100 + 2;
            });            
        };

        vm.refreshStats();

        var interval = $interval(function () {
            vm.refreshStats();
        }, 30 * 1000);

        $scope.$on('$destroy', function () {
            if (interval) {
                $interval.cancel(interval);
            }
        });

        return vm;
    });
    
})();
