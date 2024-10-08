app.controller('paketController', function($scope, paketService) {
    $scope.paketler = {};

    paketService.getPaketler().then(function(response) {
            console.log('paketController response:', response);
            // API yanıtının yapısına göre ayarlama yapın
            if (Array.isArray(response.data)) { // Dönüş bir dizi ise
                $scope.paketler = response.data;
                console.info('Geldi');
            } else {
                console.error('Beklenmeyen veri formatı:', response.data);
                alert('Beklenmeyen veri formatı.');
            }
        })
        .catch(function(error) {
            console.error('PaketController error:', error);
            alert('Paket bilgisi alınamadı.');
        });
    // Paket verilerini API'den al
    // $scope.paketler = function() {
    //     paket.getPaketler().then(function(response) {
    //         console.log('paketController response:', response);
    //         // API yanıtının yapısına göre ayarlama yapın
    //         if (Array.isArray(response.data)) { // Dönüş bir dizi ise
    //             $scope.paketler = response.data;
    //             console.info('Geldi');
    //         } else {
    //             console.error('Beklenmeyen veri formatı:', response.data);
    //             alert('Beklenmeyen veri formatı.');
    //         }
    //     })
    //     .catch(function(error) {
    //         console.error('PaketController error:', error);
    //         alert('Paket bilgisi alınamadı.');
    //     });
    //   };
});
