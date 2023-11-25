myApp.controller(
  "giamgiaChiTietController",
  function ($http, $scope, $routeParams, $location) {
    function getgiamgiachitiet(id) {
      const apiUrl =
        "http://localhost:8080/api/v1/giam-gia/detailList?id=" + id;
      $http.get(apiUrl).then(function (response) {
        $scope.giamgiachitiet = response.data[0];

        if ($scope.giamgiachitiet.productName) {
          $scope.giamgiachitiet.tenSanPhamChecked = true;
        } else {
          $scope.giamgiachitiet.tenSanPhamChecked = false;
        }
      });
    }

    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    getgiamgiachitiet(id);

    function fetchGiamGiaList() {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/show")
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }

    function fetchProduct() {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/product")
        .then(function (response) {
          $scope.listProductGiamGia = response.data;
        });
    }

    fetchProduct();

    function fetchlistThuongHieu() {
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    }
    fetchlistThuongHieu();
    function fetchlistProduct() {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/showproduct")
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    }
    fetchlistProduct();

    $scope.isIdEqual = function (id1, id2) {
      return id1 === id2;
    };
    function fetchlistChatLieu() {
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show")
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    }
    fetchlistChatLieu();
    function fetchlistDanhMuc() {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    }
    fetchlistDanhMuc();
    function fetchlistMauSac() {
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show")
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    }
    fetchlistMauSac();
    function fetchlistKieuDe() {
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    }
    fetchlistKieuDe();
    function fetchlistSize() {
      $http
        .get("http://localhost:8080/api/v1/size/show")
        .then(function (response) {
          $scope.listSize = response.data;
        });
    }
    fetchlistSize();
    function fetchlistXuatXu() {
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    }
    fetchlistXuatXu();

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
      var key = $scope.key;
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
    $scope.searchbyMa = function () {
      var key2 = $scope.key2;
      if (!key2) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchGiamGiaList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
            params: { key: key2 },
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    fetchGiamGiaList();

    ///
    $scope.searchProductKey = function () {
      var key = $scope.tenSanPham;

      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchProduct_bykey", {
            params: { key: key },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };

    ///
    $scope.searchProductList = function () {
      var id = $scope.Size;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductDanhMuc = function () {
      var id = $scope.DanhMuc;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductThuongHieu = function () {
      var id = $scope.ThuongHieu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductChatLieu = function () {
      var id = $scope.ChatLieu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductMauSac = function () {
      var id = $scope.MauSac;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductKieuDe = function () {
      var id = $scope.KieuDe;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductXuatXu = function () {
      var id = $scope.XuatXu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };

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
    // Thêm hàm làm mới
    $scope.refresh = function () {
      // Gọi lại danh sách đầy đủ khi làm mới
      fetchGiamGiaList();
      // Xóa giá trị trong các ô input

      $scope.tenGiamGia = "";
      $scope.startDate = null;
      $scope.endDate = null;
      $scope.status = "";
    };
    $scope.tuDongTaoMa = false;
    $scope.maGiamGia = "";
    $scope.tenGiamGia = "";
    $scope.mucGiam = "";
    $scope.hinhThucGiam = "";
    $scope.trangThai = 1;
    $scope.ngayBatDau = "";
    $scope.ngayKetThuc = "";
    $scope.sanPhamDaChon = [];
    $scope.onTuDongTaoMaChange = function () {
      if ($scope.tuDongTaoMa) {
        // If the checkbox is checked, automatically generate the discount code
        $scope.maGiamGia = "GG_" + new Date().getTime();
        // You might want to update other related properties as well
      } else {
        // If the checkbox is unchecked, clear the discount code or handle it as needed
        $scope.maGiamGia = "";
        // You might want to update other related properties as well
      }
    };

    $scope.selectedIds = [];
    fetchGiamGiaList();

    $scope.selectAllProducts = false;

    $scope.toggleAllProducts = function () {
      // Set or unset all product IDs based on the state of selectAllProducts
      if ($scope.selectAllProducts) {
        $scope.sanPhamDaChon = $scope.listProduct.map((product) => product.id);
      } else {
        $scope.sanPhamDaChon = [];
      }
    };

    $scope.chonSanPham = function (productId) {
      var index = $scope.sanPhamDaChon.indexOf(productId);

      if (index === -1) {
        $scope.sanPhamDaChon.push(productId);
      } else {
        $scope.sanPhamDaChon.splice(index, 1);
      }

      // Update selectAllProducts based on the individual product selection
      $scope.selectAllProducts =
        $scope.sanPhamDaChon.length === $scope.listProduct.length;
    };
    $scope.updateGiamGia = function (id) {
      var ngayBatDau = new Date($scope.giamgiachitiet.ngayBatDau);
      var ngayKetThuc = new Date($scope.giamgiachitiet.ngayKetThuc);
      if (ngayBatDau >= ngayKetThuc) {
        alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        return;
      }

      if (
        $scope.giamgiachitiet.hinhThucGiam == 2 &&
        ($scope.giamgiachitiet.mucGiam <= 0 ||
          $scope.giamgiachitiet.mucGiam > 100)
      ) {
        alert(
          "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 50 khi hình thức giảm là phần trăm."
        );
        return;
      }

      // Include idsanpham in the dataToSend object
      var dataToSend = {
        maGiamGia: $scope.giamgiachitiet.maGiamGia,
        tenGiamGia: $scope.giamgiachitiet.tenGiamGia,
        mucGiam: $scope.giamgiachitiet.mucGiam,
        hinhThucGiam: $scope.giamgiachitiet.hinhThucGiam,
        trangThai: $scope.giamgiachitiet.trangThai,
        ngayBatDau: $scope.giamgiachitiet.ngayBatDau,
        ngayKetThuc: $scope.giamgiachitiet.ngayKetThuc,
        idsanpham: $scope.sanPhamDaChon, // Include selected product IDs
      };

      $http
        .put("http://localhost:8080/api/v1/giam-gia/update/" + id, dataToSend)
        .then(function (response) {
          console.log(response.data);
          if (
            confirm(
              "Cập nhật khuyến mãi thành công. Bạn có muốn chuyển hướng trang"
            )
          ) {
            $location.path("/promotion");
          }
        })
        .catch(function (error) {
          console.error("Error updating GiamGia:", error);
        });
    };
  }
);
