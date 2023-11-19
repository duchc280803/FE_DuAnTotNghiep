myApp.controller("nhanVienController", function ($http, $scope, $location) {
    $scope.listNhanVien = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedNhanVien = null;
    $scope.listNhanVienRole = [];
    $scope.pageNumber = 0;
    $scope.selectedNhanVienRole = null; // Thêm biến để lưu trữ vai trò được chọn
    $scope.newNhanVienRole = {
        idLoaiTaiKhoan: null // hoặc giá trị mặc định khác nếu cần
    };

    var id = $location.search().id;

    function listRole() {
        $http
            .get("http://localhost:8080/api/v1/nhan-vien/hien-thi-roles")
            .then(function (response) {
                $scope.listNhanVienRole = response.data;
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
        $http.get(url).then(function (response) {
            response.data.ngaySinh = new Date(response.data.ngaySinh);
            $scope.listNhanVien = response.data;
            console.log("Dữ liệu trả về: ", response.data);

            $scope.currentPageNumber = response.data.number;
            $scope.totalNumberOfPages = response.data.totalPages;
        }).catch(function (error) {
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
        var updateUrl = "http://localhost:8080/api/v1/nhan-vien/update?idNhanVien=" + $scope.selectedNhanVien.nhanVienId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin nhân viên thành công: ", response.data);

            fetchNhanVienList($scope.selectedTrangThai, "", "", "");
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin nhân viên: ", error);
        });
    };

    $scope.newNhanVien = {};

    $scope.createNhanVien = function () {
        // Lấy giá trị vai trò từ dropdown
        var selectedRoleId = $scope.newNhanVienRole.idLoaiTaiKhoan;

        // Đặt giá trị vai trò vào newNhanVien
        $scope.newNhanVien.idLoaiTaiKhoan = selectedRoleId;
        // Gọi API để tạo nhân viên
        $http.post("http://localhost:8080/api/v1/nhan-vien/create", $scope.newNhanVien)
            .then(function (response) {
                // Sau khi tạo nhân viên thành công, làm mới trường newNhanVien
                $scope.newNhanVien = {};

                // Sau đó, fetch lại danh sách nhân viên
                fetchNhanVienList($scope.selectedTrangThai, "", "", "");
            })
            .catch(function (error) {
                console.error("Lỗi khi tạo nhân viên: ", error);
            });

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
    $scope.$watch('selectedNhanVien', function (newSelectedNhanVien) {
        if (newSelectedNhanVien && $scope.listNhanVienRole.length > 0) {
            // Cập nhật giá trị newNhanVienRole.idLoaiTaiKhoan
            $scope.newNhanVienRole.idLoaiTaiKhoan = newSelectedNhanVien.idLoaiTaiKhoan;
        }
    });

});