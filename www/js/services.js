angular.module('starter.services', [])

  .factory('RootService', [function () {
    return {
      opt: {},
      data: {},
      chatData: []
    };
  }])

  .factory('Chats', [function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var chats = [{
      id: '0086_18810938510_0',
      name: '牛牛宝',
      lastText: 'Baby 叫你洗衣服',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460',
      'pos': 'left',
      time: new Date().getTime()
    },{
      id: '0086_18810938510_1',
      name: 'Jason_sir',
      lastText: 'Baby 叫你洗衣服',
      face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460',
      'pos': 'left',
      time: new Date().getTime()
    }];

    return {
      all: function() {
        return chats;
      },
      add: function (trip_sir) {
        chats.push(trip_sir);
      },
      remove: function(chat) {
        chats.splice(chats.indexOf(chat), 1);
      },
      get: function(chatId) {
        for (var i = 0; i < chats.length; i++) {
          if (chats[i].id === parseInt(chatId)) {
            return chats[i];
          }
        }
        return null;
      }
    };
  }])

  .factory('$localStorage', ['$window', function ($window) {

    return {
      set: function(key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      setObject: function(key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key) {
        return JSON.parse($window.localStorage[key] || '{}');
      },
      remove: function(key) {
        return $window.localStorage.removeItem(key);
      }
    };
  }])

  .factory('MyTripService', ['$http', 'Headers', '$localStorage', function ($http, Headers, $localStorage) {
    /*var trips = {};

    return {
      get: function(trips) {
        return trips.data;
      }
    }*/
  }])

  .factory('AddCityService', [function () {
    return {
      data: {},
      hadAddCity: []
    }
  }]);
