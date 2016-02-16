angular.module('starter.controllers', [])

  .controller('MainCtrl', ['$scope', '$state', '$location', '$ionicModal', '$ionicNavBarDelegate', '$ionicHistory', '$ionicLoading',
    '$ionicSideMenuDelegate', '$localStorage', '$ionicPopup', '$ionicPlatform', 'RootService', '$http', 'Host', 'Headers', 'Chats',
    '$timeout',
    function ($scope, $state, $location, $ionicModal, $ionicNavBarDelegate, $ionicHistory, $ionicLoading, $ionicSideMenuDelegate,
              $localStorage, $ionicPopup, $ionicPlatform, RootService, $http, Host, Headers, Chats, $timeout) {

      //状态变量
      $scope.root = {};
      var login = $localStorage.get('uId');//登录ID
      var password = $localStorage.get('ps');//登录密码

      function onConnect(status) {
      }

      function onMessage(msg) {
      }

      //判断登录初始化
      $ionicPlatform.ready(function () {
        if( $localStorage.get('uId') ) {
        }
      });

      $scope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
        //是否登录
        if(toState.name == 'tab.publish' || toState.name == 'tab.message') {
          !$localStorage.get('uId') && $location.path('/login');
        }
        //隐藏tabs
        if (toState.name == 'tab.message-chat' || toState.name == 'tab.chat-detail' || toState.name == 'tab.message-service' || toState.name == 'tab.trip-wait-pay' ||
            toState.name == 'tab.destination-country-detail' || toState.name == 'tab.destination-impress' || toState.name == 'tab.destination-city' ||
            toState.name == 'tab.destination-city-detail' || toState.name == 'tab.city-scenery-detail' || toState.name == 'tab.publish-country'
            || toState.name == 'tab.publish-addCity'|| toState.name == 'tab.continue-addCity' || toState.name == 'tab.plan-detail' || toState.name == 'tab.plan-other'
            || toState.name == 'tab.journey-cost-detail' || toState.name == 'tab.trip-wait-comment' || toState.name == 'tab.my-trip-detail') {
          $scope.root.hideTabs = true;
        } else {
          $scope.root.hideTabs = false;
        }
        //隐藏消息提示点
        if(toState.name == 'tab.message') {
          $scope.root.hadNewMsg = false;
        }

      });
      $scope.$on('$locationChangeStart', function (e, prev, next) {
        //是否登录
        if($location.path() == '/tab/publish' || $location.path() == '/tab/message') {
          console.log( !$localStorage.get('uId'));
          !$localStorage.get('uId') && $location.path('/login');
        }
      });

      //右侧栏
      $scope.toggleRight = function () {
        if($localStorage.get('uId')) {
          $ionicSideMenuDelegate.toggleRight();

        } else {
          $state.go('login');
        }
      };

      $scope.goto = function (state) {
        $state.go(state);
        $ionicSideMenuDelegate.toggleRight();
      };

      //初始化发布页面
      $scope.initPublishView = function () {
        $state.go('tab.publish');
        $ionicHistory.goToHistoryRoot($localStorage.get('publishId'));
      };

    }])

  .controller('PublicCtrl', ['$scope', '$ionicPopup', '$state', '$http', '$timeout', '$location', '$ionicHistory', '$localStorage',
    'Headers', 'Host',
    function ($scope, $ionicPopup, $state, $http, $timeout, $location, $ionicHistory, $localStorage, Headers, Host) {
      $scope.traveler = {};
      $scope.traveler.country_code = '0086';
      $scope.traveler.role = 0;
      $scope.traveler.tags = [];
      $scope.sex = [
        { name: '男', val: 'man' },
        { name: '女', val: 'woman' }
      ];
      $scope.traveler.sex = $scope.sex[0];

      //是否已经存在
      $scope.isExit = function (loginForm) {
        if (loginForm.phone.$valid) {
          $http({
            method: 'GET',
            url: Host + '/user/' + $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0/exists',
            headers: Headers
          }).success(function (data, status) {
            console.log(data, status);
            if (!data.data) {
              var loginPopup = $ionicPopup.show({
                title: '<div class="margin20-top">无效号码</div>',
                subTitle: '<div class="padding-bottom">该手机号没有被注册</div>',
                scope: $scope,
                buttons: [
                  {
                    text: '取消',
                    type: 'button-clear button-green'
                  },
                  {
                    text: '注册',
                    type: 'button-clear button-green',
                    onTap: function (e) {
                      //可以返回数据
                      $state.go("register");
                    }
                  }
                ]
              });
            }
          }).error(function (data, status) {
            console.log(data, status);
          });
        }
        /**/
      };
      //获取验证码
      $scope.getVerify = function () {
        if ($scope.traveler.phone) {
          $http({
            method: 'GET',
            url: Host + '/common/verify/' + $scope.traveler.country_code + $scope.traveler.phone,
            headers: Headers
          }).success(function (data, status) {
            status == 200 && ($scope.traveler.user_verify_code = data.user_verify_code);
            console.log(data, $scope.traveler);
          }).error(function (data, status) {
            console.log(data, status);
          })
        }
      };
      //注册
      $scope.register = function (form) {
        console.log($scope.traveler);
        if ( $scope.traveler.captcha == $scope.traveler.user_verify_code ) {
          if( form.$valid ) {
            var data = {
              user_id: $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0',
              user_country_code: $scope.traveler.country_code ,
              user_phone: $scope.traveler.phone,
              user_role: '0',
              userPassword: $scope.traveler.password
            };

            $http({
              method: 'POST',
              url: Host + '/user',
              data: data,
              headers: Headers
            }).success(function (data, status, headers, config) {
              console.log(data, status);
              if (!data.errorcode && data.data == 'ok') {
                $ionicHistory.currentView($ionicHistory.backView());
                $state.go('basicInfo', {}, {location: 'replace'});

                $scope.$parent.$parent.root.uId = $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0';
                $localStorage.set('uId', $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0');
                $localStorage.set('ps', $scope.traveler.password);//hex_md5($scope.traveler.password)

                //通知父控制器开启推送服务
                $scope.$emit('initJpush');
              } else {
                var rPopup = $ionicPopup.show({
                  title: '<div class="padding brown">号码已存在</div>',
                  scope: $scope,
                  buttons: [ ]
                });

                rPopup.then(function (res) {
                });

                $timeout(function () {
                  rPopup.close();
                }, 1500);
              }
            }).error(function (data, status, headers, config) {
              console.log(data, status, headers, config);
              //if (data.message.indexOf('exists') != -1) {
              //
              //}
            });
          }
        } else {

          var vPopup = $ionicPopup.show({
            title: '<div class="padding brown">验证码错误</div>',
            scope: $scope,
            buttons: [ ]
          });
          $timeout(function () {
            vPopup.close();
          }, 1500);
        }
      };
      //登录
      $scope.login = function (loginForm) {
        console.log();
        if (loginForm.$valid) {
          var data = {
            user_id: $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0',
            userPassword: $scope.traveler.password
          };

          $http({
            method: 'POST',
            url: Host + '/user/auth',
            data: data,
            headers: Headers
          }).success(function (data, status, headers, config) {
            console.log(data, status);
            if (!data.errorcode) {
              $ionicHistory.currentView($ionicHistory.backView());
              $state.go('tab.traveler', {}, {location: 'replace'});

              $scope.$parent.$parent.root.uId = $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0';
              $localStorage.set('ps', $scope.traveler.password);
              $localStorage.set('uId', $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0');

              //通知父控制器开启推送服务
              $scope.$emit('initJpush');
            } else {
              //登录弹出框
              var lPopup = $ionicPopup.show({
                title: '<div class="padding brown">用户名或密码错误</div>',
                scope: $scope,
                buttons: [ ]
              });
              $timeout(function () {
                lPopup.close();
              }, 1500);

              lPopup.then(function (res) {
                console.log('tapped', res);
              });
            }
          }).error(function (data, status) {
            console.log(data, status);

          });
        } else {

        }
      };
      //忘记密码
      $scope.forgetPwd = function () {
        if ( $scope.traveler.forget_captcha == $scope.traveler.user_verify_code ) {
          if( $scope.traveler.password == $scope.traveler.confirm_password ) {
            console.log($scope.traveler.password , $scope.traveler.confirm_password);
            var data = {
              user_verify_code: $scope.traveler.user_verify_code,
              user_phone: $scope.traveler.country_code + $scope.traveler.phone,
              userPassword: $scope.traveler.password
            };

            $http({
              method: 'PUT',
              url: Host + '/user/' + $scope.traveler.country_code + '_' + $scope.traveler.phone + '_0/resetpwd',
              data: data,
              headers: Headers
            }).success(function (data, status) {
              console.log(data, status);
            }).error(function (data, status) {
              console.log(data, status);
            })
          } else {
            var vPopup = $ionicPopup.show({
              title: '<div class="padding brown">密码不一致</div>',
              scope: $scope,
              buttons: []
            });

            $timeout(function () {
              vPopup.close();
            },1500);
          }
        } else {
          var fPopup = $ionicPopup.show({
            title: '<div class="padding brown">验证码错误</div>',
            scope: $scope,
            buttons: []
          });

          $timeout(function () {
            fPopup.close();
          },1500);
        }
      };

      //个人信息
      $scope.finishBasic = function (basicForm) {
        if ( basicForm.$valid ) {
          var birth = $scope.traveler.birthday;
          console.log($scope.$parent.$parent.root.uId, $localStorage.get('uId'));
          var data = {
            user_photo: $scope.traveler.header,
            user_nickname: $scope.traveler.nickname,
            user_sex: $scope.traveler.sex.name,
            user_city: $scope.traveler.city,
            user_birthday: birth.getTime()
          };

          $http({
            method: 'PUT',
            url: Host + '/user/' + $scope.$parent.$parent.root.uId,
            data: data,
            headers: Headers
          }).success(function (data, status) {
            if(!data.errorcode) {
              $state.go('travelerTag');
            }
          }).error(function (data, status) {
            console.log(data, status);
          });

          //存储昵称
          $localStorage.set('nickname', $scope.traveler.nickname);
        }
      };
      //标签
      $scope.tagList = [
        {
          name: '学生', checked: false
        },
        {
          name: '吃货', checked: false
        },
        {
          name: '旅游', checked: false
        },
        {
          name: '游泳', checked: false
        },
        {
          name: '爬山', checked: false
        }
      ];
      $scope.changeTag = function (item) {
        if(item.checked) {
          $scope.traveler.tags.push(item.name);
        } else {
          for(var key=0; key < $scope.traveler.tags.length; key++) {
            if ($scope.traveler.tags[key] == item.name) {
              $scope.traveler.tags.splice(key,1);//console.log(key, $scope.traveler.tags);
              break;
            }
          }
        }
      };
      $scope.finishTag = function () {

        var data = {
          user_tag: $scope.traveler.tags.join('、')
        };

        $http({
          method: 'PUT',
          url: Host + '/user/' + $localStorage.get('uId'),
          data: data,
          headers: Headers
        }).success(function (data, status) {
          if(!data.errorcode) {
            $state.go('tab.traveler');
            $localStorage.set('isReg', true);
          }
        }).error(function (data, status) {
          console.log(data, status);
        });
      };


    }])


  .controller('TravelerCtrl', ['$scope', '$localStorage', '$state', '$http', 'Host', 'Headers',
    function ($scope, $localStorage, $state, $http, Host, Headers) {


    }])

  //目的地
  .controller('DestinationCtrl', ['$scope', '$http', 'Host', 'Headers',
    function ($scope, $http, Host, Headers) {


  }])
  // publish
  .controller('PublishCtrl', ['$scope', '$state', '$stateParams', '$location', '$ionicSideMenuDelegate', '$timeout', '$localStorage',
    '$ionicActionSheet', '$ionicPopup', '$ionicHistory', 'Headers', '$filter', '$http', 'Host', 'AddCityService',
    function ($scope, $state, $stateParams, $location, $ionicSideMenuDelegate, $timeout, $localStorage, $ionicActionSheet, $ionicPopup,
              $ionicHistory, Headers, $filter, $http, Host, AddCityService) {
      $localStorage.set('publishId', $ionicHistory.currentHistoryId());
      $scope.planOpt = {};
      $scope.plan = {};
      $scope.countryId = $scope.plan.country = $stateParams.countryId;
      $scope.plan.title = [];
      $scope.plan.img = [];


  }])

  .controller('MessageCtrl', ['$scope', 'Chats', '$ionicHistory', '$localStorage',
    function ($scope, Chats, $ionicHistory, $localStorage) {

    // when view are recreated or on app start, instead of every page change. To listen for when this page is active
    // (for example, to refresh data), listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e, data) {
      console.log(e, data);
    });

    // view id
    $localStorage.set('msgId', $ionicHistory.currentHistoryId());

    $scope.chats = Chats.all();
    $scope.remove = function (chat) {
      Chats.remove(chat);
    };
  }])

  .controller('ChatDetailCtrl', ['$scope', '$ionicScrollDelegate', '$state', '$stateParams', 'Chats', '$localStorage', '$timeout',
    '$ionicPopup', 'RootService', '$ionicHistory', '$location',
    function ($scope, $ionicScrollDelegate, $state, $stateParams, Chats, $localStorage, $timeout, $ionicPopup, RootService,
              $ionicHistory, $location) {
      console.log($stateParams.chatId);
      $scope.chatOpt = {};
      var login = $localStorage.get('uId');//登录ID
      var password = $localStorage.get('ps');//登录密码
      var toUser = $stateParams.chatId; //发送给谁

      //初始化发布页面
      $scope.initMsgView = function () {
        $state.go('tab.message');
        $ionicHistory.goToHistoryRoot($localStorage.get('msgId'));
      };

      //聊天页不提示
      //window.plugins.jPushPlugin.clearAllNotification();

      //对话数据
      var oChat = document.querySelector('#chat-div-input');
      $scope.contacts = Chats.get($stateParams.chatId);
      $scope.$on('$ionicView.enter', function () {
        var localChatData = $localStorage.getObject(toUser);
        console.log(!!localChatData.length);
        //console.log(JSON.stringify(RootService.chatData));
        if(!!localChatData.length) {
          //如果有本地数据
          $scope.chatData = RootService.chatData = localChatData;
          $scope.noLocalChatData = false;
          console.log($scope.chatData);
        } else {
          $scope.chatData = RootService.chatData;
          $scope.noLocalChatData = true;
          console.log($scope.chatData);
        }

        $scope.$apply();
        /*var popup = $ionicPopup.alert({
          template: 'RootService.chatData: ' + JSON.stringify(),
          scope: $scope
        });*/
      });


      $scope.sendMsg = function (type) {


        //滚到底部
        $ionicScrollDelegate.scrollBottom(true);
      };

      var isIOS = ionic.Platform.isWebView() && ionic.Platform.isIOS();

      $scope.inputUp = function () {
        console.log('inputUp');
        //if (isIOS) $scope.data.keyboardHeight = 200;
        $timeout(function () {
          $ionicScrollDelegate.scrollBottom(true);
        }, 300);

        //隐藏表情和选项
        $scope.$parent.root.showFace = false;
        $scope.$parent.root.showOption = false;
      };

      $scope.inputDown = function () {
        console.log('inputDown');
        //if (isIOS) $scope.data.keyboardHeight = 0;
        $ionicScrollDelegate.resize();
      };

      $scope.closeKeyboard = function () {
        cordova.plugins.Keyboard.close();
      };

      //表情
      $scope.faceList = [];
      window.addEventListener('native.keyboardshow', function (e) {
        console.log(e);
      });
      for (var i=1; i<91; i++) {
        $scope.faceList.push({ name: i, img: './img/face/'+i+'.gif'});
      }

      window.addEventListener('native.keyboardshow', keyboardShowHandler);

      function keyboardShowHandler(e){
        console.log('Keyboard height is: ' + e.keyboardHeight);
      }

      function placeCaret(el, atStart) {

        if (typeof window.getSelection != 'undefined' && typeof document.createRange != 'undefined') {
          var range = document.createRange();
          range.selectNodeContents(el);
          range.collapse(atStart);

          var sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }

      $scope.showKeyboard = function () {
        $scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        console.log(oChat.innerHTML);

        oChat.focus();
        placeCaret(oChat, false);
      };

      $scope.showOpt = function (name) {
        if( name == 'face' ) {
          $scope.$parent.root.showOption = false;
          $scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        } else {
          $scope.$parent.root.showFace = false;
          $scope.$parent.root.showOption = !$scope.$parent.root.showOption;
        }
      };
      $scope.selectFace = function (face) {
        //oChat.innerHTML = ''

        //处理输入焦点问题
        //cordova.plugins.Keyboard.open();

        oChat.innerHTML += '<img src="' + face.img + '">';
        //$scope.$parent.root.showFace = !$scope.$parent.root.showFace;
        console.log(oChat.innerHTML);
      };

      //查看行程
      $scope.lookJourney = function (tripId) {
        $location.path('/tab/message-journey/' + tripId);
      }
    }])

  .controller('MyCtrl', ['$scope', '$rootScope', '$ionicSideMenuDelegate', '$ionicPopup', '$localStorage', '$state', '$http', 'Headers',
    '$timeout', 'Host',
    function ($scope, $rootScope, $ionicSideMenuDelegate, $ionicPopup, $localStorage, $state, $http, Headers, $timeout, Host) {


      //清除缓存
      $scope.clearCache = function () {
        var confirmPopup = $ionicPopup.confirm({
          title: '<div class="padding popup-title margin20-top">确定清除缓存的图片数据吗？</div>',
          buttons: [
            { text: '取消' },
            {
              text: '<b>确认</b>'
            }
          ]
        });

        confirmPopup.then(function (res) {
          if (res) {
            console.log('sure');
          } else {
            console.log('confused')
          }
        });
      };

      //退出登录
      $scope.exit = function () {
        window.plugins.jPushPlugin.stopPush();
        window.plugins.jPushPlugin.setAlias('');
        $localStorage.remove('uId');
        $state.go('login');
      }

    }]);




