// controllers/dashboardController.js

app.controller('dashboardController', function($scope, authService, $location) {

  $scope.user = {};
    // Kullanıcı bilgilerini alma
    authService.getUserFromServer().then(function(response) {
      $scope.user = response.data;
    }).catch(function(error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      authService.logOut();
      $location.path('/login');
    });


  // Çıkış yapma fonksiyonu
  $scope.logout = function() {
    console.info('Çıkış Yapıldı');
    authService.logOut();
    $location.path('/login');
  };


  $scope.printReceipt = function(customer) {
    customerService
    .denemeservis("deneme")
    .then(function(response) {
      // Listeyi güncelle
    })
    .catch(function(error) {
      console.error('yazdirkenhata:', error);
    });
  };
  
 
  $scope.changeLanguage = function (langKey) {
    console.log("changeLanguage="+langKey);
    $translate.use(langKey);
    localStorage.setItem('selectedLanguage', langKey);
    $rootScope.selectedLanguage = langKey;
    
  };

});
