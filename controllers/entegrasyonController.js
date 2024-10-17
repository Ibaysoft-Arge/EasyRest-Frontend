// controllers/dashboardController.js

app.controller('entegrasyonController', function ($scope, $translate, $rootScope, entegrasyonService) {
    $scope.trendyolBilgi = {};

    entegrasyonService.trendyolBilgileriCek().then(function (response) {
        $scope.trendyolBilgi = response.data;
        console.log(response.data);
    }).catch(function (error) {
        console.error('Trendyol Entegrasyon Bilgileri Kayıt Edilemedi', error);
    });

    $scope.save = function (langKey) {
        console.log("changeLanguage=" + langKey);
        $translate.use(langKey);
        localStorage.setItem('selectedLanguage', langKey);
        $rootScope.selectedLanguage = langKey;
    };
});
