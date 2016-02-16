// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'directives'])

  .constant('Token', 'test123')

  .run(['$ionicPlatform', function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }

    });
  }])

  .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.icon('ion-ios-arrow-back');
    $ionicConfigProvider.backButton.text(" ");
    $ionicConfigProvider.backButton.previousTitleText(false);
    $ionicConfigProvider.tabs.style("standard");
    $ionicConfigProvider.tabs.position("bottom");
    $ionicConfigProvider.views.transition("ios");
    $ionicConfigProvider.navBar.alignTitle("center");
    $ionicConfigProvider.navBar.positionPrimaryButtons('left');
    $ionicConfigProvider.navBar.positionSecondaryButtons('right');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      // login
      .state('login', {
        url: '/login',
        templateUrl: 'templates/public/login.html',
        controller: 'PublicCtrl'
      })
      // 注册
      .state('register', {
        url: '/register',
        templateUrl: 'templates/public/register.html',
        controller: 'PublicCtrl'
      })
      // 忘记密码
      .state('forgetPwd', {
        url: '/forgetPwd',
        templateUrl: 'templates/public/forgetPwd.html',
        controller: 'PublicCtrl'
      })
      // 重置密码
      .state('resetPwd', {
        url: '/resetPwd',
        templateUrl: 'templates/public/resetPwd.html',
        controller: 'PublicCtrl'
      })
      //个人信息
      .state('basicInfo',{
        url: '/basicInfo',
        templateUrl: 'templates/public/basicInfo.html',
        controller: 'PublicCtrl'
      })
      //个人标签
      .state('travelerTag',{
        url: '/travelerTag',
        templateUrl: 'templates/public/travelerTag.html',
        controller: 'PublicCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/public/tabs.html'
      })

      //首页
      .state('tab.traveler', {
        url: '/traveler',
        views: {
          'tab-traveler': {
            templateUrl: 'templates/traveler/tab-traveler.html',
            controller: 'TravelerCtrl'
          }
        }
      })

      //目的地 destination-impress
      .state('tab.destination-country', {
        url: '/destination',
        views: {
          'tab-destination': {
            templateUrl: 'templates/destination/tab-country.html',
            controller: 'DestinationCtrl'
          }
        }
      })
      //发布
      .state('tab.publish', {
        url: '/publish',
        views: {
          'tab-publish': {
            templateUrl: 'templates/publish/tab-publish.html',
            controller: 'PublishCtrl'
          }
        }
      })


      .state('tab.message', {
        url: '/message',
        views: {
          'tab-message': {
            templateUrl: 'templates/message/tab-chats.html',
            controller: 'MessageCtrl'
          }
        }
      })
      .state('tab.chat-detail', {
        url: '/chats/:chatId',
        views: {
          'tab-message': {
            templateUrl: 'templates/message/chat-detail.html',
            controller: 'ChatDetailCtrl'
          }
        }
      })

      //我的
      .state('tab.my-info', {
        url: '/my-info',
        views: {
          'tab-my': {
            templateUrl: 'templates/my/my-info.html',
            controller: 'MyCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/traveler');

  }]);
