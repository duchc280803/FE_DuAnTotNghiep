myApp.controller("xuatXuController", function ($http, $scope, $location) {
    $scope.listXuatXu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedXuatXu = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function xuatXuList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/xuat-xu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenXuatXu=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listXuatXu = response.data;
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
            xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchXuatXuDetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/xuat-xu/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedXuatXu = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedXuatXu);
            if ($scope.selectedXuatXu.trangThai === 1) {
                $scope.selectedXuatXu.trangThai = "1";
            } else {
                $scope.selectedXuatXu.trangThai = "2";
            }
            $scope.selectedXuatXu.xuatXuId = id;

        });
    }

    $scope.updateXuatXu = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/xuat-xu/update?id=" + $scope.selectedXuatXu.xuatXuId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newXuatXu = {};
    $scope.createXuatXu = function () {
        $http.post("http://localhost:8080/api/v1/xuat-xu/create", $scope.newXuatXu)
            .then(function (response) {
                $scope.listXuatXu.push(response.data);
                xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteXuatXu = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/xuat-xu/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa xuất xứ thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa xuất xứ: ", error);
            });
    };

    $scope.fetchXuatXuDetail = function (id) {
        fetchXuatXuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
        xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchXuatXu = function () {
        xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        xuatXuList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
