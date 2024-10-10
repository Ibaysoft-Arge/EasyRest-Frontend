// services/authService.js

app.factory('authService', function ($http, $window) {
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
        auth.saveToken(response.data.token);
        return response;
      });
  };



  auth.register = function (user) {
    // Kullanıcıdan alınan veriler (user nesnesi)
    const newUser = {
      kullaniciAdi: user.kullaniciAdi,
      sifre: user.sifre,
      email: user.email,
      telefon: user.telefon,

      // Manuel olarak doldurulan alanlar
      faturaBilgileri: {
        faturaTipi: "Bireysel",  // veya Ticari, isteğe bağlı
        faturaIl: "İstanbul",    // Sabit veya dinamik
        faturaIlce: "Kadıköy",   // Sabit veya dinamik
        vergiNumarasi: "1234567890", // Eğer bireysel ise boş bırakabilirsin
        adres: "Örnek Mah. No:12",   // Sabit veya dinamik
        postaKodu: "34000"       // Sabit veya dinamik
      },
      olusturulmaTarihi: new Date().toISOString(), // Şu anki tarihi otomatik ekle
      kvkk: true, // KVKK onay durumu (kullanıcıdan almak istersen, user'dan da çekebilirsin)
      paketBilgisi: "66ffe0340b31c9bb76a1ef9c" // Sabit bir ObjectId veya dinamik olarak oluşturulabilir
    };

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
    return $http.post('http://localhost:5000/api/auth/sendEmail', { email: user.email }) // e-posta adresini nesne içinde gönder
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
