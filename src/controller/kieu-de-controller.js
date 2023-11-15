myApp.controller("kieuDeController", function ($http, $scope, $location) {
    $scope.listKieuDe = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedKieuDe = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function kieuDeList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/kieu-de/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenKieuDe=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listKieuDe = response.data;
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
            kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchKieuDeDetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/kieu-de/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedKieuDe = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedKieuDe);
            if ($scope.selectedKieuDe.trangThai === 1) {
                $scope.selectedKieuDe.trangThai = "1";
            } else {
                $scope.selectedKieuDe.trangThai = "2";
            }
            $scope.selectedKieuDe.kieuDeId = id;

        });
    }

    $scope.updateKieuDe = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/kieu-de/update?id=" + $scope.selectedKieuDe.kieuDeId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newKieuDe = {};
    $scope.createKieuDe = function () {
        $http.post("http://localhost:8080/api/v1/kieu-de/create", $scope.newKieuDe)
            .then(function (response) {
                $scope.listKieuDe.push(response.data);
                kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteKieuDe = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/kieu-de/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa chất liệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
            });
    };

    $scope.fetchKieuDeDetail = function (id) {
        fetchKieuDeDetail(id);
    };

    $scope.onTrangThaiChange = function () {
        kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchKieuDe = function () {
        kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        kieuDeList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
