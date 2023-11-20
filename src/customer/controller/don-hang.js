myAppCustom.controller("donHangController", function ($http, $scope, $window, $routeParams) {
    $scope.listDonHang = [];
    $scope.listDonHang2 = [];
    // $scope.listDonHang3 = [];
    // $scope.listDonHang4 = [];
    // $scope.listDonHang5 = [];
    // $scope.listDonHang6 = [];
    // $scope.listDonHang7 = [];
    // $scope.listDonHang8 = [];

    var token = $window.localStorage.getItem("token");
    var config = {
        headers: {
            Authorization: "Bearer " + token,
        },
    };


    function getDonHang() {

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

    $scope.loadDonHang = function (trangThai) {
        // Gọi API với trạng thái mới
        $http.get(`http://localhost:8080/api/v1/don-hang-khach-hang/filter?trangthai=${trangThai}`, config)
            .then(function (response) {
                $scope.listDonHang2 = response.data;
            })
            .catch(function (error) {
                console.error('Error fetching data:', error);
            });
    };
    $scope.searchQuery = ''; // Initialize search query

    $scope.searchOrders = function () {
        // Call the API with the search query
        // You might need to inject $http service in your controller
        var token = $window.localStorage.getItem("token");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        $http.get('http://localhost:8080/api/v1/don-hang-khach-hang/search', {
            params: {
                tensanpham: $scope.searchQuery,
                mahoadon: $scope.searchQuery // Set the default mahoadon value or modify as needed
            },
            ...config // Spread the config object here
        }).then(function (response) {
            $scope.listDonHang = response.data;
        }).catch(function (error) {
            console.error('Error fetching orders:', error);
        });
    };


});
