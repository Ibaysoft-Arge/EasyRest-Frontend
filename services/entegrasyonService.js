app.factory('entegrasyonService', function ($http, $window, $rootScope) {
    var service = {};

    service.trendyolBilgileriCek = function () {
        return $http.post('http://localhost:5000/api/entegrasyon/trendyolByUserID', { userID: $window.localStorage['userIdLS'] })
            .then(function (response) {
                console.log("Alo");
                console.log(response.data.bilgiler);
                return response.data.bilgiler;
            })
            .catch(function (error) {
                console.error('Trendyol hata', error);
                throw error;
            });
    };

    service.trendyolGuncelle = function (data) {
        return $http.post('http://localhost:5000/api/entegrasyon/trendyolGuncelle', { userID: data.userID, saticiID: data.saticiID, restID: data.restID, restKey: data.restKey, secretKey: data.secretKey })
            .then(function (response) {
                console.log('Trendyol Bilgiler alındı');
                return response.data;
            })
            .catch(function (error) {
                console.error('Trendyol hata', error);
                throw error;
            });
    };

    /////////////////////////////////////////
    //Yemek Sepeti

    service.yemeksepetiBilgileriCek = function () {
        return $http.post('http://localhost:5000/api/entegrasyon/yemekSepetiByUserID', { userID: $window.localStorage['userIdLS'] })
            .then(function (response) {
                console.log('Bilgiler alındı');
                return response.data;
            })
            .catch(function (error) {
                console.error('Yemek Sepeti hata', error);
                throw error;
            });
    };

    service.yemekSepetiGuncelle = function () {
        return $http.post('http://localhost:5000/api/entegrasyon/yemekSepetiGuncelle', { userID: data.userID, user: data.user, pass: data.pass })
            .then(function (response) {
                console.log('Yemek Sepeti Bilgiler alındı');
                return response.data;
            })
            .catch(function (error) {
                console.error('Yemek Sepeti hata', error);
                throw error;
            });
    };
    return service;
});