myApp.controller(
  "VoucherController",
  function ($http, $scope, $location, $route, $window, $sce) {
    var role = $window.localStorage.getItem("role");
    var token = $window.localStorage.getItem("token");
    console.log(token);
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
    $scope.listVoucher = [];
    $scope.listVoucherHistory = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    // Trong hàm fetchVoucherList()
    $scope.fetchVoucherList = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var url =
        "http://localhost:8080/api/v1/voucher/hien-thi" +
        "?pageNumber=" +
        $scope.pageNumber +
        "&pageSize=" +
        $scope.pageSize;

      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&tenVoucher=${$scope.searchQuery}`;
        } else {
          url += `&maVoucher=${$scope.searchQuery}`;
        }
      }
      if ($scope.searchQuery2) {
        if (!isNaN($scope.searchQuery2)) {
          url += `&maVoucher=${$scope.searchQuery2}`;
        } else {
          url += `&tenVoucher=${$scope.searchQuery2}`;
        }
      }
      if ($scope.searchQuery3) {
        url += `&trangThai=${$scope.searchQuery3}`;
      }
      $http.get(url, config).then(function (response) {
        $scope.listVoucher = response.data;
        // Kiểm tra số lượng trang và điều chỉnh hiển thị nút "Next"
        if ($scope.listVoucher.length < $scope.pageSize) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      });
    };
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    $scope.fetchVoucherList();

    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.fetchVoucherList();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.fetchVoucherList();
    };

    $scope.previousDate = null;
    $scope.searchKhach = function () {
      $scope.fetchVoucherList();
    };
    $scope.onTrangThaiChange = function () {
      $scope.fetchVoucherList();
    };

    $scope.searchGiamGia = function () {
      $scope.fetchVoucherList();
    };
    $scope.searchTenKhach = function () {
      $scope.fetchVoucherList();
    };
    $scope.refresh = function () {
      // Thực hiện các hành động cần thiết để làm mới dữ liệu
      // Ví dụ: gọi các hàm search hoặc reset giá trị của các biến tìm kiếm
      $scope.searchQuery = "";
      $scope.searchQuery2 = "";
      $scope.selectedTrangThai = "";
      // Gọi các hàm search tương ứng nếu cần
      $scope.searchKhach();
      $scope.searchTenKhach();
      $scope.onTrangThaiChange();
    };
    function fetchVoucherHistortyList() {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/audilog/voucher", config)
        .then(function (response) {
          $scope.listVoucherHistory = response.data;
        });
    }

    fetchVoucherHistortyList();

    setTimeout(() => {
      $scope.updateVoucherStatus = function (id, event) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn vô hiệu hóa voucher này không?",
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
                "http://localhost:8080/api/v1/voucher/updateStatus/" + id,
                config
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Cập nhật voucher thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Thêm class cho message
                  },
                });
                $route.reload();
              })
              .catch(function (error) {
                console.error("Error updating Voucher:", error);
              });
          }
        });
      };
    }, 2000);
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
        "http://localhost:8080/api/v1/audilog/vouchersearch?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl, config).then(function (response) {
        $scope.listVoucherHistory = response.data;
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
        "http://localhost:8080/api/v1/audilog/auditlogvoucherbydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl, config).then(function (response) {
        $scope.listVoucherHistory = response.data;
      });
    };

    $scope.onTuDongTaoMaChange = function () {
      if ($scope.tuDongTaoMa) {
        // If the checkbox is checked, automatically generate the discount code
        $scope.maVoucher = "GG_" + new Date().getTime();
        // You might want to update other related properties as well
      } else {
        // If the checkbox is unchecked, clear the discount code or handle it as needed
        $scope.maVoucher = "";
        // You might want to update other related properties as well
      }
    };

    setTimeout(() => {
      $scope.themVoucher = function () {
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
          !$scope.maVoucher ||
          !$scope.tenVoucher ||
          !$scope.soLuongMa ||
          !$scope.giaTriToiThieuDonhang ||
          !$scope.giaTriGiam ||
          !$scope.hinhThucGiam ||
          !$scope.ngayBatDau ||
          !$scope.ngayKetThuc
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Vui lòng điền đầy đủ thông tin",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          return;
        }
        if (
          $scope.hinhThucGiam == 1 &&
          ($scope.giaTriGiam <= 0 || $scope.giaTriGiam > 100)
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title:
              "Giá trị mức giảm phải nằm trong khoảng từ 0 đến 100 khi hình thức giảm là phần trăm",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Thêm class cho message
            },
          });
          return;
        }

        if (
          $scope.giaTriToiThieuDonhang < 0 ||
          $scope.soLuongMa < 0 ||
          $scope.giaTriGiam < 0
        ) {
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Giá trị không hợp lệ",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
          return;
        }

        Swal.fire({
          title: "Bạn có muốn thêm voucher không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            var dataToSend = {
              maVoucher: $scope.maVoucher,
              tenVoucher: $scope.tenVoucher,
              soLuongMa: $scope.soLuongMa,
              giaTriToiThieuDonhang: $scope.giaTriToiThieuDonhang,
              giaTriGiam: $scope.giaTriGiam,
              hinhThucGiam: $scope.hinhThucGiam,
              trangThai: 1,
              ngayBatDau: $scope.ngayBatDau,
              ngayKetThuc: $scope.ngayKetThuc,
            };
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/voucher/create",
                dataToSend,
                config
              )
              .then(function (response) {
                $scope.listVoucher.push(response.data);
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
                $location.path("/voucher");
              })
              .catch(function (error) {
                console.error("Error:", error);
              });
          }
        });
      };
    }, 2000);

    $scope.isQuantityEnabled = true;

    $scope.onQuantityEnabledChange = function () {
      if (!$scope.isQuantityEnabled) {
        // If the radio button is unchecked, set quantity to 0 and disable the input
        $scope.soLuongMa = 0;
      }
    };
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
        $scope.fetchVoucherList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/voucher/search", {
            params: { keyword: key },
            config,
          })
          .then(function (response) {
            $scope.listVoucher = response.data;
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
      var trangThai = $scope.trangThai;
      if (!trangThai) {
        // Nếu giá trị là null, gọi lại danh sách đầy đủ
        fetchVoucherList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/voucher/searchByTrangThai", {
            params: { trangThai: trangThai },
            config,
          })
          .then(function (response) {
            $scope.listVoucher = response.data;
          });
      }
    };
    $scope.showBrandSelect = false;

    $scope.searchDateHistory = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var startDate = $scope.startDate;
      var endDate = $scope.endDate;

      if (!startDate && !endDate) {
        // Nếu cả hai giá trị là null, gọi lại danh sách đầy đủ
        fetchVoucherHistortyList();
      } else {
        $http
          .get("http://localhost:8080/api/v1/audilog/vouchersearch", {
            params: { startDate: startDate, endDate: endDate },
          })
          .then(function (response) {
            $scope.listVoucherHistory = response.data;
          });
      }
    };
  }
);
