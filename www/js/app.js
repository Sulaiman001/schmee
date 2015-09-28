// Schmee Notification Improvements by Mocha Dick
var debug = true;

angular.module('schmee', ['ionic', 'ngCordova', 'ionic-material'])

.controller('SchmeeCtrl', function($scope) {

})

.controller('ContactsCtrl', function($scope, $cordovaContacts) {
  var isAndroid = ionic.Platform.isAndroid();

  $scope.loadContacts = function() {
      if (isAndroid) {
        $cordovaContacts.find({multiple: true}).then(function(res) {
          $scope.contacts = mergeWithSavedContacts(res);
          saveContacts($scope.contacts);
        });
      } else {
        // saveContacts(testContacts);
        $scope.contacts = mergeWithSavedContacts(testContacts2);
        saveContacts($scope.contacts);
      }
  }

  $scope.toggleSilence = function(id) {
    toggleSilenceContact(id);
  }

  $scope.toggleAlert = function(id) {
    toggleAlertContact(id);
  }

  $scope.toggleEmergency = function(id) {
    toggleEmergencyContact(id);
  }

  $scope.init = function () {
    $scope.loadContacts();
  };

  $scope.init();
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
          controller: "ContactsCtrl"
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
