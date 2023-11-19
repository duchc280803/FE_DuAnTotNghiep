myApp.controller("sanPhamController", function ($http, $scope) {
  $scope.listSanPham = [];
  $scope.filterSanPham = function () {
    $http
      .get("http://localhost:8080/api/v1/san-pham/hien-thi")
      .then(function (response) {
        $scope.listSanPham = response.data;
      });
  };
  $scope.filterSanPham();

  $scope.thuongHieu;
  $scope.findByThuongHieu = function () {
    if ($scope.thuongHieu === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/thuong-hieu?value=" +
            $scope.thuongHieu
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.xuatXu;
  $scope.findByXuatXu = function () {
    if ($scope.xuatXu === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/xuat-xu?value=" + $scope.xuatXu
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.danhMuc;
  $scope.findByDanhMuc = function () {
    if ($scope.danhMuc === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/danh-muc?value=" +
            $scope.danhMuc
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.kieuDe;
  $scope.findByKieuDe = function () {
    if ($scope.kieuDe === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/kieu-de?value=" + $scope.kieuDe
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.value;
  $scope.findByNameOrCode = function () {
    if ($scope.value === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/name-code?value=" +
            $scope.value
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  $scope.status;
  $scope.findByStatus = function () {
    if ($scope.status === "") {
      $scope.filterSanPham();
    } else {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham/status?status=" + $scope.status
        )
        .then(function (response) {
          $scope.listSanPham = response.data;
        });
    }
  };

  // TODO: Lấy ra tất cả bản ghi của thương hiệu
  $scope.listThuongHieu = [];
  $scope.getListThuongHieu = function () {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  };
  $scope.getListThuongHieu();

  // TODO: Lấy ra tất cả bản ghi của danh mục
  $scope.listDanhMuc = [];
  $scope.getListDanhMuc = function () {
    $http
      .get("http://localhost:8080/api/v1/danh-muc/show")
      .then(function (response) {
        $scope.listDanhMuc = response.data;
      });
  };
  $scope.getListDanhMuc();

  // TODO: Lấy ra tất cả bản ghi của kiểu đế
  $scope.listKieuDe = [];
  $scope.getListKieuDe = function () {
    $http
      .get("http://localhost:8080/api/v1/kieu-de/show")
      .then(function (response) {
        $scope.listKieuDe = response.data;
      });
  };
  $scope.getListKieuDe();

  // TODO: Lấy ra tất cả bản ghi của sản phẩm
  $scope.listXuatXu = [];
  $scope.getListXuatXu = function () {
    $http
      .get("http://localhost:8080/api/v1/xuat-xu/show")
      .then(function (response) {
        $scope.listXuatXu = response.data;
      });
  };
  $scope.getListXuatXu();

  $scope.newProduct = {};
  $scope.createProduct = function () {
    $http
      .post("http://localhost:8080/api/v1/san-pham/create", $scope.newProduct)
      .then(function (response) {
        $scope.listXuatXu.push(response.data);
        window.location.href =
          "http://127.0.0.1:5504/src/admin/index-admin.html#/product-update/" +
          response.data.id;
      });
  };

  $scope.newThuongHieu = {};
  $scope.createThuongHieu = function () {
    $http
      .post(
        "http://localhost:8080/api/v1/thuong-hieu/create",
        $scope.newThuongHieu
      )
      .then(function (response) {
        $scope.listThuongHieu.push(response.data);
        $scope.getListThuongHieu();
      });
  };

  $scope.newKieuDe = {};
  $scope.createKieuDe = function () {
    $http
      .post("http://localhost:8080/api/v1/kieu-de/create", $scope.newKieuDe)
      .then(function (response) {
        $scope.listKieuDe.push(response.data);
        $scope.getListKieuDe();
      });
  };

  $scope.newDanhMuc = {};
  $scope.createDanhMuc = function () {
    $http
      .post("http://localhost:8080/api/v1/danh-muc/create", $scope.newDanhMuc)
      .then(function (response) {
        $scope.listDanhMuc.push(response.data);
        $scope.getListDanhMuc();
      });
  };

  $scope.newXuatXu = {};
  $scope.createXuatXu = function () {
    $http
      .post("http://localhost:8080/api/v1/xuat-xu/create", $scope.newXuatXu)
      .then(function (response) {
        $scope.listXuatXu.push(response.data);
        $scope.getListXuatXu();
      });
  };
});
