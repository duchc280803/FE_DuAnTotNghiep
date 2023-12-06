myApp.controller(
  "UpdateKhachHangController",
  function ($http, $scope, $routeParams, $location) {
    $scope.selectedTrangThai = "";
    $scope.selectedKhachHang = {};

    var id = $routeParams.id;

    function fetchKhachHangDetail(id) {
      var detailUrl = "http://localhost:8080/api/ql-khach-hang/detail?id=" + id;
      $http.get(detailUrl).then(function (response) {
        response.data.ngaySinh = new Date(response.data.ngaySinh);
        $scope.selectedKhachHang = response.data;
        if ($scope.selectedKhachHang.trangThai === 1) {
          $scope.selectedKhachHang.trangThai = "1";
        } else {
          $scope.selectedKhachHang.trangThai = "2";
        }

        if ($scope.selectedKhachHang.gioiTinh === false) {
          $scope.selectedKhachHang.gioiTinh = "false";
        } else {
          $scope.selectedKhachHang.gioiTinh = "true";
        }
        $scope.selectedKhachHang.khachHangId = id;
      });
    }

    $scope.updateKhachHang = function () {
      var yourFile = document.getElementById("fileInput").files[0];
      $http({
        method: "PUT",
        url: "http://localhost:8080/api/ql-khach-hang/update?khachHangId=" + id,
        headers: {
          "Content-Type": undefined,
        },
        transformRequest: function (data) {
          var formData = new FormData();
          formData.append("file", data.file);
          formData.append("ten", data.ten);
          formData.append("email", data.email);
          formData.append("soDienThoai", data.soDienThoai);
          formData.append("gioiTinh", data.gioiTinh);
          formData.append("ngaySinh", data.ngaySinh);
          formData.append("trangThai", data.trangThai);
          formData.append("diaChi", data.diaChi);
          formData.append("tinh", data.tinh);
          formData.append("huyen", data.huyen);
          formData.append("phuong", data.phuong);
          return formData;
        },
        data: {
          file: yourFile,
          ten: $scope.selectedKhachHang.ten,
          email: $scope.selectedKhachHang.email,
          soDienThoai: $scope.selectedKhachHang.soDienThoai,
          gioiTinh: $scope.selectedKhachHang.gioiTinh,
          ngaySinh: $scope.selectedKhachHang.ngaySinh,
          trangThai: $scope.selectedKhachHang.trangThai,
          diaChi: $scope.selectedKhachHang.diaChi,
          tinh: $scope.selectedProvince.name,
          huyen: $scope.selectedDistrict.name,
          phuong: $scope.selectedWard.name,
        },
      }).then(function (response) {
        $location.path("/customer");
      });
    };

    fetchKhachHangDetail(id);

    // API ĐỊA CHỈ
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.getTinh = function () {
      $http
        .get("https://provinces.open-api.vn/api/?depth=1")
        .then(function (response) {
          $scope.provinces = response.data;
        });
    };

    $scope.getTinh();

    $scope.getDistricts = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/p/" +
            $scope.selectedProvince.code +
            "?depth=2"
        )
        .then(function (response) {
          $scope.districts = response.data.districts;
        });
    };

    $scope.getWards = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/d/" +
            $scope.selectedDistrict.code +
            "?depth=2"
        )
        .then(function (response) {
          $scope.wards = response.data.wards;
        });
    };
  }
);
function displayImage(event) {
  var image = document.getElementById("selectedImage");
  image.style.display = "block";
  var selectedFile = event.target.files[0];
  var reader = new FileReader();

  reader.onload = function (event) {
    image.src = event.target.result;
  };

  reader.readAsDataURL(selectedFile);
}
