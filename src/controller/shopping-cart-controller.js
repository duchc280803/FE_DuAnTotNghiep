var app = angular.module('myApp', []);
app.controller('CartController', function ($scope, $http) {
     function loadToTals() {
           // Gọi API và cập nhật giá trị totalAmount
           $http.get("http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=DB9FDBFD-2BF8-4F9B-A567-8415ED68A02E")
           .then(function (response) {
               // Lấy giá trị tổng tiền từ phản hồi API
               $scope.totalAmount = response.data[0].tongSoTien;
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
            url : apiURL,
            method : 'PUT',
            transformResponse: [
                function () { 
                   loadCart();
                   loadToTals();
                }
            ]
        });
    }

    //delete product
    $scope.deleteProduct = function (productId) {
        var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=' + productId;

        $http({
            url : apiURL,
            method : 'DELETE',
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
                    var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-tat-ca-san-pham?idGioHang=' + 'DB9FDBFD-2BF8-4F9B-A567-8415ED68A02E';
    
                    $http({
                        url : apiURL,
                        method : 'DELETE',
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
        var idgh = 'DB9FDBFD-2BF8-4F9B-A567-8415ED68A02E';
        var apiURL = 'http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=' + idgh;

        $http.get(apiURL)
            .then(function (response) {
                $scope.products = response.data; // Dữ liệu sản phẩm từ API
            });
    }
    loadCart();

});