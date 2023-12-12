myApp.controller(
  "sanPhamChiTietController",
  function ($http, $scope, $routeParams) {
    var id = $routeParams.id;

    $scope.idUpdate = id;

    $scope.listSanPhamChiTiet = [];
    $scope.pageNumber = 0;
    $scope.pageSize = 20;
    $scope.getlistSanPhamChiTiet = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-chi-tiet/show?id=" +
            id +
            "&pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listSanPhamChiTiet = response.data;
          if ($scope.listSanPhamChiTiet.length < $scope.pageSize) {
            $scope.showNextButton = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButton = true; // Hiển thị nút "Next"
          }
        });
    };

    $scope.getlistSanPhamChiTiet();

    $scope.previousPage = function () {
      if ($scope.pageNumber > -1) {
        $scope.pageNumber--;
        $scope.getlistSanPhamChiTiet();
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.getlistSanPhamChiTiet();
    };

    $scope.lamMoiChiTietSanPham = function () {
      $scope.trangThai = "";
      $scope.locSize = "";
      $scope.locMaterial = "";
      $scope.locMauSac = "";
      $scope.getlistSanPhamChiTiet();
    };

    // TODO: Lấy ra tất cả bản ghi của chất liệu
    $scope.listChatLieu = [];
    $scope.getListChatLieu = function () {
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show")
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    };
    $scope.getListChatLieu();

    // TODO: Lấy ra tất cả bản ghi của size
    $scope.listSize = [];
    $scope.getListSize = function () {
      $http
        .get("http://localhost:8080/api/v1/size/show")
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getListSize();

    // TODO: Lấy ra tất cả bản ghi của màu sắc
    $scope.listMauSac = [];
    $scope.getListMauSac = function () {
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show")
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    };
    $scope.getListMauSac();

    // TODO:  Lọc sản phẩm theo size
    $scope.trangThai;
    $scope.filterStatus = function () {
      if ($scope.trangThai === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-status?id=" +
              id +
              "&trangThai=" +
              $scope.trangThai
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo size
    $scope.locSize;
    $scope.filterSize = function () {
      if ($scope.locSize === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-size?id=" +
              id +
              "&size=" +
              $scope.locSize
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo chất liệu
    $scope.locMaterial = "";
    $scope.filterMaterial = function () {
      if ($scope.locMaterial === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-key?id=" +
              id +
              "&key=" +
              $scope.locMaterial
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo màu sắc
    $scope.locMauSac = "";
    $scope.filterColor = function () {
      if ($scope.locMauSac === "") {
        $scope.getlistSanPhamChiTiet();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-chi-tiet/show-by-key?id=" +
              id +
              "&key=" +
              $scope.locMauSac
          )
          .then(function (response) {
            $scope.listSanPhamChiTiet = response.data;
          });
      }
    };
  }
);
