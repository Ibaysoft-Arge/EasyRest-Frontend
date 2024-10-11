app.factory('masterService', function($http, $window) {
    var service = {};
    
    // Kullanıcı giriş yapma (API isteği)
    service.sayfalar = function () {
        return $http.post('http://localhost:5000/api/paket/getSayfalar', { userId: $window.localStorage['userIdLS'] })
            .then(function (response) {
                console.log(response);
                return response.data;
            })
            .catch(function (error) {
                console.error("API hatası:", error);
                throw error;
            });
    };

    return service;
});
