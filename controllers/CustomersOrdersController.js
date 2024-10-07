app.controller('CustomersOrdersController', function($scope, $http, $location) {
    $scope.usersWithOrders = [];
    $scope.loading = true;
    $scope.error = null;
  
    // Kullanıcıların siparişlerini al
    $http.get('http://172.16.127.64:5000/api/customers/orders')
      .then(function(response) {
        $scope.usersWithOrders = response.data;
        $scope.loading = false;
        console.log('CustomersOrdersController: Kullanıcı siparişleri yüklendi.');
      })
      .catch(function(error) {
        $scope.error = error.data.msg || 'Kullanıcı siparişleri alınamadı.';
        $scope.loading = false;
        console.error('CustomersOrdersController: Hata:', error);
        if (error.status === 401) {
          alert('Giriş yapmanız gerekiyor.');
          $location.path('/login');
        }
      });



      
  });
  
  