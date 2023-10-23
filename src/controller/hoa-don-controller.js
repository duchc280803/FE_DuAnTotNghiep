myApp.controller("hoaDonController", function ($http, $scope, $window) {
  $scope.listHoaDon = [];
  $scope.selectedLoaiDon = ""; // Giá trị mặc định

  // Hàm tải dữ liệu dựa trên trạng thái và loại đơn
  function fetchHoaDon(trangThai, loaiDon) {
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

    $http.get(url, config).then(function (response) {
      $scope["listHoaDon" + trangThai] = response.data;
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
});
