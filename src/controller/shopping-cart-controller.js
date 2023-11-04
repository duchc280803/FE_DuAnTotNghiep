var app = angular.module('myApp', []);
app.controller('CartController', function ($scope, $http, $window) {
    function loadToTals() {
        // Gọi API và cập nhật giá trị totalAmount
        $http.get("http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=416941F8-150F-4C14-AEF8-03864A892471")
            .then(function (response) {
                // Lấy giá trị tổng tiền từ phản hồi API
                $scope.totalAmount = response.data[0].tongSoTien;
                $window.localStorage.setItem("totalAmount", $scope.totalAmount);
            })
            .catch(function (error) {
                console.error("Lỗi khi gọi API: " + error);
            });
    }
    loadToTals();
    // Hàm thay đổi số lượng sản phẩm
    $scope.changeQuantity = function (product, change) {
        if (change === 'increase') {
            product.soluong++;
        } else if (change === 'decrease' && product.soluong > 1) {
            product.soluong--;
        }
        // Gọi API để cập nhật số lượng
        console.log(product.id)
        console.log(product.soluong)
        updateQuantity(product.id, product.soluong);
    };

    // Hàm gọi API cập nhật số lượng
    function updateQuantity(productId, newQuantity) {
        var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/update-quantity?idgiohangchitiet=' + productId + '&quantity=' + newQuantity;

        $http({
            url: apiURL,
            method: 'PUT',
            transformResponse: [
                function () {
                    loadCart();
                    loadToTals();
                    loadNameAndPrice();
                }
            ]
        });
    }

    //delete product
    $scope.deleteProduct = function (productId) {
        var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=' + productId;

        $http({
            url: apiURL,
            method: 'DELETE',
            transformResponse: [
                function () {
                    loadCart();
                }
            ]
        });
    }

    //delete all product
    $scope.clearCart = function () {
        Swal.fire({
            title: "Xác nhận xóa?",
            text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-tat-ca-san-pham?idGioHang=' + '416941F8-150F-4C14-AEF8-03864A892471';

                $http({
                    url: apiURL,
                    method: 'DELETE',
                    transformResponse: [
                        function () {
                            loadCart();
                        }
                    ]
                });
            }
        });
    }

    function loadCart() {
        // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
        var idgh = '416941F8-150F-4C14-AEF8-03864A892471';
        var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=' + idgh;

        $http.get(apiURL)
            .then(function (response) {
                $scope.products = response.data; // Dữ liệu sản phẩm từ API
                $window.localStorage.setItem(
                    "listCart",
                    $scope.products.map((item) => item.id)
                );
            });

    }
    loadCart();
    // Gọi API và cập nhật danh sách sản phẩm và tổng tiền
    function loadNameAndPrice() {
        $http.get("http://localhost:8080/api/gio-hang-chi-tiet-not-login/name-quantity?idgh=416941F8-150F-4C14-AEF8-03864A892471")
            .then(function (response) {
                $scope.items = response.data;

                // Tính tổng tiền sản phẩm
                $scope.totalAmount = 0;
                for (var i = 0; i < $scope.items.length; i++) {
                    $scope.totalAmount += parseFloat($scope.items[i].tongTien);
                }
            })
            .catch(function (error) {
                console.error("Lỗi khi gọi API: " + error);
            });
    }
    loadNameAndPrice();
    // Khai báo biến để lưu các giá trị đã binding
    $scope.hoTen = "";
    $scope.soDienThoai = "";
    $scope.email = "";
    $scope.diaChi = "";
    $scope.thanhPho = "";
    $scope.quanHuyen = "";
    $scope.phuongXa = "";
    $scope.tongTien = 0; // Để tránh lỗi nếu không có giá trị tổng tiền
    $scope.tienKhachTra = 0; // Để tránh lỗi nếu không có giá trị tiền khách trả
    $scope.gioHangChiTietList = $scope.gioHangChiTietList

    var idGioHangChiTiet = $window.localStorage.getItem("listCart");
    var gioHangChiTietList = idGioHangChiTiet.split(",");
    console.log(gioHangChiTietList);

    // Lấy giá trị tổng tiền từ localStorage
    var totalAmount = parseFloat($window.localStorage.getItem("totalAmount"));

    // Hàm xử lý khi người dùng click nút "Đặt Hàng"
    $scope.thanhToan = function () {
        // Hiển thị Sweet Alert để xác nhận
        Swal.fire({
            title: "Xác nhận thanh toán?",
            text: "Bạn có chắc chắn muốn thanh toán đơn hàng?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Thanh toán",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (result.isConfirmed) {
                // Nếu người dùng xác nhận thanh toán, tiến hành gửi dữ liệu lên server
                var data = {
                    "hoTen": $scope.hoTen,
                    "soDienThoai": $scope.soDienThoai,
                    "email": $scope.email,
                    "diaChi": $scope.diaChi,
                    "thanhPho": $scope.thanhPho,
                    "quanHuyen": $scope.quanHuyen,
                    "phuongXa": $scope.phuongXa,
                    "tongTien": totalAmount,
                    "tienKhachTra": $scope.tienKhachTra,
                    "gioHangChiTietList": gioHangChiTietList
                };

                // Gửi dữ liệu POST đến server
                $http({
                    method: 'POST',
                    url: 'http://localhost:8080/api/checkout-not-login/thanh-toan',
                    data: data
                }).then(function (response) {
                    // Xử lý phản hồi từ máy chủ nếu cần
                    $window.location.href = 'thankyou.html';
                }, function (error) {
                    // Xử lý lỗi nếu có
                });
            }
        });
    };


});