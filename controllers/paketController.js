
app.controller('paketController', function($scope, paketService, $translate,$rootScope,$http) {
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
   
        $scope.changeLanguage = function (langKey) {
            console.log("changeLanguage="+langKey);
            $translate.use(langKey);
            localStorage.setItem('selectedLanguage', langKey);
            $rootScope.selectedLanguage = langKey;
            
        };

    
            $scope.emailData = {
                fullname: '',
                email: '',
                message: ''
            };
        
            $scope.sendEmail = function() {
                console.log($scope.emailData.fullname);// Kullanıcıdan alınan bilgileri al
                var fullname = encodeURIComponent($scope.emailData.fullname);
                var email = encodeURIComponent($scope.emailData.email);
                var message = encodeURIComponent($scope.emailData.message);
        
                // Mailto URL'sini oluştur
                var mailtoLink = `mailto:semihaysu17@gmail.com?subject=Inquiry from ${fullname}&body=>\n\n${message}`;
        
                // Kullanıcının varsayılan e-posta istemcisini aç
                window.location.href = mailtoLink;
              
            };
       
        
        
});
