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
      "avatar":"iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABe2lDQ1BpY2MAACiRfZE9SMNAHMVfU2tFKh3sIOKQoTrZRUUcSxWLYKG0FVp1MLn0C5o0JCkujoJrwcGPxaqDi7OuDq6CIPgB4uzgpOgiJf4vKbSI8eC4H+/uPe7eAUKrxlSzLw6ommVkkgkxX1gVg68IQEA/woDETD2VXczBc3zdw8fXuxjP8j735xhSiiYDfCJxnOmGRbxBPLtp6Zz3iSOsIinE58STBl2Q+JHrsstvnMsOCzwzYuQy88QRYrHcw3IPs4qhEs8QRxVVo3wh77LCeYuzWmuwzj35C0NFbSXLdZpjSGIJKaQhQkYDVdRgIUarRoqJDO0nPPyjjj9NLplcVTByLKAOFZLjB/+D392apekpNymUAAIvtv0xDgR3gXbTtr+Pbbt9AvifgSut66+3gLlP0ptdLXoEhLeBi+uuJu8BlzvAyJMuGZIj+WkKpRLwfkbfVACGb4HBNbe3zj5OH4AcdbV8AxwcAhNlyl73ePdAb2//nun09wMD0nJ6GKbqIAAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAYACdAPe2Y4AuAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6AoQBhgklv98SwAAAcB6VFh0UmF3IHByb2ZpbGUgdHlwZSBpY2MAADiNpVPZbQQhDP2nipQAPodyWBik9N9ADIa9shtpFUujEc/Xs3mE71rD1zBRCHEYlChVUJpiJJqQNDmVFBhICSDywZkLxKjnYW4eWSPMvj7igyRBRY3UGEnYq3xo3boORmkDDaFdmX1o4cP4JkZbUbxRggWTjWZjKaiPlGQ5UFRtQ3Hj+XA8kfE9bB0LL9VxqMHWOdfojnZLeMDPesX1Dt+EDB+FyG7GqUJay4ZoCa/xN/FhUFWQ5mfcDrJdmADWCMbuAaeN6x6NgsFVWZ5vad9kFZaTmXEnLLcVsBVGyva1IauwdDWUZiITc4gFjSVDW+fTY4YkGFYBeCYQ/maQyo3BEPNsBt5sNkFvQmSFpI8HYV+6MYi3J3FnQ8HxScCmKUFEuBdkipU8k9vZhyHwPGueDHvLceKXkua/rU7Y6ixUjcUrBtJ9Mjy6F8T8kilQ7s6oH/M2LlLpZUHIOv16zH86mgGSTDbXMUehvXkQs1kXivoSOM9EdJnFwpcH3bnhLhQLtpnI5AKjWmdgzrmsDl64c32nu73sp2uP+839Et4/Cj0KMfwA9dQgLkyGDjIAAA02SURBVHja7Zp7cJzVecZ/7/m+3dVKsiXfMNjGoVzMnZAEApMGMJCGS25OAm0xhUSycTJ0IA290TJtSZi0ZZqZ0KQlaSxh2iEBCi2dcktJuIUUnELAQCkJNmAuBV+wa1naXe3ud87TP87KlmxZK8s2bqZ6Zna0oz239znveW/nwCQmMYlJTGISk/j/Ctufk3f1VhCQ+irB5QjmGosSLgQMT+rreJeyfFnnLz8By76zmdfmTWPuulJD2Di9zOiobbatuWkJYKagV2a1Zoe8U8VQo3ckpVRo44D+/+Zbvz3vl4eAJcu30lLfSjk/DZmjVGihvVqZIuwQ4HBgFmge2IGNLnXQerB1oHXAGpNer+VbB3L1wUiGryGXsmJp+/9dArp7BnjqwDbev74CGC6EgpwdJzgb7MPAe4EZQAFIRxkiA6rAeuA50GMGP0L6hcxVTaJaKFKoliZMxD4joLu3BBLBEozQIuwUsMXAecBcwE1gWA+8Afoh8D2TVkYiPJixYknb/ifgym++Tl/7AbjgGXSttKhylLArgM8Cs/fiVOuAW0Hf9q6wOg2DCMe08ut844oj9w8BS5f3UU1bSUIdF0I+OLcI7A+B9+/NeYZBwFOGrnPy93tLMuFIlHHTOI9EsrdW0t07QM0VSZRhaKosuQrsOuCwfSQ8xA2cC3amzGUmPWdQ90mOT53ySR59cHnTAdLmc4wPXgkpdUAdwl0DXAG07EPhh+NA4KsyN90p/KULvrT2wBPG1XEihmgndPWUcBZAoSjc1cCV76LwQ2gHrgpmV7iQ5ZOQ0dVbbtppj21AV08pDhQyF5LcF8CuB6bs5jAZUAJqQCBuTAFoZfe1dDNwVer9P3jn5PD0Lt31cvb4CDh5siSPmZ3eMHjjFT4Aa4HHgSdAq8G2El1dYqhT2GHAh4DTgIMZ34ZNB/7IJ+45Yc/0njq2MdwjDfh8b3logFnCbgbOH2fXV0G3GNyBtDq4dNDkd1iOkCW4kBVldjTYbwAXNYgYB3SzQ1cK60dixdLRY4Q9sgEmkaVFhF0InD2OLhlwH+iSXDZ4reB5mQ0moU5rtQyIm5cUQaJAiSTUAKuAPe3krzF0KfAwUXuare6CgPu0Twpjt5qo8N09JYIZwHywO4APNhdeK0y6VmZvmUSW5CjUK/Qs69hlpyXL+6nliqS+hjCMcIiwr4BdTHM3/hPQrwNvI7h5aeteJGD5AFmaxwW/FPhbID9GcwG3msKXZW5DEjKCJawYZUG7nK+3hAuBzKWYNEdm3wI+06RbBViWmm4Z9I7UNTRsGCZ8BIJzJCHrAD7VRHiAZ0DXydyGlqwMhN0SvquRV3iXIAxMGehVoN6ka7FA/QJHOGmjCqNu9oS8QHfPwNAhXAB8oEnzAeAGWfpzF+oMplHwrp4yJo/MdpnJdfcOYAoEDG8JjjDN0PnCdRO9Q26siQ2tzzs/o6Lk3Kn4Z4geZs8JcAQyy+Hk3wvMbNL8JybdCxm1pIV8qE4RlgcN+CRfdY2AZcWS7RrR1VvCSQQc3lIS+SlmYaGwZcBCYtAzFvqBB4T1DKhlrURfe6Hule3ccEIEeBLSUM8FS05usgsZcFelWNzcMlg5NBdq5wk7B5ghc6tN/nZDP5Kod/WUkEswRd3KLMEpTDELpwdzlwK/BkxrsrQK8GPgZgj3Y0mfI2rQQDmlLb8zAxMiQGYIaycegbEW81PQhpbBwWvALgCOHUbYh8DODeb+NPW1niwpBCRq5MlTm2mED8vst4CzxiF4vTHXTSbdHVz6jkkkvkYwN2axZEJe4PO9FQzNEXYvcOIOP28hGr2fg80gpsKHsmuD+ypoKdgq0HvAFgIfB04CpjZZigdWAbcYujNz+TdTH+uIwujtLiIJi+4aM6Ovr4/Ozs5tA+xJKDyr8RnCeuBJ0MvAPLDzgPk09zS/AvZdYAPYPOCgcazLAy8C3zd0+4b24iuzBirkswoyo6e7lRACZoaZEUIoAsHMqh0dI2OOCRMgrIUYiKxtCP52Q5gLgTm7OdxhjK9u4IH/At0O3Jmrl16q59o0u7+Edzm+flGeYhrPeZIkSCqa2RnOucXAfcBtIYwMIsdNwBe/s4n+lg7yWbWhYKwVfBuYAXY02Fnx+zZsJWZ0hfHOMQYy4AXQ7YbuLNZLa8q5dmVpKzLHJac6Fh4zFIokhBDyZnaSmS0BPkHU1BdHG7gpAd3LB6gXW6gNVsn5GjP73mJj59z3CPsYcCbxrA63Mq8C94AeBbucaMQmijLwNOgug39JVXm1bkUNpm0EElpU5u+6OpHi3YGkxMyOdc51E2uQQ5cHmaRNZkalUhkfAd09/Th5gkFSreFClijJLdjYOW9RY/AT2G7RPbAa+GdD9yAKMlsEHLebAoto0dcDPwXuMvTQptbiuunlCpm14C0hH8rctLSNEAKSkIKZJYeb2cXAYuCIHQc2MwEUCiMVcicCunpi9CVLyCwlDbVU5o7PkvyFwCLgSLYbtmGqyUOCacK6MD5ONGa7i/XA1w09iFgdXFIyeWaUygSXI/VlVlw2Mq0NQWmSJBcDVzUIH83o1oiFEpJkZP60jYCu3hImIXMESzF8G9gHM5f7NFHdDx3Wr0p0dbca/LuwQwW/R4zShkeGrwMvAacwvkJJwaRVMluFicTXG6Hyzrl83Hlwzg4B/gA4ZoxxNwNrRvshHSppIfCW4ggdEE4XbjHxBme4qxsAVgJ3GFolWCDsT4i2YMhnB+Bl4G7Q3SYOiAWNcRHQJrO5AE6Bmy4bPYApl6rD/fv5jKLyO2AN8AaAcyMVJJUZwaUkvj7TCGcr5tmnAZ3D2m0BftzY8ZeFnSTsr4CTgaH8sg48D7rT4FGgU9jnZJxDrNqOB1tBa8FI/a4TvWJrtPiSDjWzS2iSFAErJW0ZCohGEAAc5oL/qMx9lqiqw2nfCDxg6A7gbWFnKqrbsWxPgQeBp0D/aOgJYYcI+xLR+g8/DkPFzrHwb4aeFTHcHg1ZFghBmFEws6XA+5qMuQV42MxCvb4zqSnYN4jlrKF0rAS8CTwMutegJOwjxLz/KLZXYQaIBc3bDD0vOE64rxC1Z7i6vwXc3yDsIkb3PIPAD0y6Tub6nM92eg8wFNmFIAb6MzdlaroY+ALNq0I/k/Q07GwAAVJDfy7sAeI56gOtMulNzGYJWyQ4h5GFyE3AYw3Lv1bYyYoknsT2u4AAvAL8K+g+g3wjld2mAQIspq0rgVsN3ROc25j4DO1wTodHb85RmDI1d6kZ1xIrwGNhELjNzN6RNDoBwMpgycqcryUDbW1+Sqm/LXPp18AuGTZBvbGTD4L+yaBP2ELB1UTrmxvW7j8bbR4RNhusO16Hx4vRIJRzDORTHu8f1HfLNT1y5Jzc5vX/k0GtjlLHiqVtZJnH+0AulzDs7M4Hu9yMZTTPEGlo6D1jNUiDc6QxbfRt5TIyqwM/IPr4jgaLzxh6QdAOdq7gk8SHDUNb1bAD3GHoyYZb/F2iW5wm4k15S0r/EbPd5tMXJLVj5jraC5ZG8mpst6Vw05IY2SWJw3vvkiSZA3wU6AZOZXx3mluIofq6EMKouw87pMPdPSWMQOZyJCFzwZLEFILMfQC4DPgYIwOcrcSI7fZIkJ0AXEgsV7VK0bu2F9hy9EHunYVHJemC2W5GPrWpDfJKwLNRs3hB0htm5oEgqcXMDgaOJxZDjmX8120e+BtJf2xmZUk7ub9RCYBYhnbKyBr19C0tRToGK4vAvkxMbz2wAXgaeMjQW8JOBX6TaJHzAhDZ1CJb3zc/2XzGkUlh/gzXmTra2XUNotIgRI1PSjTMu33HKHgcaTHYa2Zgtuuyx5gFkcV/L3K+ShpqLljS2QiKJNhkaKqwzzUqPUc3dhRBtTXHy6ctSPyvHp7MnDfddThj/CXgPYTEwJZyuHr6Rzbe+MOe6Tr7mHSXuw9NssED+17jnfaDCLggbDONeLrB2zywo4i24hfE4/BSCHrkvOPTNZ84MXc9UX3fNUi8WPe6cc16f5uemK0T/2yAZ786dsV+t0tiX7pxLQPpTCSMxFoFUzHywiom+qa2JdW/vuhypJ6zgOuJ7nGfyw48VPe65ozff+k/7v2LBZrecgNXfu+LfPPisZVvQjXBrp4SJpDb3l0YSGzs99zzO22AIel4M7uamEXuq2OwCfF9jBsyzyulwYyOtpRbHujnknOalRT3EUII23L1EEJHCFomaZWkTHsPNUmPhxA+U69lLZII3m8rjux3hBCo12uEIPrWDyDpCElXS3pSUnkPBC9LWinpCkkHS8L7gLzw3u/2Ovf5S9EQBBLmjGq1aoVC4WCJ08w4m5hNHkw8HrvK6GpE9/gK8DPgEeAxYr6ybcfHsvT7lQAA7z3OuRE1+hBC3jk3h5iDzCc+npzD9uhSDSHfAF6TtFrSeudcfUjwobL3nuBdfy3uM0+QSBI3YvFmRvAhNbftnyK62G2IVaAo+ER3fL8TsKNA2/6qEbHZyN+9F4OlQJozim177VXfJCYxiUlMYhKTmAT/CzLLWIuoyor+AAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNC0xMC0xNlQwNjoyNDoyMSswMDowMPRdprwAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjQtMTAtMTZUMDY6MjQ6MjErMDA6MDCFAB4AAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI0LTEwLTE2VDA2OjI0OjM2KzAwOjAw2xgBzwAAABt0RVh0aWNjOmNvcHlyaWdodABQdWJsaWMgRG9tYWlutpExWwAAACJ0RVh0aWNjOmRlc2NyaXB0aW9uAEdJTVAgYnVpbHQtaW4gc1JHQkxnQRMAAAAVdEVYdGljYzptYW51ZmFjdHVyZXIAR0lNUEyekMoAAAAOdEVYdGljYzptb2RlbABzUkdCW2BJQwAAAABJRU5ErkJggg==",
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
