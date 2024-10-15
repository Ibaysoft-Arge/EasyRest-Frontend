app.factory('profileService', function($http, $window) {
    var service = {};
    
    // Kullanıcı giriş yapma (API isteği)
    service.profile = function () {
        return $http.post('http://localhost:5000/api/auth/getUserByKullaniciId', { userId: $window.localStorage['userIdLS'] })
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
