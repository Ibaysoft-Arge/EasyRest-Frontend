// controllers/LoginController.js

app.controller("LoginController", function ($scope, authService, $location) {
  $scope.user = {};
  $scope.rememberMe = false;
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
});
