myApp.controller("sanPhamGiamGiaController", function ($http, $scope) {
  $scope.listSpGiamGia = [];
  $scope.listThuongHieu = [];
  $scope.listDanhMuc = [];
  $scope.listSize = []

  $scope.listSanPhamGiamGia = function () {
    $http
      .get("http://localhost:8080/api/v1/san-pham-giam-gia/show")
      .then(function (response) {
        $scope.listSpGiamGia = response.data;
      });
  };
  $scope.listSanPhamGiamGia();

  $scope.getlistThuongHieu = function () {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/show")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  };
  $scope.getlistThuongHieu();

  $scope.getlistCategory = function () {
    $http
      .get("http://localhost:8080/api/v1/danh-muc/show")
      .then(function (response) {
        $scope.listDanhMuc = response.data;
      });
  };
  $scope.getlistCategory();

  $scope.getlistSize= function () {
    $http
      .get("http://localhost:8080/api/v1/size/show")
      .then(function (response) {
        $scope.listSize = response.data;
      });
  };
  $scope.getlistSize();
});
