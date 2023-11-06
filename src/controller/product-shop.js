myApp.controller(
  "sanPhamShopController",
  function ($http, $scope) {
    $scope.listSanPhamShop = [];
    $scope.listThuongHieu = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];

    $scope.listSanPhamGiamGia = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham-giam-gia/show")
        .then(function (response) {
          $scope.listSanPhamShop = response.data;
        });
    };
    $scope.listSanPhamGiamGia();

    $scope.getlistCategory = function () {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getlistCategory();

    $scope.getlistSize = function () {
      $http
        .get("http://localhost:8080/api/v1/size/show")
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getlistSize();

  }
);
