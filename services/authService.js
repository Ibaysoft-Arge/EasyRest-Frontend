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
      "avatar": "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9Ta0UqHewg4pChOtlFRRxLFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi7OCk6CIl/i8ptIjx4Lgf7+497t4BQqvGVLMvDqiaZWSSCTFfWBWDrwhAQD/CgMRMPZVdzMFzfN3Dx9e7GM/yPvfnGFKKJgN8InGc6YZFvEE8u2npnPeJI6wiKcTnxJMGXZD4keuyy2+cyw4LPDNi5DLzxBFisdzDcg+ziqESzxBHFVWjfCHvssJ5i7Naa7DOPfkLQ0VtJct1mmNIYgkppCFCRgNV1GAhRqtGiokM7Sc8/KOOP00umVxVMHIsoA4VkuMH/4Pf3Zql6Sk3KZQAAi+2/TEOBHeBdtO2v49tu30C+J+BK63rr7eAuU/Sm10tegSEt4GL664m7wGXO8DIky4ZkiP5aQqlEvB+Rt9UAIZvgcE1t7fOPk4fgBx1tXwDHBwCE2XKXvd490Bvb/+e6fT3AwPScnoMirrGAAAABmJLR0QAYACdAPe2Y4AuAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH6AUCBi0QbTpCjQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAACAASURBVHja7d1vbBznfeDx3zMzu+TEMdD0TvFZJxaOrPRgEgKumF6EINvLGLjDkYIE9IWGL+JS8kSHBCB4yQFt4Zcc3ps7I+iLFAIPKWqv5E36giPgDMiQ9p2njQ445jp3LwzSRaMaAmgwbY2i6NnJSiJ3515wl6b+8P+zuzPPfD9v0iYtHM7OzO/P88zvEQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwCIpLAOAoMhG1IKLmIxFZESWf+Ep+81MVnrv7qJ//3HrjFTec+bBVv3l2NLz0wQMRkfpyrZqmIp8+/3zmn0gymZBMIsm6L7mMXwsgAQCgI/hnouJpsU5/5Fnel//J6gXiPKj/9BU3/J0PW1caUxXfTzoyL5lSJAEACQCApyp5CcSST3wVztzZKOM1qDe9kfQjN/NOp51e94DOAUgAABhdycurYou85IQzH7a4It2EYM21VSQdrgRIAAAUs7IXEYlESeJbZa3utSYGi7WqnE47EksmQpcAJAAA8ljZL4iSlUCFk+9sckX6kAhcvNiWKGKjIUgAAFDpl9n5puusxpLNC18fgAQAwIAq/STxrRsE/qGbW6xVvdOnOzIRZ3x9ABIAALqqfJX4W4F+7t2Xn7v2u3/zS65MgRKDi2mb2QQgAQBwuOAfRWp1acn5we+nD7kixVS/eXZUWvfa4kuHzwxBAgBgl4AvKr3l2ddm+ztVD0NOCpquI7F0SAYwDBaXAMiZSJSsjDsEf/OlD06OJL5vZxRjoAMAlLPal3XP7vcMfRSgI3Dz7Ki0TrXFTzoMIgIJAGB48A/HWm2uBh5LBJZrVflRuslXBCABAAwK+okvtu+esfN0gA7y7XzTdQL2CoAEAChy8PdtvtfH0ZKAy04QxyQBIAEAivB8RZGo+cS35KX7Tvg7HLYDOgLID4dLAPRHFIm6sO7Z4cwdNvdBq1Mfn6rGwdcfZXQEQAcAyMfzlImI+L7NPH4MEvMEcBTMAQA0yERU1F3jJ/hj0MLJ1qZEkWKeAOgAAAMM/FT8yBv2CIAEAOh38A8CK5x8Z5Orgbypr7k2Zw6ABADQGvTFCidbBH0UIxFYrFUlTdtKmCyIx7EHADhM8I8iRfBHkYSzdx+tjo877A8AHQDgCIGfAT4wBfsD0MMcAGC/qp/gD4PcnmxtiriOxMIZFCQAAHYL/Ozuh6lJQPbZ2VE5d2+DUwfLiz0AwLOCfxQpgj9MFl764IEsn6lwJcqLPQBAL/BHYsm6Z4fn7jK6F6VzpTFV8ZOkzd4AOgBAuYJ/JkpWxh2CP8rqxsydjcT3ba4EHQCgHIFfRMl3PAI/sANnC9ABAMwP/kFgEfyBx22dLSCcLUAHADAx8DPNDzhQN4CRwnQAAGMQ/IGDWxl3JKJYpAMAUPUD5ewELNeqcjJtMzeADgBQrOAfiRI5VeVqAEcTnrv7SNY9vhKgAwAUJ/iHb7WoWABdnYDGK66cuL+hGCVceIwChtmVfxDQ5QJ0dgJmPmyJiGSxa7ExkA4AkMPAz3o/MAgvrbl2FEkmJAOFQ3UE8xD8gYG5sO7ZEV8J0AEAhlz5W+J5djjLYB9g0JgeSAcAGFbwV6vj4w7BHxiOcLK1KQExhQ4AMMjgH4kVjrXYkQzQCQAdAJSp8if4A3QCQAKAMgX/QGy+8QfymQT8pedVImIMCQCgPfhnotjpD+TXtdm7jy54TA7MM/YAoHjB3xcnnGltcCWAYqivuTZnCNABAI4X/EUUwR8oFvbp0AEAjhX4xReb4A/QCYAenAWAYgT/SFQ4RvAHit8JcCk8c4IlAOQ/+HueQwsRMOSZnjozshQImwNzgEwMOa/8IxWOvUHwBwxTv8ppgiQAwG4JgO874cwd2v6AqUkAewKGiiUA5Lb6J/gDhlsZZx8aHQDgc+/74txgtz9AJwB0AFCiyj8TRfAHytcJyChISQBQ4uAfiB2+zWx/oGzCyfSheJ6TEZNIAFDWlwCz/YHSPv+zdx+lnB0wULRcMPzKPxKL7/wBiIjUm64jsXT4RJAOAEwP/iKK4A9guxMw2dqUgNhEAgDTg7+1Oj5e4UoAeDIJyCKx2BhIAgBTeZ79g99PH3IhADxl+UxFIhKAfuLiYhiVf+9wH1r/APbEyGA6ADBJJIoJYAAOJAhYCqADAFOq//AtvvUHcIguwGKtqtKUAWF0AFDk4C9BwD0H4FDC2buP6ALQAQCVP4CSOt90nelY2DtEBwCFqvzZzQvgmG4zLZQEAAUTMOkPgKaCIghslgNIAFAUn51hxz/2Vb95drR+8+woVwJ7CSff2WQvkR5kUehfpi6iEt+3b8zcYfduCcwt1qre6bQjE098sz0v2ZNvmsN+1/1UxZeJyMKOf28lUPLJJyrkXitPwsh8ABIA5Nf7vu8Q/EvwIm5MVeITSbYaSzb/jBdyv17Sz2wDR6KSxLf8Tz9V4ezdR/w6Bt93a2/aEkUZSQAJAHJY/bPr35QXrWtLtPWSLfrLNhNRCyLqm75vkZwacG82XUfxVcCRsTaL/lRmrNEZUdmLn3QkEmOqrN7fkSVJ2z/hOiLjdjjJeRRFFU62NrOYpQA6AMiNv/S8yjXar8UM+EnSEZHStVWzTJRMixXymVlR79s2SQAJAHLwIg3fpvVfuJdo03Ukls7OKrl09253XkV6y7O95//BDmc+bHFnFOX+veyoOGYpgAQAQ3uBRnzvX4iX5c2zo3Lu3oaKhETtIEmBL3Y402K/QN7va74KODTWaaFNuu7ZXIWcvySXa1U5d2+jt6kP+1ZImSTSrjdd9kvlXSSKAUF0ADCkSold//kz9+7Lz300+o2HQRx3qI40xZlIrAvrnn3tHPtccpXc/vQVV355f4OvAkgAMODgL5Eo2v85fCl21/YJ/nrfm1Ek6sItz2aza/5cv+oS10gAMCjv++LcYI00N843LztU/ANOgH3fZgphTpLe7twK7n8SAAzg5UfrPy/Vvjcistqm4icJKP1zMLG6ySZXEgDw0ivBC++yI1T8+XkmWA7LRRKg4lWWZ0gA0LeXXRDY4eQ7DE4ZoiuNqYrPEJRcJgGy7tkhGwWHlwR827WU4rkgAUBfXnK0/odX3dDiLM5zkvhis0dmSM/KmmvznOyOOQA4eoWDwb/Qbp4dlYnVTb7jL0yFlfnMERgalmJIAKBbJEqWz1S4EIOvZuTOvUcqYpNf0ZIAFUu7ftW16s3LJAKDLlgisRgQtOu9CRzO62+1CD4Ddr7pOgG7+4sfjNg4O7TkmaUAEgBoeIGx9s+LCxqeJd93SAQG9Bwt1qoqTbnWT2AJAIcK/nEQcM8MMPiz1m+wJGnXG1MspQ1AOHv3EcsAJAA4jiCwbvPZX/8Df/OyU7/qWqz1m02JZCpJNutrLodoDYLv2yQBT92DwMGw9j+A4N+Yqgjf9ZcKw4MG50pjqvJqklDEkADgsC8p1v775w//yBsZX13dIPCTCJAI9DnJvupaPGdbWALAgV5Mie/Tpuxv8N/kpVT6aiyTSLJ6w2VfQB/FQcBngXQAcFDv+75zg93K/alGFmtVSVOCP+gEDND5putMx1L660sCgH2x9t8fc4u1qpembSV85odnJAGBWPLZGSe89MEDroh+16+6pY9/TKXCvi+ikMugN/C/+/Jz3uj6Q5VSgWDXyiyTWNoi99rZ39eq4SyHCkE/9gBgnyqE7/5180bXH0pM1Y8DStN2fbFW5UKABACDE4jFcb96nW+6joqFz/xwmG5AR6XpBkODNBc4gZR+LgAJAHYVTrYI/pqDf0Dlj6NicqD+91tQ7hhIAoBnZ8dsENWmfvPsaH3Ntaep/HG8TsDW5ECSAIocEgD0Nfiz9q/PuXsbzPQHnQCKHRIA5B9r//qq/6brMNMf/egEcCU0KfEZASQAeApr//qCP7v90bf7a821601vhCtxzPfdzJ2Nsk46JQEA+vFybkxV2O2PvnYCIulIvMqETg3KOumUBACPyTI2/+kI/pIkDPlB/5MAkazedBnopuPdV8JlABIAbIsisdLverxMjvtSThJm+2NwYunU11wO69Lw6JYtCSABwLZvJr517RwjR49c+Te9EV7EGEYXQCLJ5pgWeCyp59kLJAAoK9/9mOB1rEpsdUNFbPrDcJIAL00362tv8gwf0bXZu4/mAxIAlBSnjh2j+m9MVWj7Y/idgIh78DjvwJJ9AUUCABFh8t+xgn/zssOmP+QlCTjfdJ3v/OlXv8DVAAkADhT8y/odrBZxzKAf5EYQS+frpz5mLw9IAHCQN4ZYZf0O9tjV/5prE/yRlwZAFImVep7DMK+jWyrRKYF88gUm/x0j+DPjH3kRRaIurHv2tVm+5DmO25OtTRHXkViMX9YjAQCOXG6x4x/DtXVwl1jhZGvzvohcG+OaHNcf/+b/evn5tdcrr0/+98cKo+tXXeO6AiwB8AJh898RnGf6GnLw7MZBYNHB0+uXby10/umr/8p98t9//a2Wcd0+XmJUDySBh1T/tmupq7T+MaRnNhIl654dMrRLu//2F//hP1bP/ptTXxj/t78m/+fp//z1t1qZSZ0AEoAyi0SFY1QPh6UUwR/DCv6RkuUfV8JLd5nZ0Y9n+4WTp5zT45b88xdK8feSAJRZ4lsyw2U4VPXfvOxc5zJgCFV/ONba2pQ29gYXpQ/+60//faPyr78xar/4G7/xcOTXvlKGv5n2b4mFfPp36OAvcczGPwxWJEqWz1S4EP1l/7MXVitfGf9V5cWXfv0/3XruNToAALapOGbaHwZS8ceBWLe7m/tCERF29/dd5cS//LBy6qUXkocv/Oey/M10AMr6ksnY/X8YVxpTVGAYiJ3BHwPsAJw+/Vf2C6f+5s/uVn69LH8zHYCSVhiyIIqq4mDqa2/akiRs/EP/nsdIlNzy7HD27qPbXJKheP7fXfzb8H+c/Ksy/c0kAGXFBsCDi6KMcb/o3/0lSlbGnXD27kMuxpCS/KbrhFK+rgtt4DJWHJFY2zuKsS8TJ4AhB1V/d4IfV2M4zjcvO8GOg7z2G/TDJECYUfwn/O4Hxdo/+hP8meA37Oc6OMQpnqYWAVQ2ZXwBBePVcDKl3biPemOqIknSpv0PfUH/HYL+MJ/pNdfmDI/PsQeghC8igv8BEfyhK/hHkQrH3iD4Dzn4c3onCQBwIAR/HCvwd/fahFyK4QX9putILB0lkl3ncjyFteASliPY35WGy9o/jlf1r4xTYA3R+R3Bn6uxa5GDUr2U2Hm8f9XA2j+OIBKxLniefW2WU/qGZW6xVvXSdJNnlw4Ann5DKfnsDFXJfgj+OAKC//AT9/fSlGf3EAgGpQpsvhXO3OEY0X3wAsF+tqf3bT1TGyIi17gswwn8a2/aDOsiAcB+Tvw9HR9AV/Bf9+xw5g4V/zCD/9Y6P8H/6MUOymK/SVfYOvJ30Kf+bQeUFVHyia8Oc0xzfblWlb9+PotPJNlqLNm88DLs6+/EHprhP6Pfdi2luMfpAAA6Xyxbm/8GOiQky0TJtFjhWGvzKIczhefuPpJzW//z3Ee1anw67WRL0uEF2Yff6VWxw8nWBldjuBW/usq9TQcAdAAKWFn0qkiRcbvfA5nmFmtV72LaloiuABV/wZ9NJvj1BWvCZapgsHc2PIjg7/t2ONnaHMQ0xmuzdx+FY612HARWRrJ/+OfFF5vgP+TAv1irMsGPDgCOGXjiQKzbvMz2pPvAj97afnorH5+H1RdrVdn6TIpKaq8E7RB7MKDf3HKt+t7JtB1R8dMBwPEtiKjTH3n81nsFx36c+heJCsda7bx8Gx7O3n0knmfza++C4D/84L+4Hfyp+OkAQEtl051JzpXYIwHQsMbYq/iLcK273YBST0zLRFTi+/YNgv7QXWm4FT8RhvjQAYB2KyR6ewbDputoWWOMRMnymUKcIRDO3n2U+L5d1r0BvXY/wX/Iz97Ns6P1pusQ/OkAoF8vO993aG3u8RI64u5/U9aMe5usTH8BZ5FYedmPUfpnjvM26ABgQNUewX/vLLjEwV9ERFbGHYnMLgayLF/7MQj+BH86ABgIvv/f20F3/299Fx5Y4eQ7Rn5NUb/qWia9lNnVn6N7iz0ndACAXL2Ubp4dra+5B98Vb3DwFxERg/YEEPzzY+7zz08J/nQAQAcgJwnAHmvfZZ6dUMROwCAnLOIA91DjFVf81x9xSh8dACB/L6juzv/dg39Q2sFJRZsc2Pucb1ATFrHfs+WNyIn7GwR/OgCgA5CjqmT3zUfMfX/6Wqkkyeu1UFEkaj7xLVr8+XGlMVXx2dxHBwDI38vJ3TP49ypIrtSWPAfWKBJ1Yd1jfZ/gDzoAoAOwSxW79qb9rDbk9oz+dc++do7Pwna/fvmYD5BFYgnVfv7uDz7nKzyHSwDT7HsMbm9c7xjXak/LZyoS3dsY5klsWSZKvuvZ4cwdEjWCP+gAgA7AM15Iy7WqnHx20C/SjP7cXdebZ0fVnXsD21jHXoyc3w8lmRpZFuwBMFyWmZ/k1RtTld2C/2MVPw4tvPTBg0HdQ+zFyHeCTfCnA4AiBX9Dq6n92o+9il9Wxh0+C9NX+SmN57N3PzNUie9bHMhTzOcMxcceAJNtVb5GBf8DTRXrnsoXXkofcBNo6gSMtdoirpaCYTtBu+XZN1jbL+5zBjoAyHEHIBAj2qn1pjciE6ubu1WgjH0dXBfgsC3g7S8uOIUv/0H/3Zef80bXH6pYWC4rCfYAGCz9yCv87zu3WKvKxOrmbjvRCf4D7gIc8NTATERtBf+IU/gKwhtdfyixvmUe0AHAEBV19/9eQ0XKPKM/dx2BxVpVRCQkuBfWlcZU5dX8TnwECQDKlADUm64jsXT2ntH/Di8soI+JNkgAUHDZ1JmR8NIHud4IV296I7K0uqHUHi1+vgsHqPihHV8BmOyFzVwnePXlWlUmVtt7Bf/E9+3nH/x1lR8T0FPxcyVAB6AE8rgEUF+sVeXi3hP72DEOaEyy9xqSBToAwKAqEEnTjqS7T+yTlXHn2uxdhvcAxw3+jamK+GmH4A86AHQAhvMS2vvbcRVFoi5Q8QOagr5bkfdl12U1YCfmAKAv5hb3nx3eO9ed4A9oCP5N15GE4A86ABhSB2CvoM83/EAfnrlvuxZBfzDxMggC68XKH5z44U++9oud/8H09LQTx3HhNliyBwDaKn7v4u6bjXqf8536+BQ7+gEdz9xyreqdTKn4ByQIAmtpaemZxcvS0tKmUsqSgu21oANAB+DolUfzsiNxvOvQHolESeJbjOkFND1zy7Wq+pOU52lw8VFlWXagyl4pZXcTgMIkAXQAcMTgv/fEvu5JhG2Z4VoBuoK/nEz5jn+ACcBBg3+3Q6DiOKYDADM7AHutNVLxA/rNLdaqXppu8hnfQIP+kQ9EKtoyAF8B4EAvofqaa+8d/CMlK+MOwR/QlHA3pirvpSmz+gsS/Av5B/Ob0wF45stnuVaVH6WbzOgHBhj0m95I7/hrAv9gYuBem/tM7wCwBwCPv4B++oor91/aFD/t7B38Ayt98D9HuGKAvopf/FUm9xU0+NMBQGE7APWm68iSdPY7mOcGLX5Am7lFt+pdFGb1D5Z1mM19JncA2ANgckWxWKse5P+mvubaEhP8gYE+n03XeS8l+A+66O1X8KcDgFzJIrFkZdwJJ9OHj794vJFYVtvBPp/xybpnh+cY0wtoC/r77K1BsSp+OgDIr0gymVjdvNKYqvT+rSuNqYpMrG7uFvy7/38qHGu1Cf6AxuDfmKoIk/sGXwhR8dMBwB4PCDv6gb6YW65VPSr+gce1YW3u4ysAFCw7FiWvih1OtljfBzS60piqvOennd8m+A80Bg/rW/7p6enCxVMSgDJW+yLSq/jDt0UY1wvoUV9zbRVJR0TkuohIwjUZRNAXNveRAOAAwT8SJYlY8slL/PaArsC/Y4APV4PgTwKAXAX99JZnh7PdTX2GVvz1xlRFkuSp0an9PhUR5fSdP/3qF75+6uNH24dixVwTgj4JAHIV/CMVjr3Rllmz/9YrDbciiTxzbnp9zbVl+UwlvPTBA+4K6PLxzuCPgSYABH8SAOwS9ONArEDG7Se//zeu4l9705YoypRIdn2vt0UknUzuPZJL3B847j33xBo/Bhn0O1wGEgDsWfGLuj3W2rxt8N85t1irehfTQ01QUyLZ69wiOGrgb7gV8aXDGj/BfzcTExNZHBdrHYgEoOAPRhSJmk98K5y5sxGa/AJ+8pS0lB8f/Q76n+8puS7Cjv4Bv9vKflDPQC4yl6C4okisC+uefc3wiX1HqfiflGWiwrdbtBBxsGRTVtus7xP8D/VfWilbtu6XwtwzJAAFUqYZ/VcabsXfZVPfoa9bILbIqWo4+fNfcRfhmUGfGf0E/eMnAIWaAijCEkDBSv6tGf0yZvCL+ObZUfnivU1J9FRfmYhixDH2vOcaUxXx0w7Bf3ixM4oiNT8/z3NKBwBPBrDU85xrs+ZW/L31/d7uah3XLA7Euk3gx2733I7d/Bhe/DFpZz8dAGgP/onv2zdm7pgb/JdrVZlYbevcXU3wx57328m0zW7+HLzf+KyPDgA+D/aydSpfKVrWuiqwnZMOvdN/57DOjyddaUxV/GdMiMTg443JO/uL2AEgAchL8I8iJbdufT6utwQV2HFfyI9NOgSeGfz1bSbF8WKN6RW/Uqpw8ZQEYKhBX5R0v+E3OuhrXOMv05cQOMK9tst5EBhOfOlu7itFgl7EBIA9AEMM/uFYq236Ubxzi7WqXNSzxr/dKVn+cSW8dJe5/nii2if450mZgn9hkxYuwQCDfiCWGD6jf+7dl5/zRr/xUOJY22d8EojFp3x40vnmZSfQdJ+Bip8OAPoY/AMrnHzH+CDmja5rDf6J79s3Js1eIsHB1W+eHZXWqbb4SUfi4+8jARU/HQD0Jegnvti+e8Y2/RjaevOyozfoi31jpkXQh4hstfb/PEk680LAz2MM4XO+4nYASAD6Fvx9+0YZNvdpnJmeiSjxfdv0TZE4eOD3/aTT/WKke4uA4E8CQAJA0B9O0Ne80aoX9OWl+074Ox+2uJPKo37VtajoixfnOKXPnATA4mcj+B+84r/s6A7+SbfiJ/iXUCQqowgpVIyLokgR/J82PT1dyP10PHxHrVp7n/GZXqVpPCWtTNcNB0ko9Z4Bgf7GCtr9e1b/tkjx7mM6AEesXGT5TMX4F3RjqiIn07a2U9II/tghnEwfprc8mytB8C948HekoEtZdAAOWrkGgSWf/V/H+B39Gtf4y3TdcHTXr7q8h/L8/ssy9mnsnQAU7gyAHuYA7Hvzi5JXfTucfMf4nendNX49O/pLdN0Ak33/tZ+9+MOffO0XXIm9ap2CJi/8dk9XrQsiaj4QJZ+dMbpyrd88Oyrn7m3oWoNlah+OdB/yNQAdgGJ3AAobR9kD8GQAi0Rd8MROH5wcMb5tfe7ehq5z0bNMlPhiE/xxWHEQWHwNQJEIftzhBP0SzOgX2dp1HctqO9AwuCcTUXEg1m0CPo7pD//IGxlfXd1UwtcAOYwPKssyNu4a2gEodQJQphn99cVaVS6m7e5UtWMHf4kiFY69wYsBmpJT11GxcD/lLD6w+9/sBKCUmwCXArFvT7Y2Q9Nfqls7+jvSm6GeHjNhisQKx1rt0ODrlYjIDUYRD1z6kWeJpCQAeSqQCP77KuoAoB6rfDe1qDK0retN15EkaYvGA1RM/YZ/brFWPd+9Xn6StOtrrj23WKvyehuca7N3H3EVUDQTExOF3iBp9BJAb1Nfesuzy/CCudKYqvhav+EXy+QvIeprb9oSRbsmSNl3vEp4jsA0kN/i5tlRdefeQ65EfmIDHYADXKQCzwAwPwHotqxL8QJtuo7WU/kM3hsxt1iregfYD5FFYsnymQpDjAaDgUD5iQsc+HOg4G93g39hEwCj9gA8OWve+DX+b7tWb0zvdR3XzuBT+a40piqvJsnm9rU6yH6ISDIJfouXIEqF4H+Y12ax51c4Bv0SWy3r5TOOjJWg4l9zbV0z+nvBPzR081tvaYT3FbA/gv+hEoBCUwW/+qX5Fl33jP4FETXv+5apQb++5trHnXBYpiWkPGAJICfvVSb/HSx4Fvjzvx6ruDepqMTf+pyP4H/Ial9EXfA82+Tgr2PCISfVoYxxjUvAj53Lal8iUZKYW7XuNLdcq3o/Sjd1tPnLMKNfR8X/2H227tl8AUAHoGQspv7RAcht8A/HWu0yBP8rjanKeyfTtq7gnxg8o7++XKvqqvh7Ew5l+Qyf/w36d7x5dpSrMOT3LMH/wBYWFozoDuY6g8kiscpQidVvnh2VL97blCXp6Av6vm3qRDvdSyKcaUAHAKz9Hyb4R1FU+C8Acp0AZJkomR6vmH5Aj8jna9a6Jva97/vODWN39LsVPxF9+yF2fDaK4ZlbrFV/O00ZwTzEWMDgnwNeqIIP/8llAlCqg3k0n8pn+pp1vXnZkTjWN+TI4E8ei/sbcxjQELH2f7gEwJhOVS7mAOw4Xc784L9cq8rEajvQdipft4I1dPaB9gmHBP98mpBMYi7DUN6/BP/yJjPD+udGkaj5Eu3of+9k2o507VI3eEd//ebZUTn3ext7zeg/UoKEHCd5+jo8OPy7mNZ/eTsAQ/kKIIpEXVj3SlGJzS1uB39NG9YCy+Qd/XLunr7gHzDIMx9VYAAAE+JJREFUpxAI/kOLZUEQWFyGgyv68b9D6QCUYfLcTjp3M5u8S33u3Zef80bXH+pa++Ubfp4XHOJ5Ydf/Uap/W0SM6Zj0Pfsrw+S5x6rYNdfWdd16Ff+pj08ZeTa9N7r+UGI9D1OWdc+CIPgD6F/wNypp6kvmvX0wj4zbpn/Gt1XFfuOhjjZmr4JNb3n2tVlDd/Q3piryfnLsIUe9xDLxfesGm/qKez8s16rqT/j8bwjvfcXmv0MnAMZ8/tejfT0jy0TJq2KHk61SPNRbVay+4B+Otdoya+CL/ubZUfnib21KknS0BP9IlNzy7Bszd6j2i+xkShAaQiwj+B/11WNeJqil4k983/YNPUv+qUCmcZe66VPodH3GV4buSOmqf80DsHDQIo21/yN2AIzbq3LsDkDv2+obM3c2bpj+wtrapd7WEfxFREwO/vXlWlVOpm2J9c07kJVx59rsXeMnQ5YGwb+wRV/ZmLb7/8g3Q9kqsXrTG5GJ1U0dL6soEuubiblr1r1rpTTOOyjDPpIyYvTvUFjf+9byl3/4k6/9gktx6OrfuPX/QycAOyb2lWL9qN6YqoifdHQE/ywTlX7Xc64ZukN9brFW9S6mbdE14bAkY6HLStfxzTjMO4jW/xGDf2/3f/kSgDKcJd/znT/96he+furjR8KM/gM537zsBHHc6d5Ix79ejOktR/D/tmvpOPUSB3/PB0FgLS0tkVBT/T/GoRL73Mdag3+kZPnHlfDS3QfGvcB7xxczox+HNLdYq6qrBP9BIvgfm7H3qypzxS+itxWZiVjieXZo6jf8GndtE/RLWPmvvWnr2kCLg7/jmfV/7A6AsRsnnWdVrqU5le/k1pq1puCvVsfHnR8YuEt957XSFfyT7pcjvF5KEvwbr7iS3Cf4Dzh2RVHErv/jBX/b6L+vbC9jHRX/9vp+IlY4Y+bAo/pirSppuqmt2mdHf3mDv8avQ0DlPygLCwt2FEVGbv7rsSQISjFKdW6xVu21sLUE/3XPNjX4z20F/7aW4J+JEl9s+eSlCsG/pLqf0XIhqPyLxPTgv5Ulel4lNPh7fq0V/7pnyz/+nRNO/vxXJgZ9T2vFX47NozvvrygS68K6Z1/jMCKtzx8Om3TzuZ+W4Gjw2n+PI8//g5FrHDu/4T9+MBMrHGttypihL+nGVGUhTTu/ravif9W3w8l3jO4qPWsPSRRJJhGz7XcGfyr/wcctLgEOfLO8/lbLiAdU94x+0yvY803XmY7l2MFq52RI77SZ3ZGeK42pip8k+y6NmPJMHf3e2poPwYa/gbO/963lE0z601L92yLmd65U5otT9LVsnbvUtytYg8f1xrLaDjTOOyjDZMgrDbfiJ3KgfRHv+75T1i8c6o2pihwgSYL+d/n3vrX8AsFfW/A3fv1/KwHIRMl3PadI0+rqjVdckfub8r60dUwUyyKx0lueLSd/Ubn2u3/zS+NeyhoH95RpTkS9edk5ylHPZUwACPxDxYx/vQlAaZZRHKUky6K0XW9MVYpQ9c4t1qpy+n5HYuloCf6ZqPDtVltmDf6Vz93b0DmjXz753xXzg//RjzEuXfBvXnYkSWj5D0mWZew7wdGSnWe95BdE1Df94Z1aN/fuy8/J+vqGd1G2N1npfLlkkVjhWMvYh6Y3cU3Hddv+hv+zM0546YMHpl6zw7T497te4Vst49cOdU6FxNErf4K/Xt1v/0vz1YrzjIwgExHJkqTtn3CdQbd6601vREbX2wupZF6q/wWzXfGbXbnqG9cbiQrHzG33by+PJLqWRwKL4A8q/+KZnp524jgu1T19pOOA5datY8+7ry/WqnLxYrvfs8HLMHP+qGvVz7ofokjUhVuefW3W7G/Z642pikqSTS33Vwn2RLDGT+VvfDA0+NS/XW+kQ2YLmURRJmnarjddZ26xVn3sJfHTV9zHXxpb/3v95tnRnS+SetN1JE0J/hpcabgVTcFfokjUhfVyBH9JEk2fQEbK+OC/tcZP8M9JnPret5a/zGXoV8go2c1k2K9Xipnzuk5VK9OMfh1zDz4/A8K3jO4o3Tw7KufubTDBL1/vamb790+3/V+6ropjTPDPRMmrYoeTLaN3YJ/XtMZfluvVu2ZBrG8cdDhzx+xRv92vRggL+Qn+zPbvrziOS5lcFfamynr/3Q1ff9W1Vt27ZnEg1m3DW9YHndh38Irf3FMfe/cYLX4q/9Je4BKu/Re6A7DzxSyfvOSY+MPUm1/9gnxyZkPHWnWv4k9eFfu24RW/rmD2eMVv7p4InSc/gsq/uPVkSW+wIgX8JBHrxozpAcyt6Jhw+FgAO1eOTX1MOaTiNynwz8/Ps9Of6r/cHYAsEyXTYsm6Z92YMTyQNV1HkuNPONz+XHP5x5Xw0t0H5l4vb0Rkta3lG/6S7Im40nAromHgEfqH4E/wpwPQC2S+2Kauv+qc0d+9XpZ43rFnNOSdrtPmSlPx65sTgT6/j1nvH2gCUPrllXx3AAKD1/iXa1U5d6+ta6JaJqJWx8edH8zeNfZzvrnFWtW7mLZ1TTo0fgPpcq0a/2Pa0ZVgos8FD8EfdAB2PBCB2Ka9oHWNUc1EVOL7tukHz9Sb3ohMTG9qmXvQPfXxGh0SUPWXvfq3RZhz4XArDCiQNdyK+NLRFfzjILBuT75j/o5+f7WjJfiX4NRH7R0SEPzNDf48H7nvAERiycq4U8QpdXOLtaqXppuaXsQqikTNGz6Bbu7dl5/zRtcfqmNO7OslSWX4CkLnnAgMDLP8h5sA8Gll70bM9X+7SDKZWC3cy63emKq8p/Hb6t6M/tDwdr83uv5Q4uO35T7/CuJMxfTgr2tOBAZa9fObDcn09DRd76J0AB57oQeBFU6+k8tkQNds/qeq11vm7+ivr7m2jpnzpTkHouk6KpbObp+Kdc8zz4QWZ97eswT+IePZKGgC0HvBx4FYwZc8Kw9VXb3pjSSffLnj+0lH59no23+n6YFssVaVi2lb854Iwz/nc52FWLKVIFAiYi8tLT3kRUfwxwF/CL77L24C8MyKT0SlXv93dV9pTFV8P+nIvGTHHdKzV/Vq+vfoc8u16nsn03akqeI3/SuI+s2zo/EX721Ox9IJgsB6sfIHJ374k6/94pAvvd6GJ158A363ssEvdwkAa/9PsAr7Y3Zfau+labvedJ36cq3aj8BfX3NtP0m2KtV+BP+sO+zI9OC/uB38tcw8kBJ8Ahl/8d5m0A3+S0tLm4cN/lv3V9buzpPn5UfwL3Pwt7kKBnUAiiwSseZ9s3f09xIoX/fBPAZv6tvRIZF+tYz5/rlv71Ha/PkN/rT+d8GOyAHLussWpp8pv32ugY4HLxIVjrXaMmbw9WpMVRb8tBNFkvWzesyyrM0LsS8VP8E/169d0AEYUsCPA7Fumz5v/ubZUTn3extahvaUZU/EYq36Xpq2I+lfxX+IrgD7BA5xyXrLMlwKqn86ANg9kEWRuj32htnBf/tcg4gZ/Qd0peFW3kulE4nI9761/OWh3qdbXQGmox282mcJheBPBwC7V6/y2RknvPTBA5P/Vm3nGkRiSeJbIvedcObDlrlBf6ry537SWVkJVN6rRz4l3Ho/cjRvoRMA4hsJwKCDf34HFmkL/I2pimiaf5BlouS7nmP0xL6mNyKy2l6YkGx+vjhrxTuSAClhIkCbn+qfBABU/L1qX8fEvrIkSjtm9BtTRU5PTztxHHcMfbES8Kn8SQBwyEDW26FucsWvqdW/fd2CwDY9+MvW549iYgu5W12JIZ0BJSJC8CcBIAHAvgG/DDv6RUTON11nWtepfCXY1FdfrFUlTTcXWDPudQqetX+g38mC2qWyV0tLS5vff+1nLx5lmBIKdd+Z2qEiARi2pUDssgT/ID7+N/xl2RPRPfq5PR0EakXEXtllRn8ZX8giIhMTE1kURbslAMd9We98h6nuP0dWVlYUFX3pKn/W/UkA+uf1t1pG3lw7WtZaxvQmvtg3ZlrGTjmce/fl57zR9Yd7ncoHvajecYDqn+fwkCwuQbnpDv5bM/pbRo849kbXHwrBf6AI/tgn+DObgQ4AHYADBf3mZUfiuKNrRn96q/8nMg71eu04lY8hMEDOghib/ugADCoQFD/4u1qCv4iIRKJkZdwxOvgv16q9U/kI/kC+LCwscMofHYDByHzfKdIJfvXlWlX+Me3IknR0HGVcms8eP++QcMgLkOPgz7RKEoDBJQDdNW45ca8STv78V3n+7zq3WKt6F9O21u/3I7Fk+UzF5IFHO44wFip+IMfBi13/JABDTQZy8n37jnPkO7r/xjgQK5BxO5xMjf207XzzshNQ8QME/5LhNMCjZ05ZFkvnvLhO8JFnhUNaB683XWdhQrIo0v8w9IYe3Tb4d9wx80AI/kD+se5PApCbJEBiaYukbbnqKpHu4TYLopLEt57/zU/VtWMeclNvTFXkxIlMJuJM5iV7ci3/uohIrKni757K19vnYGrgP9+87KzGcbYSBCpYyjaFUgIACQCOnRQoyTIR8SVpL/ii6muuHa+ICkREPvFV+umnyvNEdp5+V1+sVeX557NEEvFPSBaLSDDRjUlJ919jERX1L051T+Wzw5k7j0z+fc43XWc1lmwlCJgUB6DsRSzKaPsb/nXPvmbwUbwiIi+tubaISJGO4gXwtOnpaac7Wprd/xowB6DEwT8ca7VNDv5zy7VqneAPFN73X/vZi1wF/VgCKFPQ7361EJoa8J+Y0e/96C/bIiLz/PxAoe0cBX1/7I22SET3mg4ADh78Ayt9cHLE5L9z54z+lZUVklvAANPT0yPdf3UmJiZo+9MBwL4BPxLV29FvasVfb7ziitzfXPCls7ISqGkJ7KVsaZOKHzDHl770pUxk61hproZetFEMDP5lGN5Tb3ojIqvthViyeb7fB8ys/iemR5ZWlh6y+Y8EAAet/oPxionBv772pi1bLwBRIhIEgcWnfIDhSUA3+N8fe6N9vTtvBSQAeFYCkIkK324ZN8P+iSOMu0OXmNUPlCH4U/n3B3sAkFs7DubJrj+R55C8AuWp/Nn13x98BWAaQx6TetN1esGfHxUoSdCfeHzHfxRFGW1/wgUOKBNRq+PjlR/8frH2AJxvus50LIfZzKdYAgCMqPRHRESWlpYePln5E/xJAHD4JMASz7OHdULhYcwt1qofnU473RP5DlXtZ1lGdwAoePDfGfjjON651s/zTQIAHV2BxPftG91T/oYV6L003dTc0ld8CQAUNvg/Ndinu9mP4E8CAN1JgARiiYzbIv/PDid//qtB/bPrjanKQpJ0IpF+tOxZCgCKGHyUsp79qgIJAAabHESRkiSx5NNPVW/poN54xQ1nPmxtB/LmV7/wZOJQb0xV4hMnsiCOO90bahgPsIqiSM3PzzMQCMi58O0Hcv2qaxHwSQCQpySgd09EIvGKqGCX/9tYRIKJ7oMbSTbEwE8nAChW1W9LfzqBIAFA2e9nOgFA/nQ3+PFckgAA/b2n2RgI5C74d4R2PwkAMKh7myUBYLgWFhbsKIp4DnOKSYAwVTY9Pc2oa2C4wZ+qnw4AQCcAKM1Dt/WJH8GfDgAw3E5Ad+cxAII/6ACgrAlvlmXsRAYI/KADALoBAI6ru9+G4E8HAMj/fc++AEBb5U8coQMAFKoTwL0PHD/401GjAwDQDQBKFvh5bugAAIXvBlDFAIcL/qz3kwAARugopdTCwgKJAPAMX/nKV1yllNVd72esLwkAYJYoijKSAOBx33/tZy/ev39/g6BPAgCYLIuiqKOUskgEgK1xvn/8Z+f+VkSYn2EgNgECuzwbnCqIsgf/7ix/Kn8SAKC8zwlfCqAMvv/az17sVvwoAZYAgP0xNwBlCf5/z5UgAQDwdBKglFLW91/72YtcDphienp6ZMdaP52uEmEJADhC4syhQjAFa/0kAACO8PywNwCFvXmZ4U8lwyUAjoy9AShq8Oe+BQkAoCEJUEwSRN4tLCzYO6b50e6H8MICNEmSRJRS/8X3/XmuBvIW/FnnB4DBUEEQ2BkwJFEUWcI+L9ABAAZvdXWVjgCGYnp62llcXKTiB4A8iKLIoi4FFT/oAAAlwx4BUPEjT8gWgSF2BFZWVpylpaWHXA0cFhv7cFx8BggMLwHIJiYmOG0QBH/QAQDK/jxyBDF2vTm2hvcQ8EECAJAEgOAPkAAAxgqCwCYhIOADurEHAMi5OI4709PTDlfCfNPT0w7BHwCwa4EYBIH9vW8t/wu+fuf7feDILxIuAVDYZ1dlWdbmUhS32o/juHecNBU/Bo4lAKCYMhHpqM9ZSilrYWHBZrkgf4FeKbV9El9PHMft7u9I8AcA6OkMCIcRDV0QBHa3yOr9JkDuXhYASpIYsGTQ30o/juOMqh5FwRIAUA6ZiGRKKYslAv2BXylld9fzCf4AgOJ1CVg22LOdT8cUAGBuEiAiVtkTgZ2fWPKZHgAABnQOCOgAAPS5c5CXYUXsyAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHNP/B8u29g9l8DPKAAAAAElFTkSuQmCC",
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
