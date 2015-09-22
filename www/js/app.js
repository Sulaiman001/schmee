// Schmee Notification Improvements by Mocha Dick
var debug = true;

angular.module('schmee', ['ionic', 'ngCordova'])


.controller('SchmeeCtrl', function($scope, $cordovaContacts) {
  var isAndroid = ionic.Platform.isAndroid();

  $scope.loadContacts = function() {
    if (isAndroid) {
      $cordovaContacts.find({multiple: true}).then(function(res) {
        $scope.contacts  = defaultContacts(res);
      });
    } else {
      $scope.contacts = testContacts;
    
      $scope.contacts = defaultContacts($scope.contacts);
      
    }
  }


  var init = function () {
    if (window.contacts == undefined) {
      $scope.loadContacts();
    }
  };

  init();
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html"
        }
      }
    })
    .state('tabs.contacts', {
      url: "/contacts",
      views: {
        'contacts-tab': {
          templateUrl: "templates/contacts.html",
          controller: "SchmeeCtrl"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
