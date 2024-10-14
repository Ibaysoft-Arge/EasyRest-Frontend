// controllers/dashboardController.js

app.controller('dashboardLayoutController', function($scope,$translate,$rootScope) {

  
  
 
  $scope.changeLanguage = function (langKey) {
    console.log("changeLanguage="+langKey);
    $translate.use(langKey);
    localStorage.setItem('selectedLanguage', langKey);
    $rootScope.selectedLanguage = langKey;
    
  };

});
