// app.js

var app = angular.module('myApp', ['ngRoute','pascalprecht.translate','ngSanitize']);

// Sayfalama için özel filtre
app.filter('startFrom', function() {
  return function(input, start) {
    if (!input || !input.length) { return; }
    start = +start; // string'i int'e çevir
    return input.slice(start);
  };
});

// Routing ayarları
app.config(function($routeProvider, $httpProvider) {
  // Interceptor ekle
  $httpProvider.interceptors.push('AuthInterceptor');

  $routeProvider
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController', // Büyük harfli 'L' ve 'C' kullanın
      isLoginPage: true
    })
    .when('/register', {
      templateUrl: 'views/register.html',
      controller: 'registerController', 
      isLoginPage: false
    })
    .when('/forgotpassword', {
      templateUrl: 'views/forgotPassword.html',
      controller: 'LoginController', 
      isLoginPage: false
    })
    .when('/resetpassword', {
      templateUrl: 'views/resetPassword.html',
      controller: 'LoginController', 
      isLoginPage: false
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'dashboardController', 
      isLoginPage: false,
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
      // Bu rotaya erişmek için giriş yapılmış olmalı
    })
    .otherwise({
      redirectTo: '/landing'
    });
});

// Çeviri ayarları
app.config(function($translateProvider) {
  $translateProvider.useStaticFilesLoader({
    prefix: '/languages/',
    suffix: '.json'
  });

  var userLang = navigator.language || navigator.userLanguage; // Tarayıcı dilini al
  console.log("Tarayıcı Dili: ", userLang);

  // Eğer tarayıcı dili Türkçe ise 'tr', değilse 'en' olarak varsayılan dili ayarla
  if (userLang.startsWith('tr')) {
    $translateProvider.preferredLanguage('tr');
  } else {
    $translateProvider.preferredLanguage('en');
  }

  // Varsayılan fallback dilini de ayarla
  $translateProvider.fallbackLanguage('en');
});

// Auth Interceptor (Dairesel Bağımlılığı Kırmak İçin $injector Kullanıldı)
app.factory('AuthInterceptor', function($q, $injector) {
  return {
    request: function(config) {
      var authService = $injector.get('authService');
      var token = authService.getToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token; // 'Bearer ' ekleyin
        console.log('AuthInterceptor: Token eklendi.');
      } else {
        console.log('AuthInterceptor: Token bulunamadı.');
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401 || response.status === 403) {
        var authService = $injector.get('authService');
        authService.logOut();
        window.location = '#!/login';
        console.log('AuthInterceptor: Unauthorized veya Forbidden hatası.');
      }
      return $q.reject(response);
    }
  };
});

// Uygulama çalıştırma
app.run(function($rootScope, $location, authService, $translate) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
    if (next.$$route && next.$$route.resolve && next.$$route.resolve.auth) {
      if (!authService.isLoggedIn()) {
        $location.path('/login');
      }
    }
  });

  var savedLanguage = localStorage.getItem('selectedLanguage'); // localStorage'dan dili alın
  if (savedLanguage) {
    $translate.use(savedLanguage);
    $rootScope.selectedLanguage = savedLanguage; // Eğer dil varsa, onu kullanın
  }
});
