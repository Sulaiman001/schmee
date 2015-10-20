// Schmee Notifications app.js by Mocha Dick
var debug = true;

angular.module('schmee', ['ionic', 'ngCordova', 'ionic-material'])

.controller('MessagesCtrl', function($scope, $ionicModal) {
  $scope.shouldShowDelete = true;

  var testMessages = [
    // {
    //   id: 1,
    //   fromNumber: "0835592468891",
    //   body: "test !alert",
    //   fromName: "Glen Baker"
    // },
    // {
    //   id: 2,
    //   fromNumber: "0835592468891",
    //   body: "test !silent this is going to be a long SMS message.  Some people like to send whole essays in SMS messages.  Need to be semi-longform friendly.",
    //   fromName: "Glen Baker"
    // }
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

  $scope.replySMS = function(fromNumber) {
    $scope.sms.to = fromNumber;
    $scope.openModal();
  }

  // $scope.sendSMS = function() {
  //   if (SMS) {
  //     sendSMS();
  //   } else {
  //      alert( 'SMS plugin not available' ); return;
  //   }
  //   $scope.closeModal();
  // }

  // $ionicModal.fromTemplateUrl('templates/sendMessageModal.html', {
  //   scope: $scope,
  //   animation: 'slide-in-up'
  // }).then(function(modal) {
  //   $scope.modal = modal;
  // });

  // $scope.openModal = function() {
  //   $scope.modal.show();
  // };

  // $scope.closeModal = function() {
  //   $scope.modal.hide();
  // };

  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });

  // $scope.$on('modal.hidden', function() {
  // });

  // $scope.$on('modal.removed', function() {
  // });
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
        $scope.contacts = mergeWithSavedContacts(testContacts);
        saveContacts($scope.contacts);
      }
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