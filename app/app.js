var app = angular.module('myApp', ['ngRoute', 'ngSanitize', 'pascalprecht.translate']);

app.config(function ($routeProvider, $translateProvider, $locationProvider) {

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });

  // Çeviri dosyalarının yolu ve uzantısı
  $translateProvider.useStaticFilesLoader({
    prefix: 'app/languages/', // Dil dosyalarının bulunduğu yol
    suffix: '.json'           // Dil dosyalarının uzantısı
  });

  // Varsayılan dil
  $translateProvider.preferredLanguage('tr');

  // Güvenlik için sanitize stratejisi
  $translateProvider.useSanitizeValueStrategy('escape');

  // Route konfigürasyonu
  $routeProvider
    .when('/', {
      templateUrl: 'index.html',
      controller: 'MainController'
    })
    .when('/sepet', {
      templateUrl: '/app/pages/sepet.html',
      controller: 'SepetController'
    })
    .otherwise({
      redirectTo: '/'
    });
});


app.controller('MainController', function ($scope, $rootScope, $translate, $location) {

  $scope.language = localStorage.getItem('selectedLanguage') || 'tr';
  $rootScope.selectedLanguage = $scope.language;

  // Dil değiştirme fonksiyonu
  $scope.changeLanguage = function (langKey) {
    console.log("changeLanguage=" + langKey);
    $translate.use(langKey); // Angular translate ile dil değiştir
    localStorage.setItem('selectedLanguage', langKey); // Dil ayarını localStorage'a kaydet
    $rootScope.selectedLanguage = langKey; // $rootScope'da sakla
  };

  // Uygulama başladığında seçili dili yükleme
  $translate.use($scope.language);

  $scope.GetPage = function () {
    console.log("Yönlenen sayfa : " + $location.path());
    return $location.path();
  };
});
