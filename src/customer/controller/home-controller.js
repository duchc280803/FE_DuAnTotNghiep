myAppCustom.controller("homeController", function ($http, $scope) {
  $scope.listNewProduct = [];

  function listTop8NewProduct() {
    var url = `http://localhost:8080/api/public/home`;

    $http.get(url).then(function (response) {
      $scope.listNewProduct = response.data;
      console.log("Dữ liệu trả về: ", response.data);
      // Update currentPageNumber based on the response
    });
  }
  listTop8NewProduct();
  function listTopProduct() {
    var url = `http://localhost:8080/api/public/list`;

    $http.get(url).then(function (response) {
      $scope.listProduct = response.data;
      console.log("Dữ liệu trả về: ", response.data);
      // Update currentPageNumber based on the response
    });
  }
  listTopProduct();
  $scope.showAllProducts = function () {
    // Call the function to get the entire list
    listTop8NewProduct();
  };
  $scope.showAllProductSelt = function () {
    // Call the function to get the entire list
    listTopProduct();
  };
  $scope.searchProductThuongHieu = function (id) {
    if (!id) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      listTop8NewProduct();
    } else {
      $http
        .get("http://localhost:8080/api/public/detailList", {
          params: { id: id },
        })
        .then(function (response) {
          $scope.listNewProduct = response.data;
        });
    }
  };
  $scope.searchProductThuongHieuSelt = function (id) {
    if (!id) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      listTopProduct();
    } else {
      $http
        .get("http://localhost:8080/api/public/detailListSelt", {
          params: { id: id },
        })
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    }
  };
  $scope.listThuongHieu = [];
  $scope.getListThuongHieu = function () {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  };
  $scope.getListThuongHieu();
});
