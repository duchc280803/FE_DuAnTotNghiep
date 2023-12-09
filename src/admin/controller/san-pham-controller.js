myApp.controller("sanPhamController", function ($http, $scope, $window) {
  $scope.listSanPham = [];
  $scope.pageNumber = 0;
  $scope.pageSize = 20;
  $scope.filterSanPham = function () {
    $http
      .get(
        "http://localhost:8080/api/v1/san-pham/hien-thi?pageNumber=" +
          $scope.pageNumber +
          "&pageSize=" +
          $scope.pageSize
      )
      .then(function (response) {
        $scope.listSanPham = response.data;
        if ($scope.listSanPham.length < $scope.pageSize) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      });
  };

  $scope.filterSanPham();

  $scope.updatePage = function (pageNumber) {
    $scope.pageNumber = pageNumber;
    $scope.filterSanPham();
  };

  // TODO: Quay lại trang
  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      $scope.filterSanPham();
    }
  };

  // TODO: tiến đến trang khác
  $scope.nextPage = function () {
    $scope.pageNumber++;
    $scope.filterSanPham();
  };

  $scope.formatMa = function (username) {
    // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
    if (username && username.includes(",")) {
      return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
    }
    return username;
  };
  function fetchHistortyList() {
    $http
      .get("http://localhost:8080/api/v1/audilog/sanpham")
      .then(function (response) {
        $scope.listHistory = response.data;
      });
  }

  fetchHistortyList();
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
  $scope.searchVouchers = function () {
    // Make sure both startDate and endDate are provided
    if (!$scope.startDate || !$scope.endDate) {
      // Handle error or provide user feedback
      return;
    }

    var formattedStartDate = new Date($scope.startDate)
      .toISOString()
      .split("T")[0];
    var formattedEndDate = new Date($scope.endDate).toISOString().split("T")[0];

    var searchUrl =
      "http://localhost:8080/api/v1/audilog/sanphamseach?startDate=" +
      encodeURIComponent(formattedStartDate) +
      "&endDate=" +
      encodeURIComponent(formattedEndDate);

    $http.get(searchUrl).then(function (response) {
      $scope.listHistory = response.data;
    });
  };
  $scope.searchVouchersByDay = function () {
    var formattedStartDate = new Date($scope.searchDate)
      .toISOString()
      .split("T")[0];

    var searchUrl =
      "http://localhost:8080/api/v1/audilog/auditlogsanphambydate?searchDate=" +
      encodeURIComponent(formattedStartDate);
    $http.get(searchUrl).then(function (response) {
      $scope.listHistory = response.data;
    });
  };

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
  var token = $window.localStorage.getItem("token");

  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };
  setTimeout(() => {
    $scope.createProduct = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        $http
          .post(
            "http://localhost:8080/api/v1/san-pham/create",
            $scope.newProduct,
            config
          )
          .then(function (response) {
            $scope.listXuatXu.push(response.data);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            });
            window.location.href =
              "http://127.0.0.1:5505/src/admin/index-admin.html#/product-detail/create/" +
              response.data.id;
          })
          .catch(function (error) {
            $scope.errorMaSanPham = error.data.maSanPham;
            $scope.errorProductName = error.data.productName;
            $scope.errorDescribe = error.data.describe;
            $scope.errorPrice = error.data.price;
            $scope.errorBaoHanh = error.data.baoHang;
            $scope.errorKieuDe = error.data.idKieuDe;
            $scope.errorXuatXu = error.data.idXuatXu;
            $scope.errorThuognHieu = error.data.idBrand;
            $scope.errorDanhMuc = error.data.idCategory;
          });
      });
    };
  });

  $scope.newThuongHieu = {};
  setTimeout(() => {
    $scope.createThuongHieu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        $http
          .post(
            "http://localhost:8080/api/v1/thuong-hieu/create",
            $scope.newThuongHieu
          )
          .then(function (response) {
            $scope.listThuongHieu.push(response.data);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListThuongHieu();
            });
          });
      });
    };
  });

  $scope.newKieuDe = {};
  setTimeout(() => {
    $scope.createKieuDe = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        $http
          .post("http://localhost:8080/api/v1/kieu-de/create", $scope.newKieuDe)
          .then(function (response) {
            $scope.listKieuDe.push(response.data);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListKieuDe();
            });
          });
      });
    };
  });

  $scope.newDanhMuc = {};
  setTimeout(() => {
    $scope.createDanhMuc = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        $http
          .post(
            "http://localhost:8080/api/v1/danh-muc/create",
            $scope.newDanhMuc
          )
          .then(function (response) {
            $scope.listDanhMuc.push(response.data);
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Thêm thành công",
              showConfirmButton: false,
              timer: 1500,
              customClass: {
                popup: "small-popup", // Add a class to the message
              },
            }).then(() => {
              $scope.getListDanhMuc();
            });
          });
      });
    };
  });

  $scope.newXuatXu = {};
  setTimeout(() => {
    $scope.createXuatXu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          $http
            .post(
              "http://localhost:8080/api/v1/xuat-xu/create",
              $scope.newXuatXu
            )
            .then(function (response) {
              $scope.listXuatXu.push(response.data);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thêm thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                $scope.getListXuatXu();
              });
            });
        }
      });
    };
  });
});
