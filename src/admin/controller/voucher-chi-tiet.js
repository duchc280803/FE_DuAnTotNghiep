myApp.controller(
  "voucherChiTietController",
  function ($http, $scope, $routeParams, $location, $window) {
    function getvoucherchitiet(id) {
      const apiUrl = "http://localhost:8080/api/v1/voucher/" + id;
      $http.get(apiUrl).then(function (response) {
        $scope.voucherchitiet = response.data;
      });
    }

    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    getvoucherchitiet(id);

    $scope.updateVoucher = function (id) {
      var ngayBatDau = new Date($scope.voucherchitiet.ngayBatDau);
      var ngayKetThuc = new Date($scope.voucherchitiet.ngayKetThuc);
      if (ngayBatDau >= ngayKetThuc) {
        alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc.");
        return;
      }

      var dataToSend = {
        maVoucher: $scope.voucherchitiet.maVoucher,
        tenVoucher: $scope.voucherchitiet.tenVoucher,
        soLuongMa: $scope.voucherchitiet.soLuongMa,
        giaTriToiThieuDonhang: $scope.voucherchitiet.giaTriToiThieuDonhang,
        giaTriGiam: $scope.voucherchitiet.giaTriGiam,
        hinhThucGiam: $scope.voucherchitiet.hinhThucGiam,
        ngayBatDau: $scope.voucherchitiet.ngayBatDau,
        ngayKetThuc: $scope.voucherchitiet.ngayKetThuc,
        trangThai: 1,
      };
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .put(
          "http://localhost:8080/api/v1/voucher/update/" + id,
          dataToSend,
          config
        )
        .then(function (response) {
          console.log(response.data);
          if (
            confirm(
              "Cập nhật khuyến mãi thành công. Bạn có muốn chuyển hướng trang"
            )
          ) {
            $location.path("/voucher");
          }
        })
        .catch(function (error) {
          console.error("Error updating GiamGia:", error);
        });
    };
  }
);
