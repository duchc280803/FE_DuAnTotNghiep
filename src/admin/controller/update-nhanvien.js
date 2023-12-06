myApp.controller(
  "UpdateNhanVienController",
  function ($http, $scope, $routeParams, $location) {
    $scope.selectedNhanVien = {};

    var id = $routeParams.id;

    function fetchNhanVienDetail(id) {
      var detailUrl = "http://localhost:8080/api/v1/nhan-vien/detail?id=" + id;
      $http.get(detailUrl).then(function (response) {
        response.data.ngaySinh = new Date(response.data.ngaySinh);
        $scope.selectedNhanVien = response.data;
        if ($scope.selectedNhanVien.trangThai === 1) {
          $scope.selectedNhanVien.trangThai = "1";
        } else {
          $scope.selectedNhanVien.trangThai = "2";
        }

        if ($scope.selectedNhanVien.gioiTinh === false) {
          $scope.selectedNhanVien.gioiTinh = "false";
        } else {
          $scope.selectedNhanVien.gioiTinh = "true";
        }

        $scope.selectedNhanVien.nhanVienId = id;

      });
    }

    fetchNhanVienDetail(id);

    $scope.updateNhanVien = function () {
      var yourFile = document.getElementById("fileInput").files[0];
      console.log(yourFile);
      $http({
        method: "PUT",
        url: "http://localhost:8080/api/v1/nhan-vien/update?idNhanVien=" + id,
        headers: {
          "Content-Type": undefined,
        },
        transformRequest: function (data) {
          var formData = new FormData();
          formData.append("file", data.file);
          formData.append("fullName", data.fullName);
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
          fullName: $scope.selectedNhanVien.fullName,
          email: $scope.selectedNhanVien.email,
          soDienThoai: $scope.selectedNhanVien.soDienThoai,
          gioiTinh: $scope.selectedNhanVien.gioiTinh,
          ngaySinh: $scope.selectedNhanVien.ngaySinh,
          trangThai: $scope.selectedNhanVien.trangThai,
          diaChi: $scope.selectedNhanVien.diaChi,
          tinh: $scope.selectedProvince.name,
          huyen: $scope.selectedDistrict.name,
          phuong: $scope.selectedWard.name,
        },
      }).then(function (response) {
        $location.path("/staff");
      });
    };


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
