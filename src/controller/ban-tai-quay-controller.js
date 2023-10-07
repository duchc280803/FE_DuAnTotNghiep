myApp.controller(
  "BanTaiQuayController",
  function ($scope, $http, $window, $routeParams) {
    //TODO: Get all hoa đơn tại quầy
    $scope.listHoaDonTaiQuay = [];

    $scope.getListHoaDonTaiQuay = function () {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/show")
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
          console.log(response.data);
        });
    };

    $scope.getListHoaDonTaiQuay();

    //TODO: Tạo hóa đơn
    $scope.createHoaDon = function () {
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      console.log(token);
      var api = "http://localhost:8080/api/v1/hoa-don/create";
      $http.post(api, {}, config).then(function (response) {
        $scope.listHoaDonTaiQuay.push(response.data);
        $scope.getListHoaDonTaiQuay();
      });
    };

    // TODO: Get ALL sản phẩm tại quầy
    $scope.listSanPhamTaiQuay = [];

    $scope.getListSanPhamTaiQuay = function () {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp/hien-thi")
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          console.log(response.data);
        });
    };

    $scope.getListSanPhamTaiQuay();

    // TODO: Detail sản phẩm tại quầy
    $scope.selectedProduct = {};

    $scope.showProductDetail = function (id) {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp/san-pham/" + id)
        .then(function (response) {
          console.log(id);
          $scope.selectedProduct = response.data;
          console.log(response.data);
        });
    };
  }
);
