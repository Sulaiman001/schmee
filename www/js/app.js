// Schmee Notifications app.js by Mocha Dick
var debug = false;

angular.module('schmee', ['ionic', 'ngCordova', 'ionic-material',  'jett.ionic.filter.bar'])

.controller('MessagesCtrl', function($scope, $ionicModal) {
  $scope.shouldShowDelete = true;

  var testMessages = [
    {
      id: 1,
      fromNumber: "0835592468891",
      body: "test !alert",
      fromName: "Glen Baker"
    },
    {
      id: 2,
      fromNumber: "0835592468891",
      body: "test !silent this is going to be a long SMS message.  Some people like to send whole essays in SMS messages.  Need to be semi-longform friendly.",
      fromName: "Glen Baker"
    }
  ];

  if (debug) {
    $scope.messages = testMessages;
  } else {
    $scope.messages = [];
  }
  $scope.sms = {};

  $scope.addMessage = function(msg) {
    if (msg.fromNumber == null && msg.address != null) {
      msg.fromNumber = msg.address;
    }
    $scope.messages.unshift(msg);
  }

  $scope.removeMessage = function(msg) {
    var index = $scope.messages.indexOf(msg);
    $scope.messages.splice(index, 1);
  }

  $scope.replySMS = function(fromNumber) {
    $scope.sms.to = fromNumber;
    $scope.openModal();
  }
})

.controller('ContactsCtrl', function($scope, $ionicFilterBar) {
  var isAndroid = ionic.Platform.isAndroid();

  $scope.toggleContact = function(contact) {
    if ($scope.isContactShown(contact)) {
      $scope.shownContact = null;
    } else {
      $scope.shownContact = contact;
    }
  };

  $scope.isContactShown = function(contact) {
    return $scope.shownContact === contact;
  };

  $scope.loadContacts = function() {
    $scope.contacts = loadSavedContacts();
      // if (isAndroid) {
      //   $scope.contacts = loadSavedContacts();
      // } else {
      //   $scope.contacts = mergeWithSavedContacts(contactsWithNumbersAndNames(testContacts));
      //   saveContacts($scope.contacts);
      // }
  }

  $scope.showFilterBar = function() {
    var filterBarInstance = $ionicFilterBar.show({
      items: $scope.contacts,
      update: function (filteredItems) {
        $scope.contacts = filteredItems;
      },
      filterProperties: 'displayName'
    });
  }

  $scope.toggleSilent = function(id) {
    $scope.contacts = toggleSilentContact(id);
  }

  $scope.toggleAlert = function(id) {
    $scope.contacts = toggleAlertContact(id);
  }

  $scope.toggleEmergency = function(id) {
    $scope.contacts = toggleEmergencyContact(id);
  }

  $scope.toggleSchedule = function(id) {
    $scope.contacts = toggleScheduleContact(id);
  }

  $scope.toggleHowler = function(id) {
    $scope.contacts = toggleHowlerContact(id);
  }

  $scope.init = function () {
    $scope.loadContacts();
  };

  $scope.init();
})


.controller('SettingsCtrl', function($scope) {
  $scope.toggleEmergencyMode = function() {
    $scope.emergency_mode = toggleEmergencyMode();
  }

  $scope.toggleSilenceMode = function() {
    $scope.silence_mode = toggleSilenceMode();
  }

  $scope.toggleAcceptUnknownAlert = function() {
    $scope.accept_unknown_alert = toggleAcceptUnknownAlert();
  }

  $scope.toggleAcceptUnknownSilent = function() {
    $scope.accept_unknown_silent = toggleAcceptUnknownSilent();
  }

  $scope.toggleAcceptUnknownEmergency = function() {
    $scope.accept_unknown_emergency = toggleAcceptUnknownEmergency();
  }

  $scope.toggleAcceptUnknownSchedule = function() {
    $scope.accept_unknown_schedule = toggleAcceptUnknownSchedule();
  }

  $scope.toggleAcceptUnknownHowler = function() {
    $scope.accept_unknown_howler = toggleAcceptUnknownHowler();
  }

  $scope.init = function() {
    loadUnknownNumberVariables();

    $scope.accept_unknown_emergency = loadBool('accept_unknown_emergency');
    $scope.accept_unknown_alert = loadBool('accept_unknown_alert');
    $scope.accept_unknown_silent = loadBool('accept_unknown_silent');
    $scope.accept_unknown_schedule = loadBool('accept_unknown_schedule');
    $scope.accept_unknown_howler = loadBool('accept_unknown_howler');
    $scope.emergency_mode = loadBool('emergency_mode');
    $scope.silence_mode = loadBool('silence_mode');
  }

  $scope.init();
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {

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

   $ionicFilterBarConfigProvider.theme('dark');
})

.config(['$compileProvider',
    function( $compileProvider ) {   
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|sms):/);
    }
])

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
