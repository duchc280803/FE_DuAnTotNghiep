myApp.controller("mauSacController", function ($http, $scope, $location) {
    $scope.listMauSac = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedMauSac = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function mauSacList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/mau-sac/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenMauSac=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listMauSac = response.data;
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
            mauSacList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchMauSacdetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/mau-sac/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedMauSac = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedMauSac);
            if ($scope.selectedMauSac.trangThai === 1) {
                $scope.selectedMauSac.trangThai = "1";
            } else {
                $scope.selectedMauSac.trangThai = "2";
            }
            $scope.selectedMauSac.mauSacId = id;

        });
    }

    $scope.updateMauSac = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/mau-sac/update?id=" + $scope.selectedMauSac.mauSacId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            mauSacList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newMauSac = {};
    $scope.createMauSac = function () {
        $http.post("http://localhost:8080/api/v1/mau-sac/create", $scope.newMauSac)
            .then(function (response) {
                $scope.listMauSac.push(response.data);
                mauSacList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteMauSac = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/mau-sac/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa chất liệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                mauSacList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
            });
    };

    $scope.fetchMauSacdetail = function (id) {
        fetchMauSacdetail(id);
    };

    $scope.onTrangThaiChange = function () {
        mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchMauSac = function () {
        mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        mauSacList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        mauSacList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
