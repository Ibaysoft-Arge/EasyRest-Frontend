app.factory('entegrasyonService', function ($http, $window, $rootScope) {
    var auth = {};

    auth.trendyolBilgileriCek = function () {
        return $http.post('http://localhost:5000/api/entegrasyon/trendyolByUserID' , { userID: $window.localStorage['userIdLS'] })
          .then(function (response) {
            console.log('Bilgiler alındı');
            return response;
          })
          .catch(function (error) {
            console.error('Bilgiler Geldi', error);
            throw error;
          });
      };
    return auth;
});