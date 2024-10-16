// app.js

var app = angular.module('myApp', ['ngRoute', 'pascalprecht.translate', 'ngSanitize']);

// Sayfalama için özel filtre
app.filter('startFrom', function () {
  return function (input, start) {
    if (!input || !input.length) { return; }
    start = +start; // string'i int'e çevir
    return input.slice(start);
  };
});

// Routing ayarları
app.config(function ($routeProvider, $httpProvider) {
  // Interceptor ekle
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider
  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'LoginController', // Büyük harfli 'L' ve 'C' kullanın
    isLoginPage: true,
    layout:'/layout/login-layout.html',
  })
  .when('/register', {
    templateUrl: 'views/register.html',
    controller: 'registerController', 
    isLoginPage: false,
    layout:'/layout/login-layout.html',
  })
  .when('/forgotpassword', {
    templateUrl: 'views/forgotPassword.html',
    controller: 'LoginController', 
    isLoginPage: false,
    layout:'/layout/login-layout.html',
  })
  .when('/resetpassword', {
    templateUrl: 'views/resetPassword.html',
    controller: 'LoginController', 
    isLoginPage: false,
    layout:'/layout/login-layout.html',
  })
  .when('/dashboard', {
    templateUrl: 'views/dashboard.html',
    controller: 'dashboardController', 
    isLoginPage: false,
    layout:'/layout/dashboard-layout.html',
    // Bu rotaya erişmek için giriş yapılmış olmalı
    resolve: {
      auth: function(authService, $location) {
        if (!authService.isLoggedIn()) {
          $location.path('/login');
        }
      }
    }
  })
  .when('/profile', {
    templateUrl: 'views/profile.html',
    controller: 'dashboardController', 
    isLoginPage: false,
    layout:'/layout/dashboard-layout.html',
    // Bu rotaya erişmek için giriş yapılmış olmalı
    resolve: {
      auth: function(authService, $location) {
        if (!authService.isLoggedIn()) {
          $location.path('/login');
        }
      }
    }
  })
  .when('/landing', {
    templateUrl: 'views/landing.html',
    controller: 'paketController', // Büyük harfli 'D' ve 'C' kullanın
    isLoginPage: true,
    layout:'/layout/main-layout.html',
  })
  .when('/contactus', {
    templateUrl: 'views/contactus.html',
    controller: 'contactusController', // Büyük harfli 'D' ve 'C' kullanın
    isLoginPage: true,
    layout:'/layout/main-layout.html',
  })
  .otherwise({
    redirectTo: '/landing'
  });
});

// Çeviri ayarları
app.config(function ($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/languages/',
    suffix: '.json'
  });

  var userLang = navigator.language || navigator.userLanguage;
  if (userLang.startsWith('tr')) {
    $translateProvider.preferredLanguage('tr');
  } else {
    $translateProvider.preferredLanguage('en');
  }

  $translateProvider.fallbackLanguage('en');
});

// Auth Interceptor
app.factory('AuthInterceptor', function ($q, $injector) {
  return {
    request: function (config) {
      var authService = $injector.get('authService');
      var token = authService.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    responseError: function (response) {
      if (response.status === 401 || response.status === 403) {
        var authService = $injector.get('authService');
        authService.logOut();
        window.location = '#!/login';
      }
      return $q.reject(response);
    }
  };
});

app.run(function ($rootScope, $location, authService, $translate, $templateRequest, $compile) {
  // Route değişimlerinde layout yükleme ve auth kontrolü
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    // Eğer bir layout belirlenmişse, onu yükle
    if (next.$$route && next.$$route.layout) {
      var layoutUrl = next.$$route.layout;

      // Layout-container'ı kontrol edin ve içeriği temizleyin
      var layoutElement = angular.element(document.querySelector('#layout-container'));
      layoutElement.empty(); // Mevcut layout'u temizleyin

      // Yeni layout'u yükleyin
      $templateRequest(layoutUrl).then(function (template) {
        layoutElement.html(template); // Yeni layout'u ekleyin
        $compile(layoutElement.contents())($rootScope); // AngularJS template'ini derleyin
      });
    }

    // Auth kontrolü: Eğer auth gerekliyse, kullanıcı giriş yapmamışsa login'e yönlendir
    if (next.$$route && next.$$route.resolve && next.$$route.resolve.auth) {
      if (!authService.isLoggedIn()) {
        $location.path('/login');
      }
    }
  });

  // Dil kontrolü: LocalStorage'da dil varsa onu kullan
  var savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) {
    $translate.use(savedLanguage);
    $rootScope.selectedLanguage = savedLanguage; // Eğer dil varsa onu set et
  }

  // Eğer localStorage'da dil yoksa, varsayılan dil ayarını kullan
  if (!$rootScope.selectedLanguage) {
    $rootScope.selectedLanguage = $translate.preferredLanguage(); // Varsayılan dil
  }
});

