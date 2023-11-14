myApp.controller("danhMucController", function ($http, $scope, $location) {
    $scope.listDanhMuc = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedDanhMuc = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function danhMucList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/danh-muc/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenDanhMuc=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listDanhMuc = response.data;
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
            danhMucList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchDanhMucDetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/danh-muc/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedDanhMuc = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedDanhMuc);
            if ($scope.selectedDanhMuc.trangThai === 1) {
                $scope.selectedDanhMuc.trangThai = "1";
            } else {
                $scope.selectedDanhMuc.trangThai = "2";
            }
            $scope.selectedDanhMuc.danhMucId = id;

        });
    }

    $scope.updateDanhMuc = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/danh-muc/update?id=" + $scope.selectedDanhMuc.danhMucId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            danhMucList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newDanhMuc = {};
    $scope.createDanhMuc = function () {
        $http.post("http://localhost:8080/api/v1/danh-muc/create", $scope.newDanhMuc)
            .then(function (response) {
                $scope.listDanhMuc.push(response.data);
                danhMucList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteDanhMuc = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/danh-muc/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa chất liệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                danhMucList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
            });
    };

    $scope.fetchDanhMucDetail = function (id) {
        fetchDanhMucDetail(id);
    };

    $scope.onTrangThaiChange = function () {
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchDanhMuc = function () {
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        danhMucList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
