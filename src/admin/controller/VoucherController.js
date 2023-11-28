myApp.controller("VoucherController", function ($http, $scope, $location) {
  $scope.listVoucher = [];
  $scope.listVoucherHistory = [];

  $scope.pageNumber = 0;
  $scope.pageSize = 20;

  // Trong hàm fetchVoucherList()
  $scope.fetchVoucherList = function () {
    $http
      .get(
        "http://localhost:8080/api/v1/voucher/show?pageNumber=" +
          $scope.pageNumber +
          "&pageSize=" +
          $scope.pageSize
      )
      .then(function (response) {
        $scope.listVoucher = response.data;
        // Kiểm tra số lượng trang và điều chỉnh hiển thị nút "Next"
        if ($scope.listVoucher.length < $scope.pageSize) {
          $scope.showNextButton = false; // Ẩn nút "Next"
        } else {
          $scope.showNextButton = true; // Hiển thị nút "Next"
        }
      });
  };

  $scope.fetchVoucherList();

  // TODO: updatePage
  $scope.updatePage = function (pageNumber) {
    $scope.pageNumber = pageNumber;
    $scope.fetchVoucherList();
  };

  // TODO: Quay lại trang
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

  function fetchVoucherHistortyList() {
    $http
      .get("http://localhost:8080/api/v1/audilog/voucher")
      .then(function (response) {
        $scope.listVoucherHistory = response.data;

        // Lọc và chỉ giữ lại các bản ghi có ngày khác với ngày trước đó
        $scope.listVoucherHistory = $scope.listVoucherHistory.filter(function (
          gg
        ) {
          var isDifferentDate =
            !$scope.previousDate || gg.timestamp !== $scope.previousDate;
          $scope.previousDate = gg.timestamp;
          return isDifferentDate;
        });
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
    var formattedEndDate = new Date($scope.endDate).toISOString().split("T")[0];

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
            popup: 'small-popup' // Thêm class cho message
          }
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
          $http
            .post("http://localhost:8080/api/v1/voucher/create", dataToSend)
            .then(function (response) {
              $scope.listVoucher.push(response.data)
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thêm thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: 'small-popup' // Thêm class cho message
                }
              });
              $location.path("/voucher")
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
    var key = $scope.key;
    if (!key) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      $scope.fetchVoucherList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/voucher/search", {
          params: { keyword: key },
        })
        .then(function (response) {
          $scope.listVoucher = response.data;
        });
    }
  };
  $scope.searchStatus = function () {
    var trangThai = $scope.trangThai;
    if (!trangThai) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchVoucherList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/voucher/searchByTrangThai", {
          params: { trangThai: trangThai },
        })
        .then(function (response) {
          $scope.listVoucher = response.data;
        });
    }
  };
  $scope.showBrandSelect = false;

  $scope.searchDateHistory = function () {
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
});
