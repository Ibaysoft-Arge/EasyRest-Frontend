app.factory('AuthInterceptor', function($q, $injector) {
    return {
      request: function(config) {
        var authService = $injector.get('authService');
        var token = authService.getToken();
        if (token) {
          config.headers.Authorization = 'Bearer ' + token;
          console.log('AuthInterceptor: Token eklendi.');
        } else {
          console.log('AuthInterceptor: Token bulunamadı.');
        }
        return config;
      },
      responseError: function(response) {
        if (response.status === 401 || response.status === 403) {
          var authService = $injector.get('authService');
          authService.logOut();
          window.location = '#!/login';
          console.log('AuthInterceptor: Unauthorized veya Forbidden hatası.');
        }
        return $q.reject(response);
      }
    };
  });
  