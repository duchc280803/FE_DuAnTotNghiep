myApp.controller("sizeController", function ($http, $scope, $location) {
    $scope.listSize = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedSize = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function sizeList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/size/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&size=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listSize = response.data;
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
            sizeList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchSizedetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/size/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedSize = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedSize);
            if ($scope.selectedSize.trangThai === 1) {
                $scope.selectedSize.trangThai = "1";
            } else {
                $scope.selectedSize.trangThai = "0";
            }
            $scope.selectedSize.sizeId = id;

        });
    }

    $scope.updateSize = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/size/update?id=" + $scope.selectedSize.sizeId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            sizeList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newSize = {};
    $scope.createSize = function () {
        $http.post("http://localhost:8080/api/v1/size/create", $scope.newSize)
            .then(function (response) {
                $scope.listSize.push(response.data);
                sizeList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteSize = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/size/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa chất liệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                sizeList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
            });
    };

    $scope.fetchSizedetail = function (id) {
        fetchSizedetail(id);
    };

    $scope.onTrangThaiChange = function () {
        sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchSize = function () {
        sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        sizeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        sizeList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
