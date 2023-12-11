myApp.controller("khachHangController", function ($http, $scope, $location, $window) {
  $scope.listKhachHang = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedKhachHang = {};
  $scope.pageNumber = 0;
  var id = $location.search().id;
  $scope.folderName = "D:image"; // Đổi your-folder-name thành tên thư mục thật của bạn

  function fetchKhachHangList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/ql-khach-hang/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

    if ($scope.searchQuery) {
      if (!isNaN($scope.searchQuery)) {
        url += `&soDienThoai=${$scope.searchQuery}`;
      } else {
        url += `&maTaiKhoan=${$scope.searchQuery}`;
      }
    }

    $http
      .get(url)
      .then(function (response) {
        response.data.ngaySinh = new Date(response.data.ngaySinh);
        $scope.listKhachHang = response.data;

        $scope.currentPageNumber = response.data.number;
        $scope.totalNumberOfPages = response.data.totalPages;
      })
      .catch(function (error) { });
  }

  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      fetchKhachHangList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    fetchKhachHangList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchKhachHangDetail(id) {
    var detailUrl = "http://localhost:8080/api/ql-khach-hang/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      response.data.ngaySinh = new Date(response.data.ngaySinh);
      $scope.selectedKhachHang = response.data;
      console.log($scope.selectedKhachHang);
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
    console.log(yourFile);
    $http({
      method: "PUT",
      url:
        "http://localhost:8080/api/ql-khach-hang/update?khachHangId=" +
        $scope.selectedKhachHang.khachHangId,
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
        ten: selectedKhachHang.ten,
        email: selectedKhachHang.email,
        soDienThoai: selectedKhachHang.soDienThoai,
        gioiTinh: selectedKhachHang.gioiTinh,
        ngaySinh: selectedKhachHang.ngaySinh,
        trangThai: selectedKhachHang.trangThai,
        diaChi: selectedKhachHang.diaChi,
        tinh: selectedKhachHang.tinh,
        huyen: selectedKhachHang.huyen,
        phuong: selectedKhachHang.phuong,
      },
    }).then(
      function (response) {
      }
    );
  };

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
  $scope.isFileValid = true;

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

  $scope.createKhachHang = function () {
    $scope.isHoTenValid = !!$scope.ten;
    $scope.isNgaySinhValid = !!$scope.ngaySinh;
    $scope.isSoDienThoaiValid = !!$scope.soDienThoai;
    $scope.isGioiTinhValid = !!$scope.gioiTinh;
    $scope.isEmailValid = !!$scope.email;
    $scope.isProvinceValid = !!$scope.selectedProvince;
    $scope.isDistrictValid = !!$scope.selectedDistrict;
    $scope.isWardValid = !!$scope.selectedWard;
    $scope.isDiaChiValid = !!$scope.diaChi;
    $scope.isTrangThaiValid = !!$scope.trangThai;


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

    $http.get("http://localhost:8080/api/ql-khach-hang/find-by-so-dien-thoai?soDienThoai=" + $scope.soDienThoai)
      .then(function (response) {
        if (response.data > 0) {
          $scope.isSoDienThoaiIsPresent = false; // Số điện thoại đã tồn tại
          return;
        } if (response.data === 0) {
          $scope.isSoDienThoaiIsPresent = true; // Số điện thoại OK
        }
      })

    $http.get("http://localhost:8080/api/ql-khach-hang/find-by-email?email=" + $scope.email)
      .then(function (response) {
        if (response.data > 0) {
          $scope.isEmailIsPresent = false; // Email đã tồn tại
          return;
        } if (response.data === 0) {
          $scope.isEmailIsPresent = true; // Email OK
        }
      })

    var token = $window.localStorage.getItem("token");
    var yourFile = document.getElementById("fileInput").files[0];
    $http({
      method: "POST",
      url: "http://localhost:8080/api/ql-khach-hang/create",
      headers: {
        "Content-Type": undefined,
        "Authorization": "Bearer" + token // Thêm token vào đây để gửi cùng với request
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
        ten: $scope.ten,
        email: $scope.email,
        soDienThoai: $scope.soDienThoai,
        gioiTinh: $scope.gioiTinh,
        ngaySinh: $scope.ngaySinh,
        trangThai: $scope.trangThai,
        diaChi: $scope.diaChi,
        tinh: $scope.selectedProvince.name,
        huyen: $scope.selectedDistrict.name,
        phuong: $scope.selectedWard.name,
      },
    }).then(
      function (response) {
        $scope.selectedKhachHang.push(response.data);
      },
      function (error) {
        // Xử lý error ở đây
      }
    );
  };

  $scope.fetchKhachHangDetail = function (id) {
    fetchKhachHangDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    fetchKhachHangList($scope.selectedTrangThai, "", "", "");
  };

  $scope.searchKhach = function () {
    fetchKhachHangList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    fetchKhachHangList($scope.selectedTrangThai, "", "", "");
  };

  if (id) {
    fetchKhachHangDetail(id);
  } else {
    $scope.onTrangThaiChange();
  }

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

});

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