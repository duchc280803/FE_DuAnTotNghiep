myApp.controller("YourController", [
  "$scope",
  "$location",
  "$http",
  "$window", // Inject $window service here
  function ($scope, $location, $http, $window) { 
    
    $scope.listTransaction = [];// Lấy các tham số từ URL
    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;

    var id = $window.localStorage.getItem("idHoaDon");
    var idKhach = $window.localStorage.getItem("idKhach");
    console.log(id);
    console.log(idKhach);
    console.log($scope.amountParamValue);

    $scope.totalAmountPaid = 0;
    $scope.remainingAmount = 0;
    $scope.showTransaction = function () {
      $http
        .get("http://localhost:8080/api/v1/transaction/show?id=" + id)
        .then(function (response) {
          $scope.listTransaction = response.data;
          $scope.totalAmountPaid = 0; // Reset the total amount paid
          for (var i = 0; i < $scope.listTransaction.length; i++) {
            $scope.totalAmountPaid += $scope.listTransaction[i].soTien;
          }
        });
    };

    // TODO: thanh toán chuyển khoản
    $scope.createTransactionVnpay = function () {
      $http
        .post(
          "http://localhost:8080/api/v1/transaction/create-vnpay?idHoaDon=" +
            id +
            "&id=" +
            idKhach +
            "&vnp_Amount=" +
            $scope.amountParamValue
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
        });
    };
  },
]);
