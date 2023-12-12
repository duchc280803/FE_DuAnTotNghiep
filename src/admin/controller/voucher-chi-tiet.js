myApp.controller(
  "voucherChiTietController",
  function ($http, $scope, $routeParams, $location, $window) {
    $scope.getvoucherchitiet = function (id) {
      const apiUrl = "http://localhost:8080/api/v1/voucher/" + id;
      $http.get(apiUrl).then(function (response) {
        response.data.ngayBatDau = new Date(response.data.ngayBatDau);
        response.data.ngayKetThuc = new Date(response.data.ngayKetThuc);
        $scope.voucherchitiet = response.data;
      });
    };

    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    $scope.getvoucherchitiet(id);

    setTimeout(() => {
      $scope.updateVoucher = function (id) {
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
        Swal.fire({
          title: "Bạn có update voucher này không ?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            var dataToSend = {
              maVoucher: $scope.voucherchitiet.maVoucher,
              tenVoucher: $scope.voucherchitiet.tenVoucher,
              soLuongMa: $scope.voucherchitiet.soLuongMa,
              giaTriToiThieuDonhang:
                $scope.voucherchitiet.giaTriToiThieuDonhang,
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
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Sửa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $location.path("/voucher");
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
