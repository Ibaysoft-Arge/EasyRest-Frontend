// services/paket.js

app.factory('paketService', function($http) {
    var service = {};

  service.getPaketler = function() {
    return $http.get('http://localhost:5000/api/paket/getPaketler');
  };

    return service;
});
