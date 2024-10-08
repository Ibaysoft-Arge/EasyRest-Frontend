app.controller('LanguageController', function($scope, $translate) {
    $scope.changeLanguage = function (langKey) {
      $translate.use(langKey);
    };
  });