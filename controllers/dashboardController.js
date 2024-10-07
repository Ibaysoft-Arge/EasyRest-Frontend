// controllers/dashboardController.js


// Yazıcıyı başlat

app.controller('DashboardController', function($scope, authService, customerService, $location) {
  $scope.user = {};

  // Kullanıcı bilgilerini alma
  authService.getUserFromServer().then(function(response) {
    $scope.user = response.data;
  }).catch(function(error) {
    console.error('Kullanıcı bilgileri alınamadı:', error);
    authService.logOut();
    $location.path('/login');
  });

  // Müşteri verileri
  $scope.customers = [];
  $scope.newCustomer = {};
  $scope.editingCustomer = null;
  $scope.customerToDelete = null;

  // Arama ve sayfalama için değişkenler
  $scope.searchQuery = '';
  $scope.currentPage = 1;
  $scope.itemsPerPage = 500; // Seçilebilir

  // Müşterileri yükleme
  $scope.loadCustomers = function() {
    customerService.getCustomers().then(function(response) {
      $scope.customers = response.data;
    }).catch(function(error) {
      console.error('Müşterileri yüklerken hata:', error);
      $scope.errorMessage = 'Müşterileri yüklerken bir hata oluştu.';
    });
  };

  $scope.populateCustomers = function() {
    if (confirm('10,000 adet rastgele müşteri eklemek istediğinizden emin misiniz? Bu işlem birkaç dakika sürebilir.')) {
      customerService.populateCustomers().then(function(response) {
        $scope.successMessage = response.data.msg;
        // İsteğe bağlı olarak, müşteri listesini yeniden yükleyebilirsiniz
        $scope.loadCustomers();
      }).catch(function(error) {
        console.error('Müşterileri eklerken hata:', error);
        $scope.errorMessage = error.data.msg || 'Müşterileri eklerken bir hata oluştu.';
      });
    }
  };


  $scope.loadCustomers();

  // Yeni müşteri ekleme
  $scope.addCustomer = function() {
    customerService.addCustomer($scope.newCustomer).then(function(response) {
      $scope.customers.push(response.data);
      $scope.newCustomer = {}; // Formu temizle
      $('#addCustomerModal').modal('hide'); // Modalı kapat
    }).catch(function(error) {
      console.error('Müşteri eklerken hata:', error);
      $scope.errorMessage = 'Müşteri eklenirken bir hata oluştu.';
    });
  };

  // Müşteri düzenleme moduna geçme
  $scope.editCustomer = function(customer) {
    $scope.editingCustomer = angular.copy(customer);
  };

  // Müşteri güncelleme
  $scope.updateCustomer = function() {
    customerService.updateCustomer($scope.editingCustomer._id, $scope.editingCustomer).then(function(response) {
      // Listeyi güncelle
      for (var i = 0; i < $scope.customers.length; i++) {
        if ($scope.customers[i]._id === response.data._id) {
          $scope.customers[i] = response.data;
          break;
        }
      }
      $scope.editingCustomer = null;
      $('#editCustomerModal').modal('hide'); // Modalı kapat
    }).catch(function(error) {
      console.error('Müşteri güncellerken hata:', error);
      $scope.errorMessage = 'Müşteri güncellenirken bir hata oluştu.';
    });
  };

  // Müşteri düzenlemeyi iptal etme
  $scope.cancelEdit = function() {
    $scope.editingCustomer = null;
  };

  // Silinecek müşteriyi hazırlama
  $scope.prepareDelete = function(customer) {
    $scope.customerToDelete = customer;
  };

  // Müşteri silme
  $scope.confirmDelete = function() {
    customerService.deleteCustomer($scope.customerToDelete._id).then(function() {
      // Listeden müşteriyi kaldır
      $scope.customers = $scope.customers.filter(function(c) {
        return c._id !== $scope.customerToDelete._id;
      });
      $scope.customerToDelete = null;
      $('#deleteCustomerModal').modal('hide'); // Modalı kapat
    }).catch(function(error) {
      console.error('Müşteri silerken hata:', error);
      $scope.errorMessage = 'Müşteri silinirken bir hata oluştu.';
    });
  };

  // Sayfalama fonksiyonları
  $scope.numberOfPages = function() {
    return Math.ceil($scope.filteredCustomers().length / $scope.itemsPerPage);
  };

  $scope.setPage = function(page, $event) {
    if (page < 1 || page > $scope.numberOfPages()) {
      return;
    }
    $scope.currentPage = page;
    $event.preventDefault();
  };

  $scope.filteredCustomers = function() {
    var query = $scope.searchQuery.toLowerCase();
    return $scope.customers.filter(function(customer) {
      return (
        customer.name.toLowerCase().includes(query) ||
        (customer.email && customer.email.toLowerCase().includes(query)) ||
        (customer.phone && customer.phone.includes(query))
      );
    });
  };

  $scope.getPagedCustomers = function() {
    var start = ($scope.currentPage - 1) * $scope.itemsPerPage;
    var end = start + $scope.itemsPerPage;
    return $scope.filteredCustomers().slice(start, end);
  };

  // Çıkış yapma fonksiyonu
  $scope.logout = function() {
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
    //
  

  };
  

});
