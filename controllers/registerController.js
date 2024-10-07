// controllers/registerController.js

app.controller('registerController', function($scope, $location, authService) {
  $scope.user = {};
  $scope.errorMessage = '';

  $scope.register = function() {
    authService.register($scope.user).then(function(response) {
      // Kayıt başarılı, token'ı sakla ve dashboard'a yönlendir
      authService.login(response.data.token);
      $location.path('/dashboard');
    }).catch(function(error) {
      console.error('Kayıt olurken hata:', error);
      $scope.errorMessage = 'Kayıt başarısız. Lütfen tekrar deneyiniz.';
      if (error.data && error.data.msg) {
        $scope.errorMessage = error.data.msg;
      }
    });
  };
});
