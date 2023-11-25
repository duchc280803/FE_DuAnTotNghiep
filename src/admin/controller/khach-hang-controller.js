myApp.controller("khachHangController", function ($http, $scope, $location) {
  $scope.listKhachHang = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedKhachHang = null;
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

  $scope.uploadFileInModal = function (file) {
    var url = `http://localhost:8080/upload/${$scope.folderName}`;

    var formData = new FormData();
    formData.append("file", file);

    $http
      .post(url, formData, {
        transformRequest: angular.identity,
        headers: { "Content-Type": "multipart/form-data" }, // Sửa thành 'multipart/form-data'
      })
      .then(function (response) {
        $scope.newKhachHang.photo = response.data.filename;
      })
      .catch(function (error) {
        console.error("Error uploading file:", error);
      });
  };

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

  $scope.updateKhachHang = function (updatedData) {
    var updateUrl =
      "http://localhost:8080/api/ql-khach-hang/update?khachHangId=" +
      $scope.selectedKhachHang.khachHangId;

    $http
      .put(updateUrl, updatedData)
      .then(function (response) {
        fetchKhachHangList($scope.selectedTrangThai, "", "", "");
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật thông tin khách hàng: ", error);
      });
  };

  $scope.createKhachHang = function () {
    var yourFile = document.getElementById("fileInput").files[0];
    $http({
      method: "POST",
      url: "http://localhost:8080/api/ql-khach-hang/create",
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
