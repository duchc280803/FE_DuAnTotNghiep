myApp.controller("hoaDonController", function ($http, $scope, $window, $routeParams) {
  $scope.listHoaDon = [];
  $scope.tenNguoiXacNhanOptions = [];
  $scope.selectedLoaiDon = ""; // Giá trị mặc định
  $scope.searchQuery = ""; // Giá trị trường nhập văn bản
  $scope.isAdmin = false;
  
var id = $routeParams.id;

  function getRole() {
    var role = $window.localStorage.getItem("role");
    if (role == "ADMIN") {
      $scope.isAdmin = true;
    }
  };
  getRole();
  // Hàm tải dữ liệu dựa trên trạng thái và loại đơn
  function fetchHoaDon(trangThai, loaiDon, nguoiXacNhan) {
    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    var url = "http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=" + trangThai;

    if (loaiDon !== undefined && loaiDon !== "") {
      url += "&loaiDon=" + loaiDon;
    }

    if (nguoiXacNhan !== undefined && nguoiXacNhan !== "") {

      url += "&nguoiXacNhan=" + nguoiXacNhan;
    }

    // Thêm tenNhanVien vào URL nếu tenNhanVien được chọn
    if ($scope.tenNhanVien !== undefined && $scope.tenNhanVien !== "") {
      var tenNhanVienParam = "&tenNhanVien=" + $scope.tenNhanVien;
      url += tenNhanVienParam;
    }

    if ($scope.searchQuery !== "") {
      if (!isNaN($scope.searchQuery)) {
        url += "&soDienThoai=" + $scope.searchQuery;
      } else {
        url += "&ma=" + $scope.searchQuery;
      }
    }

    console.log("nguoiXacNhan: ", nguoiXacNhan);

    $http.get(url, config).then(function (response) {
      $scope["listHoaDon" + trangThai] = response.data;

      response.data.forEach(function (hoaDon) {
        if (hoaDon.nguoiXacNhan) {
          $scope.tenNguoiXacNhanOptions.push(hoaDon.nguoiXacNhan);
        }
      });

      $scope.tenNguoiXacNhanOptions = [...new Set($scope.tenNguoiXacNhanOptions)];
      // Kiểm tra dữ liệu trả về
      console.log("Dữ liệu trả về: ", response.data);
    });
  }

  // Hàm lọc dựa trên trạng thái và loại đơn
  function filterHoaDonByLoaiDon(loaiDon) {
    // Sử dụng trạng thái mặc định (ví dụ: 1) hoặc trạng thái của bạn.
    var trangThai = 1;

    // Sử dụng giá trị loaiDon để lọc dữ liệu
    fetchHoaDon(trangThai, loaiDon);
  }

  // Gọi hàm để tải dữ liệu cho từng trạng thái ban đầu
  for (var i = 1; i <= 7; i++) {
    fetchHoaDon(i, $scope.selectedLoaiDon);
  }

  // Hàm lọc khi loại đơn thay đổi
  $scope.filterHoaDon = function () {
    var loaiDon = $scope.selectedLoaiDon;
    for (var i = 1; i <= 7; i++) {
      fetchHoaDon(i, loaiDon);
    }
  };

  $scope.filterHoaDonByNguoiXacNhan = function () {
    var nguoiXacNhan = $scope.selectedNguoiXacNhan;
    for (var i = 1; i <= 7; i++) {
      fetchHoaDon(i, $scope.selectedLoaiDon, nguoiXacNhan);
    }
  };

  // Hàm tìm kiếm
  $scope.searchHoaDon = function () {
    for (var i = 1; i <= 7; i++) {
      fetchHoaDon(i, $scope.selectedLoaiDon);
    }
  };

  // Hàm xóa thông tin tìm kiếm
  $scope.clearSearch = function () {
    $scope.searchQuery = ""; // Đặt trường tìm kiếm về chuỗi rỗng
    for (var i = 1; i <= 7; i++) {
      fetchHoaDon(i, $scope.selectedLoaiDon);
    }
  };

});