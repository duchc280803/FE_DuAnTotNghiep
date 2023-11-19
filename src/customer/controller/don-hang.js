myAppCustom.controller("donHangController", function ($http, $scope, $window, $routeParams) {
    $scope.listDonHang = [];

    function getDonHang() {
        var token = $window.localStorage.getItem("token");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var url = "http://localhost:8080/api/v1/don-hang-khach-hang/hien-thi";

        $http.get(url, config)
            .then(function (response) {
                $scope.listDonHang = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching don hang data:", error);
            });
    }

    // Gọi hàm getDonHang khi controller được khởi tạo
    getDonHang();
});
