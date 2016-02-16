var directives = angular.module( 'directives', []);

//toggle开关
directives.directive( 'toggleButton', [ '$ionicGesture', 'RootService', function ( $ionicGesture, RootService ) {

  return function (scope, elem, attr) {
    /*$ionicGesture.on('tap', function (e) {
      RootService.opt[attr['name']] = !RootService.opt[attr['name']];
      scope[attr['name']] = RootService.opt[attr['name']]; console.log(scope);
    }, elem);*/
  }
}]);

//计数器
directives.directive( 'counterPlus', [ '$ionicGesture', '$localStorage', function ( $ionicGesture, $localStorage ) {

  return function (scope, elem, attr) {
    scope.$parent.plan[attr['model']]= 0;

    $ionicGesture.on('tap', function () {
      scope.$parent.plan[attr['model']]++;
      scope.$apply();
      $localStorage.setObject('plan_detail', scope.$parent.plan);
    }, elem);
  }
}]);
directives.directive( 'counterMinus', [ '$ionicGesture', '$localStorage', function ( $ionicGesture, $localStorage ) {

  return function (scope, elem, attr) {

    $ionicGesture.on('tap', function () {

      if (scope.$parent.plan[attr['model']] > 0) {
        --scope.$parent.plan[attr['model']] ;
      } else {
        scope.$parent.plan[attr['model']] = 0;
      }
      scope.$apply();
      $localStorage.setObject('plan_detail', scope.$parent.plan);
    }, elem);
  }
}]);

//上传单图(头像)
directives.directive( 'uploadImg', [ '$ionicActionSheet', '$ionicGesture', function( $ionicActionSheet, $ionicGesture ) {
  return {
    link: function (scope, elem, attr) {
      //scope.$parent.traveler.img = [];
      //scope.$parent[attr['model']][attr['role']] = [];

      $ionicGesture.on('tap', function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '直接拍照'},
            {text: '从相册中选'}
          ],
          buttonClicked: function (index) {
            function onSuccess(imageData) {
              scope.$parent[attr['model']][attr['role']] = "data:image/jpeg;base64," + imageData;
              scope.$apply();
            }

            function onFail(message) {
              alert('Failed because: ' + message);
            }

            if (index == 0) {
              console.log('camera');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 80,
                targetHeight: 80,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            } else if (index == 1) {
              console.log('photo');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 80,
                targetHeight: 80,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            }
            return true;
          }
        });
      }, elem);
    }
  };
}]);

//上传多图
directives.directive( 'uploadImgs', [ '$ionicActionSheet', '$ionicGesture', function( $ionicActionSheet, $ionicGesture ) {
  return {
    link: function (scope, elem, attr) {
      scope.$parent[attr['model']][attr['role']] = [];

      $ionicGesture.on('tap', function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '直接拍照'},
            {text: '从相册中选'}
          ],
          buttonClicked: function (index) {
            function onSuccess(imageData) {
              scope.$parent[attr['model']][attr['role']].push("data:image/jpeg;base64," + imageData.toString());
              scope.$apply();
            }

            function onFail(message) {
              alert('Failed because: ' + message);
            }

            if (index == 0) {
              console.log('camera');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 120,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            } else if (index == 1) {
              console.log('photo');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 200,
                targetHeight: 120,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            }
            return true;
          }
        });
      }, elem);
    }
  };
}]);

//消息对话框上传图
directives.directive( 'msgUploadImg', [ '$ionicActionSheet', '$ionicGesture', '$timeout',
  function( $ionicActionSheet, $ionicGesture, $timeout ) {
  return {
    link: function (scope, elem, attr) {
      console.log(scope.chatData);//.traveler.img = [];

      $ionicGesture.on('tap', function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '直接拍照'},
            {text: '从相册中选'}
          ],
          buttonClicked: function (index) {
            hideSheet();

            function onSuccess(imageData) {
              var time = new Date().getTime(),
                  img_base = "data:image/jpeg;base64," + imageData;
              scope.chatData.push({
                'name': '小花',
                'face': './img/hotman-2.jpg',
                'pos': 'right',
                'type': 'upload',
                'img': img_base
              });

              scope.$apply();
            }

            function onFail(message) {
              alert('Failed because: ' + message);
            }

            if (index == 0) {
              console.log('camera');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 400,
                targetHeight: 225,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            } else if (index == 1) {
              console.log('photo');
              navigator.camera.getPicture(onSuccess, onFail, {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 400,
                targetHeight: 225,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
              })
            }
            return true;
          }
        });
      }, elem);
    }
  };
}]);

//显示果盘列表
directives.directive( 'showTipsList', [ '$ionicGesture', '$http', 'Host', 'Headers', function ($ionicGesture, $http, Host, Headers) {

  return function (scope, elem, attr) {
    $ionicGesture.on('tap', function (e) {
      if(!scope.tipsList) {
        console.log(!scope.tipsList);
        /*$http({

        }).success(function (data, status) {

        }).error(function (data, status) {

        });*/
      }
    }, elem);
  }
}]);
