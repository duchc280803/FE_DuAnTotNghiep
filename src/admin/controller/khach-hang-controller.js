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
        console.log("Dữ liệu trả về: ", response.data);

        $scope.currentPageNumber = response.data.number;
        $scope.totalNumberOfPages = response.data.totalPages;
      })
      .catch(function (error) {
        console.error("Lỗi khi tìm kiếm: ", error);
      });
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
      console.log("Thông tin chi tiết khách hàng: ", $scope.selectedKhachHang);
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
        console.log(
          "Cập nhật thông tin khách hàng thành công: ",
          response.data
        );

        fetchKhachHangList($scope.selectedTrangThai, "", "", "");
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật thông tin khách hàng: ", error);
      });
  };

  $scope.createKhachHang = function () {
    var input = document.getElementById("formFile");
    var formData = new FormData();
    formData.append("file", input.file);
    formData.append("ten", $scope.createQLKhachHangRequest.ten);
    formData.append("email", $scope.createQLKhachHangRequest.email);
    formData.append("email", $scope.createQLKhachHangRequest.email);
    formData.append("soDienThoai", $scope.createQLKhachHangRequest.soDienThoai);
    formData.append("gioiTinh", $scope.createQLKhachHangRequest.gioiTinh);
    formData.append("ngaySinh", $scope.createQLKhachHangRequest.ngaySinh);
    formData.append("trangThai", $scope.createQLKhachHangRequest.trangThai);
    $http
      .post("http://localhost:8080/api/ql-khach-hang/create", formData, {
        transformRequest: angular.identity,
        headers: { "Content-Type": undefined },
      })
      .then(function (response) {
        $scope.listKhachHang.push(response.data);
        console.log("Thêm Thành Công:", response.data.message);
        // Xử lý các hành động sau khi thêm thành công
      })
      .catch(function (error) {
        console.error("Lỗi khi tạo khách hàng:", error);
        // Xử lý lỗi nếu cần thiết
      });
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
});
