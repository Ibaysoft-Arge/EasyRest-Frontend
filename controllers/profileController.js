app.controller('profileController', function ($scope, authService, profileService, $location) {
  $scope.user = {};

  var base64String;
  $scope.previewImageSrc = null;

  $scope.previewImage = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $scope.$apply(function () {
          $scope.previewImageSrc = e.target.result;
          // "data:image/png;base64," kısmını kaldır
          base64String = e.target.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
          $scope.user.avatar = base64String;
        });
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  $scope.resetImage = function () {
    $scope.previewImageSrc = null;  // Görsel önizleme sıfırla
    $scope.user.avatar = null;      // Base64 verisini temizle
    var fileInput = document.getElementById('upload');
    $scope.user.avatar = base64String;  
    fileInput.value = '';           // Dosya inputunu temizle
  };
  

  // Kullanıcı bilgilerini sunucudan alıyoruz
  authService.getUserFromServer().then(function (response) {
    $scope.user = response.data;
  }).catch(function (error) {
    console.error('Kullanıcı bilgileri alınamadı:', error);
    authService.logOut();
    $location.path('/login');
  });

  // Profili güncelleme fonksiyonu
  $scope.updateProfile = function () {
    profileService.updateProfile($scope.user)
      .then(function (response) {
        console.log('Profil başarıyla güncellendi:', response);
        // Gerekirse kullanıcıya başarılı olduğunu gösteren bir mesaj ver
      })
      .catch(function (error) {
        console.error('Profil güncellenirken hata:', error);
        $scope.errorMessage = 'Güncelleme başarısız. Lütfen tekrar deneyiniz.';
        if (error.data && error.data.msg) {
          $scope.errorMessage = error.data.msg;
        }
      });
  };
});
