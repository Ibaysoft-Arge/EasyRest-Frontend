// controllers/dashboardController.js

app.controller('entegrasyonController', function ($scope, entegrasyonService) {
    $scope.trendyolBilgi = {};
    $scope.yemekSepetiBilgi = {};

    entegrasyonService.trendyolBilgileriCek().then(function (response) {
        $scope.trendyolBilgi = response;
        console.log("Deneme Verisi: ");
        console.log(response);
    }).catch(function (error) {
        console.error('Trendyol Entegrasyon Bilgileri Çekilemedi', error);
    });

    entegrasyonService.yemeksepetiBilgileriCek().then(function (response) {
        $scope.yemekSepetiBilgi = response.data;
        console.log(response.data);
    }).catch(function (error) {
        console.error('Yemek Sepeti Entegrasyon Bilgileri Çekilemedi', error);
    });

    $scope.trendyolGuncelle = function () {
        console.log("Deneme Güncelle : " + $scope.trendyolBilgi);
        entegrasyonService.trendyolGuncelle($scope.trendyolBilgi).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error('Trendyol Entegrasyon Bilgileri Kayıt Edilemedi', error);
        });
    };

    $scope.yemekSepetiGuncelle = function () {
        entegrasyonService.yemekSepetiGuncelle($scope.yemekSepetiBilgi).then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.error('Yemek Sepeti Entegrasyon Bilgileri Kayıt Edilemedi', error);
        });
    };
});
