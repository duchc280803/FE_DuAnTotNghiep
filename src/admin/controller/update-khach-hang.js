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

    // validation here
    $scope.isHoTenValid = true;
    $scope.isNgaySinhValid = true;
    $scope.isSoDienThoaiValid = true;
    $scope.isGioiTinhValid = true;
    $scope.isEmailValid = true;
    $scope.isProvinceValid = true;
    $scope.isDistrictValid = true;
    $scope.isWardValid = true;
    $scope.isDiaChiValid = true;
    $scope.isTrangThaiValid = true;

    $scope.isSoDienThoaiIsPresent = true;
    $scope.isEmailIsPresent = true;

    $scope.isSoDienThoaiFormat = true;
    $scope.isEmailFormat = true;

    function validateSoDienThoaiFormat(soDienThoai) {
      // Sử dụng biểu thức chính quy để kiểm tra định dạng số điện thoại Việt Nam
      var phoneRegex = /^(0[2-9]{1}\d{8,9})$/;
      return phoneRegex.test(soDienThoai);
    }

    function validateEmailFormat(email) {
      // Sử dụng biểu thức chính quy để kiểm tra định dạng email
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    $scope.updateKhachHang = function () {
      $scope.isHoTenValid = !!$scope.selectedKhachHang.ten;
      $scope.isNgaySinhValid = !!$scope.selectedKhachHang.ngaySinh;
      $scope.isSoDienThoaiValid = !!$scope.selectedKhachHang.soDienThoai;
      $scope.isGioiTinhValid = !!$scope.selectedKhachHang.gioiTinh;
      $scope.isEmailValid = !!$scope.selectedKhachHang.email;
      $scope.isProvinceValid = !!$scope.selectedProvince;
      $scope.isDistrictValid = !!$scope.selectedDistrict;
      $scope.isWardValid = !!$scope.selectedWard;
      $scope.isDiaChiValid = !!$scope.selectedKhachHang.diaChi;
      $scope.isTrangThaiValid = !!$scope.selectedKhachHang.trangThai;


      if ($scope.soDienThoai) {
        $scope.isSoDienThoaiFormat = validateSoDienThoaiFormat(
          $scope.soDienThoai
        );
      }
      if ($scope.email) {
        $scope.isEmailFormat = validateEmailFormat($scope.email);
      }

      if (
        !$scope.isHoTenValid ||
        !$scope.isNgaySinhValid ||
        !$scope.isSoDienThoaiValid ||
        !$scope.isGioiTinhValid ||
        !$scope.isEmailValid ||
        !$scope.isProvinceValid ||
        !$scope.isDistrictValid ||
        !$scope.isWardValid ||
        !$scope.isDiaChiValid ||
        !$scope.isTrangThaiValid
      ) {
        Swal.fire({
          title: "Warning",
          text: "Vui lòng điền đủ thông tin",
          icon: "error",
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }

      $http.get("http://localhost:8080/api/ql-khach-hang/find-by-so-dien-thoai?soDienThoai=" + $scope.selectedKhachHang.soDienThoai)
        .then(function (response) {
          if (response.data > 0) {
            var detailUrl = "http://localhost:8080/api/ql-khach-hang/detail?id=" + id;
            $http.get(detailUrl).then(function (response) {
              let sdt = response.data.soDienThoai;
              if (sdt != $scope.selectedKhachHang.soDienThoai) {
                $scope.isSoDienThoaiIsPresent = false; // Số điện thoại đã tồn tại
                return;
              } else if (sdt === $scope.selectedKhachHang.soDienThoai) {
                $scope.isSoDienThoaiIsPresent = true; // Số điện thoại OK
              }
            });
          } if (response.data === 0) {
            $scope.isSoDienThoaiIsPresent = true; // Số điện thoại OK
          }
        })

      $http.get("http://localhost:8080/api/ql-khach-hang/find-by-email?email=" + $scope.selectedKhachHang.email)
        .then(function (response) {
          if (response.data > 0) {
            var detailUrl = "http://localhost:8080/api/ql-khach-hang/detail?id=" + id;
            $http.get(detailUrl).then(function (response) {
              let email = response.data.email;
              if (email != $scope.selectedNhanVien.email) {
                $scope.isEmailIsPresent = false; // Email đã tồn tại
                return;
              } else if (email === $scope.selectedNhanVien.email) {
                $scope.isEmailIsPresent = true; // Số điện thoại OK
              }
            });
          } if (response.data === 0) {
            $scope.isEmailIsPresent = true; // Email OK
          }
        })

      var selectedImage = document.getElementById('selectedImage');
      if (selectedImage.src === "") {
        alert("Vui lòng chọn ảnh trước khi cập nhật.");
        return;
      }
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
