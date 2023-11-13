myApp.controller("khachHangController", function ($http, $scope, $location) {
    $scope.listKhachHang = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedKhachHang = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function fetchKhachHangList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/ql-khach-hang/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            if (!isNaN($scope.searchQuery)) {
                url += `&soDienThoai=${$scope.searchQuery}`;
            } else {
                url += `&maTaiKhoan=${$scope.searchQuery}`;
            }
        }

        $http.get(url).then(function (response) {
            $scope.listKhachHang = response.data;
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
        var updateUrl = "http://localhost:8080/api/ql-khach-hang/update?khachHangId=" + $scope.selectedKhachHang.khachHangId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin khách hàng thành công: ", response.data);

            fetchKhachHangList($scope.selectedTrangThai, "", "", "");
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin khách hàng: ", error);
        });
    };


    $scope.newKhachHang = {};
    $scope.createKhachHang = function () {
        $http
            .post(
                "http://localhost:8080/api/ql-khach-hang/create",
                $scope.newKhachHang
            )
            .then(function (response) {
                $scope.listKhachHang.push(response.data);
                fetchKhachHangList($scope.selectedTrangThai, "", "", "");
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
