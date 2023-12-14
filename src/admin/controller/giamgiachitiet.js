myApp.controller(
  "giamgiaChiTietController",
  function ($http, $scope, $routeParams, $location, $window) {
    var role = $window.localStorage.getItem("role");
    if (role === "USER") {
      Swal.fire({
        icon: "error",
        title: "Bạn không có quyền truy cập",
        text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }
    if (role === null) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng đăng nhập",
        text: "Vui lòng đăng nhập để có thể sử dụng chức năng.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }

    function getRole() {
      if (role === "ADMIN" || role === "MANAGER") {
        $scope.isAdmin = true;
      }
    }

    getRole();
    function getgiamgiachitiet(id) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const apiUrl =
        "http://localhost:8080/api/v1/giam-gia/detailList?id=" + id;
      $http.get(apiUrl, config).then(function (response) {
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
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/giam-gia/show", config)
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }

    function fetchProduct() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/giam-gia/product", config)
        .then(function (response) {
          $scope.listProductGiamGia = response.data;
        });
    }

    fetchProduct();

    function fetchlistThuongHieu() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi", config)
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    }
    fetchlistThuongHieu();
    // function fetchlistProduct() {
    //   var token = $window.localStorage.getItem("token");

    //   var config = {
    //     headers: {
    //       Authorization: "Bearer " + token,
    //     },
    //   };
    //   $http
    //     .get("http://localhost:8080/api/v1/giam-gia/showproduct", config)
    //     .then(function (response) {
    //       $scope.listProduct = response.data;
    //     });
    // }
    // fetchlistProduct();

    $scope.listProduct = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;

    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    function fetchlistProduct(pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/giam-gia/showproduct?pageNumber=${pageNumber}`;
      console.log(url);
      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&tenSanPham=${$scope.searchQuery}`;
        } else {
          url += `&tenSanPham=${$scope.searchQuery}`;
        }
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listProduct = response.data;

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        fetchlistProduct($scope.pageNumber);
      }
    };
    $scope.nextPage = function () {
      $scope.pageNumber++;
      fetchlistProduct($scope.pageNumber);
    };
    $scope.searchKhach = function () {
      fetchlistProduct($scope.pageNumber);
    };
    fetchlistProduct($scope.pageNumber);
    $scope.refresh = function () {
      // Thực hiện các hành động cần thiết để làm mới dữ liệu
      // Ví dụ: gọi các hàm search hoặc reset giá trị của các biến tìm kiếm
      $scope.searchQuery = "";
      $scope.searchQuery2 = "";
      $scope.selectedTrangThai = "";
      $scope.searchQuery3 = "";
      // Gọi các hàm search tương ứng nếu cần
      $scope.searchKhach();
      $scope.searchNgay();
      $scope.searchTenKhach();
      $scope.onTrangThaiChange();
    };
    $scope.isIdEqual = function (id1, id2) {
      return id1 === id2;
    };
    function fetchlistChatLieu() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show", config)
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    }
    fetchlistChatLieu();
    function fetchlistDanhMuc() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show", config)
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    }
    fetchlistDanhMuc();
    function fetchlistMauSac() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show", config)
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    }
    fetchlistMauSac();
    function fetchlistKieuDe() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show", config)
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    }
    fetchlistKieuDe();
    function fetchlistSize() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/size/show", config)
        .then(function (response) {
          $scope.listSize = response.data;
        });
    }
    fetchlistSize();

    function fetchlistXuatXu() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show", config)
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    }
    fetchlistXuatXu();

    // Thêm hàm tìm kiếm
    $scope.searchGiamGia = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var key1 = $scope.startDate;
      var key2 = $scope.endDate;

      if (!key1 && !key2) {
        // Nếu cả hai giá trị là null, gọi lại danh sách đầy đủ
        fetchGiamGiaList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchDatebykey", {
            params: { key1: key1, key2: key2 },
            config,
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    fetchGiamGiaList();

    $scope.searchKey = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var key = $scope.key;
      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchGiamGiaList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
            params: { key: key },
            config,
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    fetchGiamGiaList();
    $scope.searchbyMa = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var key2 = $scope.key2;
      if (!key2) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchGiamGiaList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
            params: { key: key2 },
            config,
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    fetchGiamGiaList();

    ///
    $scope.searchProductKey = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var key = $scope.tenSanPham;

      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchProduct_bykey", {
            params: { key: key },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };

    ///
    $scope.searchProductList = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.Size;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductDanhMuc = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.DanhMuc;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductThuongHieu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.ThuongHieu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductChatLieu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.ChatLieu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductMauSac = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.MauSac;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductKieuDe = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.KieuDe;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };
    //
    $scope.searchProductXuatXu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var id = $scope.XuatXu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detail", {
            params: { id: id },
            config,
          })
          .then(function (response) {
            $scope.listProduct = response.data;
          });
      }
    };

    $scope.searchStatus = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var key = $scope.status; // Lấy giá trị từ dropdown

      if (key === "") {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchlistProduct($scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchStatus_bykey", {
            params: { key: key },
            config,
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    fetchGiamGiaList();
    // Thêm hàm làm mới
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
    setTimeout(() => {
      $scope.updateGiamGia = function () {
        Swal.fire({
          title: "Bạn có muốn sửa khuyễn mãi không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
        }).then((result) => {
          if (result.isConfirmed) {
            var ngayBatDau = new Date($scope.giamgiachitiet.ngayBatDau);
            var ngayKetThuc = new Date($scope.giamgiachitiet.ngayKetThuc);
            if (ngayBatDau >= ngayKetThuc) {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Thêm class cho message
                },
              });
              return;
            }
            if (
              !$scope.giamgiachitiet.maGiamGia ||
              !$scope.giamgiachitiet.tenGiamGia ||
              !$scope.giamgiachitiet.mucGiam ||
              !$scope.giamgiachitiet.hinhThucGiam ||
              !$scope.giamgiachitiet.ngayBatDau ||
              !$scope.giamgiachitiet.ngayKetThuc
            ) {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Vui lòng nhập đầy đủ thông tin",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Thêm class cho message
                },
              });
              return;
            }
            if (
              $scope.giamgiachitiet.hinhThucGiam == 2 &&
              ($scope.giamgiachitiet.mucGiam <= 0 ||
                $scope.giamgiachitiet.mucGiam > 100)
            ) {
              Swal.fire({
                position: "top-end",
                icon: "error",
                title:
                  "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 50 khi hình thức giảm là phần trăm",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Thêm class cho message
                },
              });
              return;
            }

            // Proceed with adding the promotion without checking the existence of the discount name
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
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .put(
                "http://localhost:8080/api/v1/giam-gia/update/" + id,
                dataToSend,
                config
              )
              .then(function (response) {
                console.log(response.data);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Sửa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Thêm class cho message
                  },
                });
                $location.path("/promotion");
              })
              .catch(function (error) {
                console.error("Error:", error);
              });
          }
        });
      };
    }, 2000);
  }
);
