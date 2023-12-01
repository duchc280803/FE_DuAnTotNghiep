myApp.controller(
  "GiamGiaController",
  function ($http, $scope, $location, $route, $window) {
    $scope.listGiamGia = [];
    $scope.listProductGiamGia = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;
    $scope.fetchGiamGiaList = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/giam-gia/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    };
    function fetchVoucherHistortyList() {
      $http
        .get("http://localhost:8080/api/v1/audilog/khuyenmai")
        .then(function (response) {
          $scope.listVoucherHistory = response.data;

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
      // Make sure both startDate and endDate are provided
      if (!$scope.startDate || !$scope.endDate) {
        // Handle error or provide user feedback
        return;
      }

      // Convert dates to YYYY-MM-DD format
      var formattedStartDate = new Date($scope.startDate)
        .toISOString()
        .split("T")[0];
      var formattedEndDate = new Date($scope.endDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/vouchersearch?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl).then(function (response) {
        // Update the listVoucherHistory with the search results
        $scope.listVoucherHistory = response.data;

        // If you want to filter and keep only records with different dates, you can add this block
        $scope.listVoucherHistory = $scope.listVoucherHistory.filter(function (
          gg
        ) {
          var isDifferentDate =
            !$scope.previousDate || gg.timestamp !== $scope.previousDate;
          $scope.previousDate = gg.timestamp;
          return isDifferentDate;
        });
      });
    };
    $scope.searchVouchersByDay = function () {
      // Convert start date to YYYY-MM-DD format
      var formattedStartDate = new Date($scope.searchDate)
        .toISOString()
        .split("T")[0];

      // Construct the API URL with the correct parameter names
      var searchUrl =
        "http://localhost:8080/api/v1/audilog/auditlogbydate?searchDate=" +
        encodeURIComponent(formattedStartDate);

      // console.log("Search URL:", searchUrl); // Log the URL

      $http.get(searchUrl).then(function (response) {
        // console.log("Response data:", response.data); // Log the response data

        $scope.listVoucherHistory = response.data;
        $scope.listVoucherHistory = $scope.listVoucherHistory.filter(function (
          gg
        ) {
          var isDifferentDate =
            !$scope.previousDate || gg.timestamp !== $scope.previousDate;
          $scope.previousDate = gg.timestamp;
          return isDifferentDate;
        });
      });
    };

    $scope.fetchGiamGiaList();

    $scope.updatePage = function (pageNumber) {
      $scope.pageNumber = pageNumber;
      $scope.fetchGiamGiaList();
    };

    // TODO: Quay lại trang
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.fetchGiamGiaList();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.fetchGiamGiaList();
    };

    setTimeout(() => {
      $scope.updateGiamGia = function (id) {
        Swal.fire({
          title: "Bạn có muốn cập nhập khuyễn mãi không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
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
      if (!gg.showDetail) {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/detailList?id=" + gg.id)
          .then(function (response) {
            gg.detailList = response.data;
          });
      }
      gg.showDetail = !gg.showDetail;
    };

    $scope.fetchlistThuongHieu = function () {
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    };
    $scope.fetchlistThuongHieu();

    $scope.fetchlistProduct = function () {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/showproduct")
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    };
    $scope.fetchlistProduct();

    $scope.fetchlistDanhMuc = function () {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.fetchlistDanhMuc();

    $scope.fetchlistKieuDe = function () {
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.fetchlistKieuDe();

    $scope.fetchlistXuatXu = function () {
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.fetchlistXuatXu();

    // Thêm hàm tìm kiếm
    $scope.searchGiamGia = function () {
      var key1 = $scope.startDate;
      var key2 = $scope.endDate;

      if (!key1 && !key2) {
        // Nếu cả hai giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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

    $scope.searchKey = function () {
      var key = $scope.key;
      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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

    $scope.searchbyMa = function () {
      var key2 = $scope.key2;
      if (!key2) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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

    $scope.searchProductKey = function () {
      var key = $scope.tenSanPham;

      if (!key) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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
        $scope.fetchGiamGiaList();
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

    $scope.searchProductDanhMuc = function () {
      var id = $scope.DanhMuc;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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

    $scope.searchProductThuongHieu = function () {
      var id = $scope.ThuongHieu;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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

    $scope.searchProductKieuDe = function () {
      var id = $scope.KieuDe;

      if (!id) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
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
        $scope.fetchGiamGiaList();
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
      var key3 = $scope.key3; // Lấy giá trị từ dropdown

      if (key3 === "") {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        $scope.fetchGiamGiaList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/giam-gia/searchStatus_bykey", {
            params: { key: key3 },
          })
          .then(function (response) {
            $scope.listGiamGia = response.data;
          });
      }
    };

    // Thêm hàm làm mới
    $scope.refresh = function () {
      // Gọi lại danh sách đầy đủ khi làm mới
      $scope.fetchGiamGiaList();
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

    setTimeout(() => {
      $scope.themKhuyenMai = function () {
        Swal.fire({
          title: "Bạn có muốn thêm khuyễn mãi không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
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
                $scope.listGiamGia.push(response.data);
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
        Swal.fire({
          title: "Bạn có muốn vô hiệu hóa khuyến mãi này không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();

            $http
              .get("http://localhost:8080/api/v1/giam-gia/updateStatus/" + id)
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
