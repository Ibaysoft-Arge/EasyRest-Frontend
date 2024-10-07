// controllers/LoginController.js

app.controller('LoginController', function($scope, authService, $location) {
  $scope.user = {};

  $scope.login = function() {
    authService.login($scope.user)
      .then(function(response) {
        console.log('Token alındı:', response.data.token);
        // Giriş başarılı, kullanıcıyı yönlendirin
        $location.path('/dashboard');
      })
      .catch(function(error) {
        console.error('Giriş hatası:', error.data.msg);
        alert(error.data.msg);
      });
  };
});
