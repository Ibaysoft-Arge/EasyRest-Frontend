// services/authService.js

app.factory('authService', function($http, $window) {
  var auth = {};

  // Kullanıcı token'ını kaydetme
  auth.saveToken = function(token) {
    $window.localStorage['token'] = token;
    console.log('AuthService: Token kaydedildi.');
  };

  // Kullanıcı token'ını alma
  auth.getToken = function() {
    var token = $window.localStorage['token'];
    console.log('AuthService: Token alındı:', token);
    return token;
  };

  // Kullanıcının giriş yapıp yapmadığını kontrol etme
  auth.isLoggedIn = function() {
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
  auth.login = function(user) {
    return $http.post('http://172.16.127.64:5000/api/auth/login', user)
      .then(function(response) {
        auth.saveToken(response.data.token);
        return response;
      });
  };

  // Kullanıcı kayıt olma (API isteği)
  auth.register = function(user) {
    return $http.post('http://172.16.127.64:5000/api/users', user)
      .then(function(response) {
        auth.saveToken(response.data.token);
        return response;
      });
  };

  // Kullanıcı çıkış yapma
  auth.logOut = function() {
    $window.localStorage.removeItem('token');
    console.log('AuthService: Token kaldırıldı.');
  };

  // Kullanıcı bilgilerini alma (sunucudan)
  auth.getUserFromServer = function() {
    return $http.get('http://172.16.127.64:5000/api/auth/user')
      .then(function(response) {
        console.log('AuthService: Kullanıcı bilgileri alındı.');
        return response;
      })
      .catch(function(error) {
        console.error('AuthService: Kullanıcı bilgileri alınamadı:', error);
        throw error;
      });
  };

  return auth;
});
