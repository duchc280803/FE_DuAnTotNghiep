myApp.controller("nhanVienController", function ($http, $scope, $location) {
  $scope.listNhanVien = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedNhanVien = null;
  $scope.listNhanVienRole = [];
  $scope.pageNumber = 0;
  $scope.selectedNhanVienRole = null; // Thêm biến để lưu trữ vai trò được chọn
  $scope.newNhanVienRole = {
    idLoaiTaiKhoan: null, // hoặc giá trị mặc định khác nếu cần
  };

  var id = $location.search().id;

  function listRole() {
    $http
      .get("http://localhost:8080/api/v1/nhan-vien/hien-thi-roles")
      .then(function (response) {
        $scope.listNhanVienRole = response.data;
        console.log($scope.listNhanVienRol);
        // Kiểm tra và chọn giá trị nếu có
        if ($scope.selectedNhanVien && $scope.listNhanVienRole.length > 0) {
          selectRole($scope.selectedNhanVien.idLoaiTaiKhoan);
        }
      });
  }

  function selectRole(idLoaiTaiKhoan) {
    var role = $scope.listNhanVienRole.find(function (item) {
      return item.id === idLoaiTaiKhoan;
    });

    if (role) {
      $scope.selectedNhanVienRole = role;
    }
  }

  listRole();

  function fetchNhanVienList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/v1/nhan-vien/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;
    if ($scope.searchQuery) {
      if (!isNaN($scope.searchQuery)) {
        url += `&soDienThoai=${$scope.searchQuery}`;
      } else {
        url += `&maNhanVien=${$scope.searchQuery}`;
      }
    }
    $http
      .get(url)
      .then(function (response) {
        response.data.ngaySinh = new Date(response.data.ngaySinh);
        $scope.listNhanVien = response.data;
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
      fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchNhanVienDetail(id) {
    var detailUrl = "http://localhost:8080/api/v1/nhan-vien/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      response.data.ngaySinh = new Date(response.data.ngaySinh);
      $scope.selectedNhanVien = response.data;
      console.log("Thông tin chi tiết nhân viên: ", $scope.selectedNhanVien);
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

      // Kiểm tra và chọn giá trị nếu có
      if ($scope.listNhanVienRole.length > 0) {
        selectRole($scope.selectedNhanVien.idLoaiTaiKhoan);
      }
    });
  }

  $scope.updateNhanVien = function (updatedData) {
    var updateUrl =
      "http://localhost:8080/api/v1/nhan-vien/update?idNhanVien=" +
      $scope.selectedNhanVien.nhanVienId;

    $http
      .put(updateUrl, updatedData)
      .then(function (response) {
        console.log("Cập nhật thông tin nhân viên thành công: ", response.data);

        fetchNhanVienList($scope.selectedTrangThai, "", "", "");
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật thông tin nhân viên: ", error);
      });
  };

  $scope.newNhanVien = {};

  $scope.createNhanVien = function () {
    var yourFile = document.getElementById("fileInput").files[0];
    $http({
      method: "POST",
      url: "http://localhost:8080/api/v1/nhan-vien/create",
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
        fullName: $scope.ten,
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

  $scope.fetchNhanVienDetail = function (id) {
    fetchNhanVienDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    fetchNhanVienList($scope.selectedTrangThai, "", "", "");
  };

  $scope.searchNhanVien = function () {
    fetchNhanVienList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    fetchNhanVienList($scope.selectedTrangThai, "", "", "");
  };

  if (id) {
    fetchNhanVienDetail(id);
  } else {
    $scope.onTrangThaiChange();
  }

  // Khi danh sách roles được load xong, kiểm tra và chọn giá trị nếu có
  $scope.$watch("selectedNhanVien", function (newSelectedNhanVien) {
    if (newSelectedNhanVien && $scope.listNhanVienRole.length > 0) {
      // Cập nhật giá trị newNhanVienRole.idLoaiTaiKhoan
      $scope.newNhanVienRole.idLoaiTaiKhoan =
        newSelectedNhanVien.idLoaiTaiKhoan;
    }
  });

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
