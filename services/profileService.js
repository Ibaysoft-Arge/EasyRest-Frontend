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

    service.updateProfile = function (userData) {
        return $http.put('http://localhost:5000/api/auth/updateByKullaniciId', {
            userId: userData._id,  // user ID'yi buradan alıyoruz
            kullaniciAdi: userData.kullaniciAdi,
            email: userData.email,
            telefon: userData.telefon,
            faturaBilgileri: {
                faturaTipi: userData.faturaBilgileri.faturaTipi,
                faturaIl: userData.faturaBilgileri.faturaIl,
                faturaIlce: userData.faturaBilgileri.faturaIlce,
                vergiNumarasi: userData.faturaBilgileri.vergiNumarasi,
                adres: userData.faturaBilgileri.adres,
                postaKodu: userData.faturaBilgileri.postaKodu
            },
            kvkk: userData.kvkk,
            paketBilgisi: userData.paketBilgisi ,
            avatar: userData.avatar
        })
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
