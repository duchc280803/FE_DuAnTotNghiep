myApp.controller("hoaDonController", function ($http, $scope, $window) {
  $scope.listHoaDon = [];
  $scope.tenNhanVienOptions = [];
  $scope.allTenNhanVienOptions = []; // Thêm dòng này
  $scope.selectedTrangThai = "";
  $scope.selectedLoaiDon = "";
  $scope.searchQuery = "";
  $scope.pageNumber = 0;
  $scope.isAdmin = false;

  function getRole() {
    var role = $window.localStorage.getItem("role");
    if (role === "ADMIN" || role === "MANAGER") {
      $scope.isAdmin = true;
    }
  }

  getRole();

  $scope.fetchHoaDon = function (trangThai, loaiDon, tenNhanVien, pageNumber) {
    trangThai = trangThai || "";
    loaiDon = loaiDon || "";
    tenNhanVien = tenNhanVien || "";

    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    var url = `http://localhost:8080/api/v1/hoa-don/hien-thi?trangThaiHD=${trangThai}&pageNumber=${pageNumber}`;

    if (loaiDon !== "") {
      url += "&loaiDon=" + loaiDon;
    }

    if (tenNhanVien !== "") {
      url += "&tenNhanVien=" + tenNhanVien;
    }

    if ($scope.searchQuery !== "") {
      url += isNaN($scope.searchQuery)
        ? "&ma=" + $scope.searchQuery
        : "&soDienThoai=" + $scope.searchQuery;
    }

    $http.get(url, config).then(function (response) {
      if (
        Array.isArray(response.data) &&
        response.data.length > 0 &&
        response.data[0].hasOwnProperty("tenNhanVien")
      ) {
        $scope.listHoaDon = response.data;

        // Thêm dữ liệu vào mảng chung allTenNhanVienOptions
        $scope.allTenNhanVienOptions = [
          ...new Set([
            ...$scope.allTenNhanVienOptions,
            ...response.data
              .map((hoaDon) => hoaDon.tenNhanVien)
              .filter(Boolean),
          ]),
        ];

        // Cập nhật mảng tenNhanVienOptions
        $scope.tenNhanVienOptions = [
          ...new Set(
            response.data.map((hoaDon) => hoaDon.tenNhanVien).filter(Boolean)
          ),
        ];
      } else {
        console.error("Invalid data format from API");
        // Nếu không có dữ liệu, đặt $scope.listHoaDon về mảng rỗng
        $scope.listHoaDon = [];
      }
    });
  };

  function fetchHoaDonHistortyList() {
    $http
      .get("http://localhost:8080/api/v1/audilog/hoadon")
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
  fetchHoaDonHistortyList();
  // Hàm lọc dựa trên trạng thái và loại đơn
  function filterHoaDonByLoaiDon(loaiDon) {
    // Sử dụng trạng thái mặc định (ví dụ: 1) hoặc trạng thái của bạn.
    var trangThai = 1;
  }

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.searchHoaDon = function () {
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.filterHoaDon = function () {
    // Gọi hàm fetchHoaDon với các tham số hiện tại
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.filterHoaDonByNguoiXacNhan = function () {
    // Gọi hàm fetchHoaDon với các tham số hiện tại
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.setDefaultTrangThai = function () {
    // Đặt giá trị mặc định cho selectedTrangThai
    $scope.selectedTrangThai = 1;
    // Gọi hàm fetchHoaDon để hiển thị danh sách theo giá trị mặc định
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.openCity = function (trangThai) {
    console.log("Selected Trang Thai:", trangThai);
    $scope.selectedTrangThai = trangThai;
    $scope.pageNumber = 0;
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    $scope.fetchHoaDon(
      $scope.selectedTrangThai,
      $scope.selectedLoaiDon,
      $scope.selectedTenNhanVien,
      $scope.pageNumber
    );
  };

  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      $scope.fetchHoaDon(
        $scope.selectedTrangThai,
        $scope.selectedLoaiDon,
        $scope.selectedTenNhanVien,
        $scope.pageNumber
      );
    }
  };

  $scope.listNhanVien = {};
  $scope.getListNhanVien = function () {
    $http
      .get("http://localhost:8080/api/v1/hoa-don-chi-tiet/list-nhan-vien")
      .then(function (response) {
        $scope.listNhanVien = response.data;
        console.log(response.data);
      });
  };

  $scope.getListNhanVien();

  $scope.idNhanVien = "";
  $scope.idHoaDon = "";
  $scope.getIdHoaDonIdNhanVien = function (idHoaDon, idNhanVien) {
    $scope.idHoaDon = idHoaDon;
    $scope.idNhanVien = idNhanVien;
  };

  $scope.updateNhanVien = function (idHoaDon, idNhanVien) {
    $http
      .put(
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/update-nhan-vien?idHoaDon=" +
          idHoaDon +
          "&idNhanVien=" +
          idNhanVien
      )
      .then(function (response) {
        $window.location.reload();
      });
  };
});
