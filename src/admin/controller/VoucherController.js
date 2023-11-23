myApp.controller("VoucherController", function ($http, $scope, $location) {
  $scope.listVoucher = [];
  function fetchVoucherList() {
    $http
      .get("http://localhost:8080/api/v1/voucher/show")
      .then(function (response) {
        $scope.listVoucher = response.data;
      });
  }
  $scope.listVoucherHistory = [];
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

  fetchVoucherList();
  $scope.themVoucher = function () {
    // if (
    //   !$scope.maVoucher ||
    //   !$scope.tenVoucher ||
    //   !$scope.soLuongDung ||
    //   !$scope.giaTriToiThieuDonhang ||
    //   !$scope.giaTriGiam ||
    //   !$scope.ngayBatDau ||
    //   !$scope.ngayKetThuc
    // ) {
    //   alert("Vui lòng nhập đầy đủ thông tin.");
    //   return;
    // }

    var ngayBatDau = new Date($scope.ngayBatDau);
    var ngayKetThuc = new Date($scope.ngayKetThuc);
    if (ngayBatDau >= ngayKetThuc) {
      alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
      return;
    }
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
        console.log(response.data);
        $scope.maVoucher = "";
        $scope.tenVoucher = "";
        $scope.soLuongMa = "";
        $scope.giaTriToiThieuDonhang = "";
        $scope.giaTriGiam = "";
        $scope.trangThai = 1;
        $scope.ngayBatDau = "";
        $scope.ngayKetThuc = "";

        if (confirm("Thêm voucher thành công.Bạn có muốn chuyển hướng trang")) {
          $location.path("/voucher");
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  };
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
      fetchVoucherList();
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
