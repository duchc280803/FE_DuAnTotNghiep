var idgh = localStorage.getItem("idgiohang");
myAppCustom.controller(
  "sanPhamShopController",
  function ($http, $scope, $window) {
    var token = $window.localStorage.getItem("token-customer");
    console.log(token);
    $scope.listSanPhamShop = [];
    $scope.listThuongHieu = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];

    $scope.currentPage = 1;
    $scope.pageSize = 12; // Số sản phẩm trên mỗi trang

    $scope.changePage = function (page) {
      if (page === 'prev') {
        $scope.currentPage--;
        if ($scope.currentPage === 0) {
          $scope.currentPage = 1;
        }
      } else if (page === 'next') {
        $scope.currentPage++;
        if ($scope.currentPage > $scope.totalPages) {
          $scope.currentPage = $scope.totalPages;
        }
      } else if (typeof page === 'number') {
        $scope.currentPage = page;
      }
      listSanPhamGiamGia();
    };

    $scope.getPages = function () {
      let pages = [];
      for (let i = 1; i <= $scope.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };

    function listSanPhamGiamGia() {
      $http
        .get("http://localhost:8080/api/v1/san-pham-giam-gia/show", {
          params: { pageNumber: $scope.currentPage - 1, pageSize: $scope.pageSize }
        })
        .then(function (response) {
          $scope.listSanPhamShop = response.data;
          $scope.totalPages = Math.ceil($scope.listSanPhamShop.length / $scope.pageSize + 1);
          console.log(response.headers('X-Total-Count'));
        });
    }

    // Initial load
    listSanPhamGiamGia();




    $scope.selectedCategoryId = null;

    $scope.searchProductDanhMuc = function (id) {
      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.listSanPhamGiamGia();
      } else {
        $scope.selectedCategoryId = id; // Đặt giá trị cho selectedCategoryId
        $http
          .get("http://localhost:8080/api/v1/san-pham-giam-gia/detailList", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };

    $scope.selectedBrandId = null;

    $scope.searchProductThuongHieu = function (id) {
      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.listSanPhamGiamGia();
      } else {
        $scope.selectedBrandId = id; // Đặt giá trị cho selectedBrandId
        $http
          .get("http://localhost:8080/api/v1/san-pham-giam-gia/detailList", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };


    $scope.selectedKieuDeId = null;
    $scope.selectedXuatXuId = null;

    $scope.searchProductKieuDe = function (id) {
      if (!id) {
        $scope.listSanPhamGiamGia();
      } else {
        $scope.selectedKieuDeId = id;
        $http
          .get("http://localhost:8080/api/v1/san-pham-giam-gia/detailList", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };

    $scope.searchProductXuatXu = function (id) {
      if (!id) {
        $scope.listSanPhamGiamGia();
      } else {
        $scope.selectedXuatXuId = id;
        $http
          .get("http://localhost:8080/api/v1/san-pham-giam-gia/detailList", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };
    $scope.searchProductKey = function () {
      var key = $scope.tenSanPham;

      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.listSanPhamGiamGia();
      } else {
        $http
          .get(
            "http://localhost:8080/api/v1/san-pham-giam-gia/searchString_bykey",
            {
              params: { key: key },
            }
          )
          .then(function (response) {
            $scope.listSanPhamShop = response.data;
          });
      }
    };

    $scope.searchProductByPriceRange = function () {
      var selectedRange = $scope.selectedPriceRange;
      var key1, key2;

      // Tách giá trị của option thành khoảng giá key1 và key2
      if (selectedRange) {
        var rangeValues = selectedRange.split("-");
        key1 = rangeValues[0];
        key2 = rangeValues.length > 1 ? rangeValues[1] : null;
      }

      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/searchMoneybykey",
          {
            params: { key1: key1, key2: key2 },
          }
        )
        .then(function (response) {
          $scope.listSanPhamShop = response.data;
        });
    };


    $scope.getlistCategory = function () {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getlistCategory();

    $scope.listKieuDe = [];
    $scope.getListKieuDe = function () {
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.getListKieuDe();

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

    $scope.listXuatXu = [];
    $scope.getListXuatXu = function () {
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.getListXuatXu();

    function loadCart() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=" +
        idgh;

      $http.get(apiURL).then(function (response) {
        $scope.products = response.data; // Dữ liệu sản phẩm từ API
        $window.localStorage.setItem(
          "listCart",
          $scope.products.map((item) => item.id)
        );
      });
    }
    loadCart();
    //delete product
    $scope.deleteProduct = function (productId) {
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=" +
        productId;

      $http({
        url: apiURL,
        method: "DELETE",
        transformResponse: [
          function () {
            Swal.fire({
              title: "Success",
              text: "Xóa thành công",
              icon: "success",
              position: "bottom-start", // Đặt vị trí ở góc trái
              toast: true, // Hiển thị thông báo nhỏ
              showConfirmButton: false, // Ẩn nút xác nhận
              timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            loadCart();
            loadToTals();
            loadNameAndPrice();
          },
        ],
      });
    };
    function loadToTals() {
      // Gọi API và cập nhật giá trị totalAmount

      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" +
          idgh
        )
        .then(function (response) {
          // Lấy giá trị tổng tiền từ phản hồi API
          $scope.totalAmount = response.data[0].tongSoTien;
          $window.localStorage.setItem("totalAmount", $scope.totalAmount);
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }
    loadToTals();

    function loadQuanTiTy() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
        idgh;

      $http.get(apiURL).then(function (response) {
        $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API
      });
    }

    loadQuanTiTy();
  }
);
