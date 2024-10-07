app.controller('AddOrderController', function($scope, $http, authService, $location) {
    $scope.order = {
      product: '',
      quantity: 1,
      price: 0
    };
    $scope.success = null;
    $scope.error = null;
  
    // Yeni sipariş ekleme fonksiyonu
    $scope.addOrder = function() {
      if (!$scope.order.product || !$scope.order.quantity || !$scope.order.price) {
        $scope.error = 'Lütfen tüm alanları doldurun.';
        return;
      }
  
      $http.post('http://172.16.127.64:5000/api/orders', $scope.order)
        .then(function(response) {
          $scope.success = 'Sipariş başarıyla oluşturuldu.';
          $scope.error = null;
          $scope.order = {
            product: '',
            quantity: 1,
            price: 0
          };
          console.log('AddOrderController: Sipariş oluşturuldu.');
        })
        .catch(function(error) {
          $scope.error = error.data.msg || 'Sipariş oluşturulamadı.';
          $scope.success = null;
          console.error('AddOrderController: Hata:', error);
          if (error.status === 401) {
            alert('Giriş yapmanız gerekiyor.');
            $location.path('/login');
          }
        });
    };
  });
  