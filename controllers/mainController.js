

app.controller('mainController', function($scope, $route) {
    // Route değiştiğinde, isLoginPage bilgisini günceller
    $scope.$on('$routeChangeSuccess', function() {
        $scope.isLoginPage = $route.current.$$route.isLoginPage;
    });
});
