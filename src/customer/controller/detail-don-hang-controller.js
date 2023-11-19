myAppCustom.controller("detailDonHangController", function ($http, $scope, $window, $routeParams) {
    $scope.listThongTin = [];
    $scope.listTrangThai = [];
    $scope.listSanPham = [];
    $scope.thanhTien = [];
    var idHoaDon = $routeParams.idHoaDon;

    function getThongTin() {
        var token = $window.localStorage.getItem("token");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var url = "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-don/" + idHoaDon;

        $http.get(url, config)
            .then(function (response) {
                $scope.listThongTin = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching don hang data:", error);
            });
    }

    function getTrangThai() {

        var url = "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-trang-thai/" + idHoaDon;

        $http.get(url)
            .then(function (response) {
                $scope.listTrangThai = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching don hang data:", error);
            });
    }

    function getSanPham() {
        var token = $window.localStorage.getItem("token");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var url = "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/hien-thi-san-pham/" + idHoaDon;

        $http.get(url, config)
            .then(function (response) {
                $scope.listSanPham = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching don hang data:", error);
            });
    }

    function getThanhTien() {

        var url = "http://localhost:8080/api/v1/don-hang-khach-hang-chi-tiet/thanh-tien/" + idHoaDon;

        $http.get(url)
            .then(function (response) {
                $scope.thanhTien = response.data;
            })
            .catch(function (error) {
                console.error("Error fetching don hang data:", error);
            });
    }

    // Gọi hàm getDonHang khi controller được khởi tạo
    getThongTin();
    getTrangThai();
    getSanPham();
    getThanhTien();
});
