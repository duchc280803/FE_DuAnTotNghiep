myApp.controller("thuongHieuController", function ($http, $scope, $location) {
    $scope.listThuongHieu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedThuongHieu = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function thuongHieuList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/thuong-hieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenThuongHieu=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listThuongHieu = response.data;
            console.log("Dữ liệu trả về: ", response.data);

            // Update currentPageNumber based on the response
            $scope.currentPageNumber = response.data.number;
            $scope.totalNumberOfPages = response.data.totalPages;
        }).catch(function (error) {
            console.error("Lỗi khi tìm kiếm: ", error);
        });
    }

    $scope.previousPage = function () {
        if ($scope.pageNumber > 0) {
            $scope.pageNumber--;
            thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchThuongHieuDetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/thuong-hieu/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedThuongHieu = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedThuongHieu);
            if ($scope.selectedThuongHieu.trangThai === 1) {
                $scope.selectedThuongHieu.trangThai = "1";
            } else {
                $scope.selectedThuongHieu.trangThai = "2";
            }
            $scope.selectedThuongHieu.thuongHieuId = id;
        });
    }

    $scope.updateThuongHieu = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/thuong-hieu/update?id=" + $scope.selectedThuongHieu.thuongHieuId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newThuongHieu = {};
    $scope.createThuongHieu = function () {
        $http.post("http://localhost:8080/api/v1/thuong-hieu/create", $scope.newThuongHieu)
            .then(function (response) {
                $scope.listThuongHieu.push(response.data);
                thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteThuongHieu = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/thuong-hieu/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa thương hiệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa thương hiệu: ", error);
            });
    };

    $scope.fetchThuongHieuDetail = function (id) {
        fetchThuongHieuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
        thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchThuongHieu = function () {
        thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        thuongHieuList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
