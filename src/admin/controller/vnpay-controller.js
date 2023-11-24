myApp.controller('YourController', ['$scope', '$location', 'TransactionService', function($scope, $location, TransactionService) {
    // Lấy các tham số từ URL
    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;

    console.log($scope.queryParams);

    var params = $location.search();
    TransactionService.setTransactionData(params);

}]);