myApp.controller("GiamGiaController", function ($http, $scope, $location) {
  $scope.listGiamGia = [];
  $scope.listThuongHieu = [];
  function fetchGiamGiaList() {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/show")
      .then(function (response) {
        $scope.listGiamGia = response.data;
      });
  }

  // //TODO: Get all hoa đơn tại quầy
  // $scope.page = 1;
  // $scope.size = 4;
  // function fetchGiamGiaList() {
  //   $http
  //     .get(
  //       "http://localhost:8080/api/v1/giam-gia/show?page=" +
  //         $scope.page +
  //         "&size=" +
  //         $scope.size
  //     )
  //     .then(function (response) {
  //       $scope.listGiamGia = response.data;
  //     });
  // };
  // fetchGiamGiaList();
  // // $scope.getListHoaDonTaiQuay();

  // $scope.getPageNumbers = function () {
  //   var totalPages = Math.ceil($scope.listGiamGia.length / $scope.pageSize);
  //   var pageNumbers = [];
  //   for (var i = 1; i <= totalPages; i++) {
  //     pageNumbers.push(i);
  //   }
  //   return pageNumbers;
  // };

  // // TODO: updatePage
  // $scope.updatePage = function (pageNumber) {
  //   $scope.pageNumber = pageNumber;
  //   fetchGiamGiaList();
  // };

  // // TODO: Quay lại trang
  // $scope.previousPage = function () {
  //   if ($scope.pageNumber > 0) {
  //     $scope.pageNumber--;
  //     fetchGiamGiaList();
  //   }
  // };

  // // TODO: tiến đến trang khác
  // $scope.nextPage = function () {
  //   $scope.pageNumber++;
  //   fetchGiamGiaList();
  // };
  $scope.toggleDetail = function (gg) {
    if (!gg.showDetail) {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/detailList?id=" + gg.id)
        .then(function (response) {
          gg.detailList = response.data;
        });
    }
    gg.showDetail = !gg.showDetail;
  };

  function fetchlistThuongHieu() {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/show")
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

  // Define a function to check if the promotion name exists
  function checkTenGiamGiaExists(tenGiamGia) {
    return $http
      .get("http://localhost:8080/api/v1/giam-gia/checkTenGiamGia", {
        params: {
          tenGiamGia: tenGiamGia,
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error("Error:", error);
        throw error; // Propagate the error for the calling function to handle
      });
  }

  function checkGiamGiaSanPhamExists(idsanpham) {
    // Check if idsanpham is null, if so, return a resolved promise with a default value
    if (!idsanpham) {
      return Promise.resolve(true); // Change this to the default value you want
    }

    return $http
      .get("http://localhost:8080/api/v1/giam-gia/check-product-record-count", {
        params: {
          idsanpham: idsanpham,
        },
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error("Error:", error);
        throw error;
      });
  }
  $scope.themKhuyenMai = function () {
    if (
      !$scope.maGiamGia ||
      !$scope.tenGiamGia ||
      !$scope.mucGiam ||
      !$scope.hinhThucGiam ||
      !$scope.ngayBatDau ||
      !$scope.ngayKetThuc
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    var ngayBatDau = new Date($scope.ngayBatDau);
    var ngayKetThuc = new Date($scope.ngayKetThuc);
    if (ngayBatDau >= ngayKetThuc) {
      alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
      return;
    }

    if (
      $scope.hinhThucGiam == 2 &&
      ($scope.mucGiam <= 0 || $scope.mucGiam > 100)
    ) {
      alert(
        "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 50 khi hình thức giảm là phần trăm."
      );
      return;
    }

    checkTenGiamGiaExists($scope.tenGiamGia)
      .then(function (exists) {
        if (exists) {
          alert("Tên khuyến mãi đã tồn tại. Vui lòng chọn tên khác.");
        } else {
          return checkGiamGiaSanPhamExists(
            $scope.sanPhamDaChon.length > 0 ? $scope.sanPhamDaChon : null
          );
        }
      })
      .then(function (isProductCountValid) {
        if (!isProductCountValid) {
          alert("Sản phẩm này đã áp dụng tối đa 1 lần giảm giá");
        } else {
          var idDanhMuc;

          if ($scope.DanhMuc != null) {
            idDanhMuc = $scope.DanhMuc;
          } else if ($scope.ThuongHieu != null) {
            idDanhMuc = $scope.ThuongHieu;
          } else if ($scope.MauSac != null) {
            idDanhMuc = $scope.MauSac;
          } else if ($scope.KieuDe != null) {
            idDanhMuc = $scope.KieuDe;
          } else if ($scope.ChatLieu != null) {
            idDanhMuc = $scope.ChatLieu;
          } else if ($scope.Size != null) {
            idDanhMuc = $scope.Size;
          } else if ($scope.XuatXu != null) {
            idDanhMuc = $scope.XuatXu;
          } else {
            idDanhMuc = null;
          }
          // Proceed with adding the promotion if the name is unique and product count is within limits
          var dataToSend = {
            maGiamGia: $scope.maGiamGia,
            tenGiamGia: $scope.tenGiamGia,
            mucGiam: $scope.mucGiam,
            hinhThucGiam: $scope.hinhThucGiam,
            trangThai: $scope.trangThai,
            ngayBatDau: $scope.ngayBatDau,
            ngayKetThuc: $scope.ngayKetThuc,
            idsanpham: $scope.sanPhamDaChon,
            idDanhMuc: idDanhMuc,
          };

          $http
            .post("http://localhost:8080/api/v1/giam-gia/create", dataToSend)
            .then(function (response) {
              console.log(response.data);
              $scope.maGiamGia = "";
              $scope.tenGiamGia = "";
              $scope.mucGiam = "";
              $scope.hinhThucGiam = "";
              $scope.trangThai = "";
              $scope.ngayBatDau = "";
              $scope.ngayKetThuc = "";
              $scope.sanPhamDaChon = [];

              if (
                confirm(
                  "Thêm khuyến mãi thành công.Bạn có muốn chuyển hướng trang"
                )
              ) {
                $location.path("/khuyen-mai");
              }
            })
            .catch(function (error) {
              console.error("Error:", error);
            });
        }
      })
      .catch(function (error) {
        // Handle the error if needed
        console.error("Error:", error);
      });
  };
});
