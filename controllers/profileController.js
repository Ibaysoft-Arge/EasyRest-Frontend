// controllers/profileController.js

app.controller('profileController', function($scope, authService, $location) {
  
    $scope.profile = function() {
      profileService.profile($scope.user).then(function(response) {
      }).catch(function(error) {
        console.error('Bilgi gelirken hata:', error);
        $scope.errorMessage = 'Veri getirme başarısız. Lütfen tekrar deneyiniz.';
        if (error.data && error.data.msg) {
          $scope.errorMessage = error.data.msg;
        }
      });
    };
  });
  