// services/authService.js

app.factory('authService', function ($http, $window, $rootScope) {
  var auth = {};

  // Kullanıcı token'ını kaydetme
  auth.saveToken = function (token) {
    $window.localStorage['token'] = token;
    console.log('AuthService: Token kaydedildi.');
  };

  // Kullanıcı token'ını alma
  auth.getToken = function () {
    var token = $window.localStorage['token'];
    //  console.log('AuthService: Token alındı:', token);
    return token;
  };

  // Kullanıcının giriş yapıp yapmadığını kontrol etme
  auth.isLoggedIn = function () {
    var token = auth.getToken();

    if (token) {
      // Token'ın süresinin dolup dolmadığını kontrol edin
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };
  // Kullanıcı giriş yapma (API isteği)
  auth.login = function (user) {
    return $http.post('http://localhost:5000/api/auth/login', user)
      .then(function (response) {
        const token = response.data.token;

        // Token'ı localStorage'a kaydet
        auth.saveToken(token);

        // Token'ı çözümle ve user.id'yi al
        const decodedToken = parseJwt(token);
        const userId = decodedToken.user.id; // 'userId' değil 'id' olmalı

        // userId'yi localStorage'a kaydet
        $window.localStorage['userIdLS'] = userId;

        // Doğru şekilde localStorage'daki değeri kontrol edelim
        console.log($window.localStorage['userIdLS']);

        return response;
      });
  };

  // Token'ı base64 formatında decode eden fonksiyon (jwt-decode kütüphanesi kullanmadan)
  function parseJwt(token) {
    const base64Url = token.split('.')[1]; // JWT'nin payload kısmı
    const base64 = decodeURIComponent(atob(base64Url).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64); // JWT içindeki JSON verisi
  }


  auth.register = function (user) {
    // Kullanıcıdan alınan veriler (user nesnesi)
    const newUser = {
      "kullaniciAdi": user.kullaniciAdi,
      "sifre": user.sifre,
      "email": user.email,
      "telefon": user.telefon,
      "faturaBilgileri": {
        "faturaTipi": "Bireysel",
        "faturaIl": "İstanbul",
        "faturaIlce": "Kadıköy",
        "vergiNumarasi": "1234567890",
        "adres": "Örnek Mah. No:12",
        "postaKodu": "34000"
      },
      "olusturulmaTarihi": "2024-10-11T07:51:39.775Z",
      "kvkk": true,
      "paketBilgisi": "6707a0fa434842226a6d8853",
      "moduller": [
        {
          "modul": "6707a24b434842226a6d8855",
          "bitisTarihi": "2024-10-11",
          "altModuller": [
            {
              "altModul": "670518574fe4e2f776cbc7df",
              "sayfalar": [
                "6705188a4fe4e2f776cbc7e3",
                "670518bb4fe4e2f776cbc7e5"
              ]
            },
            {
              "altModul": "6705185b4fe4e2f776cbc7e1",
              "sayfalar": [
                "670518c44fe4e2f776cbc7e7"
              ]
            }
          ]
        },
        {
          "modul": "6707a274434842226a6d8857",
          "bitisTarihi": "2024-10-21",
          "altModuller": []
        },
        {
          "modul": "6707a2a1434842226a6d8859",
          "bitisTarihi": "2024-10-21",
          "altModuller": []
        },
        {
          "modul": "6707a2c4434842226a6d885b",
          "bitisTarihi": "2024-10-21",
          "altModuller": []
        }
      ],
      "ekModuller": []

    }

    return $http.post('http://localhost:5000/api/auth/register', newUser)
      .then(function (response) {
        // auth.saveToken(response.data.token);
        return response;
      });

  };





  // Kullanıcı çıkış yapma
  auth.logOut = function () {
    $window.localStorage.removeItem('token');
    console.log('AuthService: Token kaldırıldı.');

  };

  // Kullanıcı bilgilerini alma (sunucudan)
  auth.getUserFromServer = function () {
    return $http.get('http://localhost:5000/api/auth/user')
      .then(function (response) {
        console.log('AuthService: Kullanıcı bilgileri alındı.');
        return response;
      })
      .catch(function (error) {
        console.error('AuthService: Kullanıcı bilgileri alınamadı:', error);
        throw error;
      });
  };

  auth.forgotPassword = function (user) {
    return $http.post('http://localhost:5000/api/auth/sendEmail', { email: user.email, lang: $rootScope.selectedLanguage }) // e-posta adresini nesne içinde gönder
      .then(function (response) {
        return response;
      });
  };

  auth.resetPassword = function (user) {
    return $http.post('http://localhost:5000/api/auth/resetPassword', {
      userId: user.userId,
      guid: user.guid,
      newPassword: user.sifre
    })
      .then(function (response) {
        return response;
      });
  };

  return auth;
});
