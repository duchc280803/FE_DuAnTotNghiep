myApp.controller("chatLieuController", function ($http, $scope, $location) {
    $scope.listChatLieu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedChatLieu = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;

    function chatLieuList(trangThai, pageNumber) {
        var url = `http://localhost:8080/api/v1/chat-lieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

        if ($scope.searchQuery) {
            url += `&tenChatLieu=${$scope.searchQuery}`;
        }

        $http.get(url).then(function (response) {
            $scope.listChatLieu = response.data;
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
            chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
        }
    };

    $scope.nextPage = function () {
        $scope.pageNumber++;
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchChatLieuDetail(id) {
        var detailUrl = "http://localhost:8080/api/v1/chat-lieu/detail?id=" + id;
        $http.get(detailUrl).then(function (response) {
            $scope.selectedChatLieu = response.data;
            console.log("Thông tin chi tiết: ", $scope.selectedChatLieu);
            if ($scope.selectedChatLieu.trangThai === 1) {
                $scope.selectedChatLieu.trangThai = "2";
            } else {
                $scope.selectedChatLieu.trangThai = "1";
            }
            $scope.selectedChatLieu.chatLieuId = id;

        });
    }

    $scope.updateChatLieu = function (updatedData) {
        var updateUrl = "http://localhost:8080/api/v1/chat-lieu/update?id=" + $scope.selectedChatLieu.chatLieuId;

        $http.put(updateUrl, updatedData).then(function (response) {
            console.log("Cập nhật thông tin thành công: ", response.data);

            chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
        }).catch(function (error) {
            console.error("Lỗi khi cập nhật thông tin: ", error);
        });
    };

    $scope.newChatLieu = {};
    $scope.createChatLieu = function () {
        $http.post("http://localhost:8080/api/v1/chat-lieu/create", $scope.newChatLieu)
            .then(function (response) {
                $scope.listChatLieu.push(response.data);
                chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
            });
    };

    $scope.deleteChatLieu = function (id) {
        var deleteUrl = "http://localhost:8080/api/v1/chat-lieu/delete?id=" + id;

        $http.put(deleteUrl)
            .then(function (response) {
                console.log("Xóa chất liệu thành công: ", response.data);

                // Sau khi xóa thành công, làm mới danh sách hoặc thực hiện các bước cần thiết khác
                chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
            })
            .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
            });
    };

    $scope.fetchChatLieuDetail = function (id) {
        fetchChatLieuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchChatLieu = function () {
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
        $scope.searchQuery = "";
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
        chatLieuList(id);
    } else {
        $scope.onTrangThaiChange();
    }
});
