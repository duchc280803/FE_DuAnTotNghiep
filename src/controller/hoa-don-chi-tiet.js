myApp.controller(
  "hoaDonChiTietController",
  function ($http, $scope, $routeParams) {
    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    const breadcrumbSteps = document.querySelectorAll(".breadcrumb__step");
    // Xử lý sự kiện breadcrumb nếu cần
    for (let i = 0; i < breadcrumbSteps.length; i++) {
      const item = breadcrumbSteps[i];
      item.onclick = () => {
        // Loại bỏ lớp 'breadcrumb__step--active' khỏi tất cả các breadcrumb
        breadcrumbSteps.forEach((step) => {
          step.classList.remove("breadcrumb__step--active");
        });

        // Đánh dấu breadcrumb hiện tại và tất cả các breadcrumb trước nó
        for (let j = 0; j <= i; j++) {
          breadcrumbSteps[j].classList.add("breadcrumb__step--active");
        }
      };
    }

    function getHoaDonChiTiet(id) {
      const apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" + id;
      $http.get(apiUrl).then(function (response) {
        $scope.hoaDonChiTiet = response.data;
      });
    }

    // Gọi hàm để lấy dữ liệu chi tiết hoá đơn dựa trên `id`
    getHoaDonChiTiet(id);

    // Hàm để tải sản phẩm từ API
    function getSanPham(id) {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-san-pham/" + id;

      $http.get(apiUrl).then(function (response) {
        // Gán dữ liệu sản phẩm vào biến $scope.hoaDonChiTiet.sanPham
        $scope.hoaDonChiTiet.sanPham = response.data;
      });
    }

    // Gọi hàm để lấy thông tin sản phẩm dựa trên `id`
    getSanPham(id);

    function getLichSu(id) {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-lich-su/" + id;

      $http.get(apiUrl).then(function (response) {
        $scope.lichSu = response.data;
      });
    }

    // Gọi hàm để lấy dữ liệu lịch sử dựa trên `id`
    getLichSu(id);

    var apiUrl =
      "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-trang-thai/" + id;

    $http.get(apiUrl).then(function (response) {
      $scope.lichSuThayDoi = response.data;
    });

    $scope.listTrangThaiHoaDon = [];
    $http
      .get(
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-trang-thai/" +
          id
      )
      .then(function (response) {
        $scope.listTrangThaiHoaDon = response.data;
        for (var i = 0; i < $scope.listTrangThaiHoaDon.length; i++) {
          var item = $scope.listTrangThaiHoaDon[i];
          $scope.status = item.trangThai;
          if (item.trangThai == 1) {
            $scope.statusChoThanhToan = item.trangThai;
          }
          if (item.trangThai == 2) {
            $scope.statusXacNhan = item.trangThai;
          }
          if (item.trangThai == 3) {
            $scope.statusChoGiaoHang = item.trangThai;
          }
          if (item.trangThai == 4) {
            $scope.statusGiaoHang = item.trangThai;
          }
          if (item.trangThai == 5) {
            $scope.statusThanhCong = item.trangThai;
          }
          if (item.trangThai == 6) {
            $scope.statusDaHuy = item.trangThai;
          }
        }
      });

    $scope.newStatusOrder = {
      ghiChu: "",
      newTrangThai: "",
    };

    $scope.comfirmStatusOrder = function () {
      $http
        .post(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order/" + id,
          JSON.stringify($scope.newStatusOrder)
        )
        .then(function (response) {
          $scope.listTrangThaiHoaDon.push(response.data);
          $window.location.reload();
        });
    };
  }
);
