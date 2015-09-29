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
        $scope.contacts = mergeWithSavedContacts(testContacts);
        saveContacts($scope.contacts);
      }
  }

  $scope.toggleSilence = function(id) {
    $scope.contacts = toggleSilenceContact(id);
  }

  $scope.toggleAlert = function(id) {
    $scope.contacts = toggleAlertContact(id);
  }

  $scope.toggleEmergency = function(id) {
    $scope.contacts = toggleEmergencyContact(id);
  }

  $scope.init = function () {
    $scope.loadContacts();
  };

  $scope.init();
})


.controller('SettingsCtrl', function($scope) {
  $scope.toggleAcceptUnknownAlert = toggleAcceptUnknownAlert();
  $scope.toggleAcceptUnknownSilent = toggleAcceptUnknownSilent();
  $scope.toggleAcceptUnknownEmergency = toggleAcceptUnknownEmergency();

  $scope.accept_unknown_emergency = loadVariable('accept_unknown_emergency');
  $scope.accept_unknown_alert = loadVariable('accept_unknown_alert');
  $scope.accept_unknown_silent = loadVariable('accept_unknown_silent');

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
    })
    .state('tabs.settings', {
      url: "/settings",
      views: {
        'settings-tab': {
          templateUrl: "templates/settings.html",
          controller: "SettingsCtrl"
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
