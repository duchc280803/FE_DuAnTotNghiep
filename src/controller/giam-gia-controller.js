myApp.controller("GiamGiaController", function ($http, $scope) {
  $scope.listGiamGia = [];

  function fetchGiamGiaList() {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/show")
      .then(function (response) {
        $scope.listGiamGia = response.data;
      });
  }

  // Thêm hàm tìm kiếm
  $scope.searchGiamGia = function () {
    var key1 = $scope.startDate;
    var key2 = $scope.endDate;

    if (!key1 && !key2) {
      // Nếu cả hai giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchDatebykey", {
          params: { key1: key1, key2: key2 },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();

  $scope.searchKey = function () {
    var key = $scope.tenGiamGia;

    if (!key) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
          params: { key: key },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();

  $scope.searchStatus = function () {
    var key = $scope.status; // Lấy giá trị từ dropdown

    if (key === "") {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchStatus_bykey", {
          params: { key: key },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();
});