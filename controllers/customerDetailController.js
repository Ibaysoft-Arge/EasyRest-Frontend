// controllers/customerDetailController.js
app.controller('customerDetailController', function($scope, $routeParams, customerService) {
    $scope.customer = {};
  
    // Müşteri ID'sini URL'den alıyoruz
    var customerId = $routeParams.id;
  
    // Müşteri detayını yükleme
    customerService.getCustomerById(customerId).then(function(response) {
      $scope.customer = response.data;
    }).catch(function(error) {
      console.error('Müşteri detayını yüklerken hata:', error);
      $scope.errorMessage = 'Müşteri detayını yüklerken bir hata oluştu.';
    });
  });
  