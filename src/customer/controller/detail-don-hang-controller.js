myAppCustom.controller(
  "detailDonHangController",
  function ($http, $scope, $window, $routeParams) {
    $scope.listThongTin = [];
    $scope.listTrangThai = [];
    $scope.listSanPham = [];
    $scope.thanhTien = [];
    var idHoaDon = $routeParams.idHoaDon;

    function getThongTin() {
      var token = $window.localStorage.getItem("token-customer");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var url =
        "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-don/" +
        idHoaDon;

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listThongTin = response.data;
        })
        .catch(function (error) {
          console.error("Error fetching don hang data:", error);
        });
    }

    function getTrangThai() {
      var url =
        "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-trang-thai/" +
        idHoaDon;

      $http
        .get(url)
        .then(function (response) {
          $scope.listTrangThai = response.data;
        })
        .catch(function (error) {});
    }

    function getSanPham() {
      var token = $window.localStorage.getItem("token-customer");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var url =
        "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-san-pham/" +
        idHoaDon;

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listSanPham = response.data;

          // Tính tổng tiền hàng
          $scope.tongTienHang = 0;
          angular.forEach($scope.listSanPham, function (item) {
            var donGia =
              item.donGiaSauGiam !== null ? item.donGiaSauGiam : item.donGia;
            $scope.tongTienHang += donGia * item.soLuong;
          });
        })
        .catch(function (error) {
          console.error("Error fetching don hang data:", error);
        });
    }

    function getThanhTien() {
      var url =
        "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/thanh-tien/" +
        idHoaDon;

      $http
        .get(url)
        .then(function (response) {
          $scope.thanhTien = response.data;
        })
        .catch(function (error) {
          console.error("Error fetching don hang data:", error);
        });
    }

    // Gọi hàm getDonHang khi controller được khởi tạo
    getThongTin();
    getTrangThai();
    getSanPham();
    getThanhTien();

    $scope.huyHoaDon = {
      ghiChu: "",
      newTrangThai: 6,
    };
    $scope.comfirmStatusHuyDon = function () {
      Swal.fire({
        title: "Bạn có muốn hủy đơn này không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          $http
            .put(
              "http://localhost:8080/api/v1/hoa-don-chi-tiet/huy-don/" +
                idHoaDon,
              $scope.huyHoaDon
            )
            .then(function (response) {
              $window.location.reload();
            });
        }
      });
    };

    $scope.lyDo = "";
    $scope.yeuCauTraHang = function (idHoaDonChiTiet) {
      Swal.fire({
        title: "Bạn có muốn yêu trả hàng sản phẩm này không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          $http
            .post(
              "http://localhost:8080/api/checkout-not-login/yeu-cau-tra-hang?idHoaDon=" +
                idHoaDon +
                "&idHoaDonChiTiet=" +
                idHoaDonChiTiet +
                "&lyDo=" +
                $scope.lyDo
            )
            .then(function (response) {
              $window.location.reload();
            });
        }
      });
    };

    $scope.hoaDonChiTiet = {};
    $scope.getHoaDonChiTiet = function () {
      const apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" +
        idHoaDon;
      $http.get(apiUrl).then(function (response) {
        $scope.hoaDonChiTiet = response.data;
      });
    };
    $scope.getHoaDonChiTiet();

    $scope.getIdHoaDonChiTiet = function (id) {
      $scope.idHoaDonChiTiet = id;
    };
  }
);
