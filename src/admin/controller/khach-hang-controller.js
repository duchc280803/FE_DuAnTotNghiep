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
      .catch(function (error) {});
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

  $scope.createKhachHang = function () {
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