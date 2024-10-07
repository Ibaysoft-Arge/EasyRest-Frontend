app.controller('customerController', function($scope, customerService) {
  $scope.customers = [];
  $scope.newCustomer = {};
  $scope.customerToDelete = null;
  $scope.currentPage = 1;
  $scope.itemsPerPage = 5; // Her sayfada gösterilecek müşteri sayısı
  $scope.totalItems = 0;
  // Müşterileri yükleme
  customerService.getCustomers().then(function(response) {
    $scope.customers = response.data;
    $scope.totalItems = $scope.customers.length;
  }).catch(function(error) {
    console.error('Müşterileri yüklerken hata:', error);
  });

  
  $scope.getPagedCustomers = function() {
    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    var end = start + $scope.itemsPerPage;
    return $scope.customers.slice(start, end);
  };

  $scope.setPage = function(pageNo, $event) {
    if ($event) {
      $event.preventDefault(); // Varsayılan davranışı engelle
    }
    if (pageNo >= 1 && pageNo <= $scope.numberOfPages()) {
     // console.log('Sayfa değiştiriliyor:', pageNo);
      $scope.currentPage = pageNo;
    }
  };
// Müşteri düzenleme formunu açmak için
$scope.editCustomer = function(customer) {
  $scope.editingCustomer = angular.copy(customer);
};

$scope.numberOfPages = function() {
  return Math.ceil($scope.customers.length / $scope.itemsPerPage);
};
// Müşteri güncelleme
$scope.updateCustomer = function() {
  customerService
    .updateCustomer($scope.editingCustomer._id, $scope.editingCustomer)
    .then(function(response) {
      // Listeyi güncelle
      for (var i = 0; i < $scope.customers.length; i++) {
        if ($scope.customers[i]._id === response.data._id) {
          $scope.customers[i] = response.data;
          break;
        }
      }
      $scope.editingCustomer = null;
      // Modalı kapat
      $('#editCustomerModal').modal('hide');
    })
    .catch(function(error) {
      console.error('Müşteri güncellerken hata:', error);
    });
};

// Müşteri düzenlemeyi iptal etme
$scope.cancelEdit = function() {
  $scope.editingCustomer = null;
};

  // Müşteri ekleme
  $scope.addCustomer = function() {
    customerService.addCustomer($scope.newCustomer).then(function(response) {
      $scope.customers.push(response.data);
      $scope.newCustomer = {}; // Formu temizle
    }).catch(function(error) {
      console.error('Müşteri eklerken hata:', error);
    });
  };

  $scope.deleteCustomer = function(customer) {
    if (confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      customerService.deleteCustomer(customer._id)
        .then(function() {
          // Listeden müşteriyi kaldır
          $scope.customers = $scope.customers.filter(function(c) {
            return c._id !== customer._id;
          });
        })
        .catch(function(error) {
          console.error('Müşteri silerken hata:', error);
        });
    }
  };


});