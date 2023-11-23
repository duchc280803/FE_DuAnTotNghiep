myApp.controller('YourController', ['$scope', '$location', function($scope, $location) {
    // Lấy các tham số từ URL
    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;

    $scope.vnp_OrderInfo = $scope.queryParams.vnp_OrderInfo;

    console.log($scope.vnp_OrderInfo);

}]);