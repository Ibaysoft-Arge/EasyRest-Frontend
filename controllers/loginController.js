// controllers/LoginController.js

app.controller("LoginController", function ($scope, authService, $location) {
  $scope.user = {};
  $scope.rememberMe = false;

  var guid = $location.search().g;
  var userID = $location.search().u;

  if (guid && userID) {
    $scope.guid = guid;
    $scope.userID = userID;
  } else {
    console.log("Query string parametreleri yok.");
  }

  $scope.login = function () {
    authService
      .login($scope.user)
      .then(function (response) {
        console.log("$scope.rememberMe:", $scope.rememberMe);

        localStorage["remember"] = $scope.rememberMe;

        // Giriş başarılı, kullanıcıyı yönlendirin
        $location.path("/dashboard");
      })
      .catch(function (error) {
        console.error("Giriş hatası:", error.data.msg);
        alert(error.data.msg);
      });
  };

  var savedToken =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (savedToken) {
    
    var rememberinfo = localStorage.getItem("remember");

    // JSON.parse() işlemini sadece geçerli bir değer olduğunda yap
    if (rememberinfo && rememberinfo !== "undefined") {
      rememberinfo = JSON.parse(rememberinfo);
    } else {
      rememberinfo = false; // Varsayılan olarak false yap
    }

    console.log("rememberinfo", rememberinfo);
    if (rememberinfo==true) {
      $location.path("/dashboard");
    }
  }
  
  $scope.forgotPassword = function() {
    authService.forgotPassword({ email: $scope.user.email }) // e-posta adresini gönder
    .then(function(response) {
        $scope.successMessage = 'Başarılı, mail adresini kontrol ediniz.';
    })
    .catch(function(error) {
        console.error('Kayıt olurken hata:', error);
        $scope.errorMessage = 'Kayıt başarısız. Lütfen tekrar deneyiniz.';
        if (error.data && error.data.msg) {
            $scope.errorMessage = error.data.msg;
        }
    });
};

$scope.resetPassword = function() {
  authService.resetPassword({ sifre: $scope.user.sifre , guid : $scope.guid , userId : $scope.userID }) // e-posta adresini gönder
  .then(function(response) {
      $scope.successMessage = 'Başarılı, Tekrar giriş yapın.';
      $location.path("/login").search({});
  })
  .catch(function(error) {
      console.error('Şifre güncellenirken hata:', error);
      $scope.errorMessage = 'Güncelleme başarısız. Lütfen tekrar deneyiniz.';
      if (error.data && error.data.msg) {
          $scope.errorMessage = error.data.msg;
      }
  });
};


});
