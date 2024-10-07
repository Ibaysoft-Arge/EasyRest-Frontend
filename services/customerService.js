// services/customerService.js

app.factory('customerService', function($http) {
  var service = {};

  // Müşterileri getirme
  service.getCustomers = function() {
    return $http.get('http://172.16.127.64:5000/api/customers');
  };

  // Müşterileri populate etme
  service.populateCustomers = function() {
    return $http.post('http://172.16.127.64:5000/api/customers/populate', {});
  };

  // Müşteri ekleme
  service.addCustomer = function(customer) {
    return $http.post('http://172.16.127.64:5000/api/customers', customer);
  };

  // Müşteri güncelleme
  service.updateCustomer = function(id, customer) {
    return $http.put('http://172.16.127.64:5000/api/customers/' + id, customer);
  };

  service.denemeservis = function(id) {
    return $http.post('http://localhost:12345/',  id);
  };

  // Müşteri silme
  service.deleteCustomer = function(id) {
    return $http.delete('http://172.16.127.64:5000/api/customers/' + id);
  };

  return service;
});
