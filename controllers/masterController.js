app.controller('masterController', function ($scope, masterService, $rootScope, $location) {
    $scope.paketler = {};  // Initialize paketler object

    // Fetch pages
    masterService
        .sayfalar()
        .then(function (response) {
            console.log("Response:", response);
            $scope.paketler = response;  // Bind response data to scope
        })
        .catch(function (error) {
            console.error("Giriş hatası:", error.data.msg);
            alert(error.data.msg);
        });

    // Tıklanan sayfayı işleme
    $scope.sayfaSec = function (sayfa) {
        console.log("Tıklanan sayfa:", sayfa);
        $scope.seciliSayfa = sayfa;
        console.log(sayfa.kod);
        // Sayfanın kodunu kontrol etme
        if (sayfa.kod == "SAYFADENEME1") {
            console.log("Yönlendirme yapılıyor: /login");
            // Kullanıcıyı login sayfasına yönlendirme
            $location.path("/profile");
        }else if (sayfa.kod == "SAYFADENEME2") {
            console.log("Yönlendirme yapılıyor: /login");
            // Kullanıcıyı login sayfasına yönlendirme
            $location.path("/dashboard");
        }

        // Sayfa verilerine göre başka işlemler
        // Örneğin, sayfanın detayına yönlendirme veya API çağrısı yapma:
        // myService.getPageDetails(sayfa.id).then(...);
    };
});
