myApp.controller(
  "GiamGiaController",
  function ($http, $scope, $location, $route, $window, $sce) {
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
    $scope.listGiamGia = [];
    $scope.listProductGiamGia = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;

    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.searchQuery = "";
    $scope.searchQuery2 = "";
    $scope.searchQuery3 = "";
    function fetchGiamGiaList(trangThai, pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url = `http://localhost:8080/api/v1/giam-gia/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&tenGiamGia=${$scope.searchQuery}`;
        } else {
          url += `&maGiamGia=${$scope.searchQuery}`;
        }
      }
      if ($scope.searchQuery2) {
        if (!isNaN($scope.searchQuery2)) {
          url += `&maGiamGia=${$scope.searchQuery2}`;
        } else {
          url += `&tenGiamGia=${$scope.searchQuery2}`;
        }
      }
      var searchQuery3 =
        $scope.searchQuery3 instanceof Date
          ? $scope.searchQuery3.toISOString().split("T")[0]
          : null;
      if (searchQuery3) {
        url += `&startDate=${searchQuery3}`;
      }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listGiamGia = response.data;
          console.log("Dữ liệu trả về: ", response.data);

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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };
    $scope.nextPage = function () {
      $scope.pageNumber++;
      fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
    };
    $scope.searchKhach = function () {
      fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
    };
    $scope.searchNgay = function () {
      fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
    };
    $scope.onTrangThaiChange = function () {
      fetchGiamGiaList($scope.selectedTrangThai, "", "", "");
    };

    $scope.searchTenKhach = function () {
      fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
    };
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

    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    $scope.listVoucherHistory = []; // Add this line before using $scope.listVoucherHistory
    function fetchVoucherHistortyList() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/audilog/khuyenmai", config)
        .then(function (response) {
          $scope.listHistory = response.data;

          // Lọc và chỉ giữ lại các bản ghi có ngày khác với ngày trước đó
          $scope.listVoucherHistory = $scope.listVoucherHistory.filter(
            function (gg) {
              var isDifferentDate =
                !$scope.previousDate || gg.timestamp !== $scope.previousDate;
              $scope.previousDate = gg.timestamp;
              return isDifferentDate;
            }
          );
        });
    }
    fetchVoucherHistortyList();
    $scope.searchVouchers = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // Make sure both startDate and endDate are provided
      if (!$scope.startDate || !$scope.endDate) {
        // Handle error or provide user feedback
        return;
      }

      var formattedStartDate = new Date($scope.startDate)
        .toISOString()
        .split("T")[0];
      var formattedEndDate = new Date($scope.endDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/khuyenmaiseach?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.searchVouchersByDay = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var formattedStartDate = new Date($scope.searchDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/auditlogkhuyenmaibydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);

    setTimeout(() => {
      $scope.updateGiamGia = function (id) {
        Swal.fire({
          title: "Bạn có muốn cập nhập khuyễn mãi không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Đồng ý",
          cancelButtonColor: "#d33",
          cancelButtonText: "Hủy bỏ",
        }).then((result) => {
          if (result.isConfirmed) {
            var updateData = {
              tenGiamGia: $scope.tenGiamGia,
              ngayBatDau: $scope.ngayBatDau,
              ngayKetThuc: $scope.ngayKetThuc,
              hinhThucGiam: $scope.hinhThucGiam,
              trangThai: $scope.trangThai,
            };

            $http
              .put(
                "http://localhost:8080/api/v1/giam-gia/update/" + id,
                updateData
              )
              .then(
                function (response) {
                  Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Cập nhật khuyến mãi thành công",
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {
                      popup: "small-popup", // Thêm class cho message
                    },
                  });
                  $location.path("/promotion");
                },
                function (error) {
                  console.error("Error updating GiamGia:", error);
                }
              );
          }
        });
      };
    }, 2000);

    $scope.toggleDetail = function (gg) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if (!gg.showDetail) {
        $http
          .get(
            "http://localhost:8080/api/v1/giam-gia/detailList?id=" + gg.id,
            config
          )
          .then(function (response) {
            gg.detailList = response.data;
          });
      }
      gg.showDetail = !gg.showDetail;
    };

    $scope.fetchlistThuongHieu = function () {
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
    };
    $scope.fetchlistThuongHieu();

    $scope.fetchlistProduct = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/giam-gia/showproduct", config)
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    };
    $scope.fetchlistProduct();

    $scope.fetchlistDanhMuc = function () {
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
    };
    $scope.fetchlistDanhMuc();

    $scope.fetchlistKieuDe = function () {
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
    };
    $scope.fetchlistKieuDe();

    $scope.fetchlistXuatXu = function () {
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
    };
    $scope.fetchlistXuatXu();

    // Thêm hàm tìm kiếm

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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
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
      var key3 = $scope.key3; // Lấy giá trị từ dropdown

      if (key3 === "") {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchGiamGiaList($scope.selectedTrangThai, $scope.pageNumber);
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchStatus_bykey", {
            params: { key: key3 },
            config,
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    // Thêm hàm làm mới
    $scope.tuDongTaoMa = false;
    $scope.maGiamGia = "";
    $scope.tenGiamGia = "";
    $scope.mucGiam = "";
    $scope.hinhThucGiam = "";
    $scope.trangThai = "";
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

    // // Define a function to check if the promotion name exists
    // function checkTenGiamGiaExists(tenGiamGia) {
    //   return $http
    //     .get("http://localhost:8080/api/v1/giam-gia/checkTenGiamGia", {
    //       params: {
    //         tenGiamGia: tenGiamGia,
    //       },
    //     })
    //     .then(function (response) {
    //       return response.data;
    //     })
    //     .catch(function (error) {
    //       console.error("Error:", error);
    //       throw error; // Propagate the error for the calling function to handle
    //     });
    // }

    // function checkGiamGiaSanPhamExists(idsanpham) {
    //   // Check if idsanpham is null, if so, return a resolved promise with a default value
    //   if (!idsanpham) {
    //     return Promise.resolve(true); // Change this to the default value you want
    //   }

    //   return $http
    //     .get(
    //       "http://localhost:8080/api/v1/giam-gia/check-product-record-count",
    //       {
    //         params: {
    //           idsanpham: idsanpham,
    //         },
    //       }
    //     )
    //     .then(function (response) {
    //       return response.data;
    //     })
    //     .catch(function (error) {
    //       console.error("Error:", error);
    //       throw error;
    //     });
    // }
    $scope.listOfPromotions = [];
    setTimeout(() => {
      $scope.themKhuyenMai = function () {
        Swal.fire({
          title: "Bạn có muốn thêm khuyễn mãi không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
        }).then((result) => {
          if (result.isConfirmed) {
            var ngayBatDau = new Date($scope.ngayBatDau);
            var ngayKetThuc = new Date($scope.ngayKetThuc);
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
              !$scope.maGiamGia ||
              !$scope.tenGiamGia ||
              !$scope.mucGiam ||
              !$scope.hinhThucGiam ||
              !$scope.ngayBatDau ||
              !$scope.ngayKetThuc
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
              $scope.hinhThucGiam == 2 &&
              ($scope.mucGiam <= 0 || $scope.mucGiam > 100)
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

            // Proceed with adding the promotion without checking the existence of the discount name
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
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/giam-gia/create",
                dataToSend,
                config
              )
              .then(function (response) {
                console.log(response.data);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm thành công",
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

    setTimeout(() => {
      $scope.updateGiamGiaStatus = function (id, event) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn vô hiệu hóa khuyến mãi này không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Đồng ý",
          cancelButtonText: "Hủy bỏ",
          cancelButtonColor: "#d33",
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();

            $http
              .get(
                "http://localhost:8080/api/v1/giam-gia/updateStatus/" + id,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhật khuyến mãi thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Thêm class cho message
                  },
                });
                $route.reload();
              })
              .catch(function (error) {
                console.error("Error updating GiamGia:", error);
              });
          }
        });
      };
    }, 2000);
  }
);
