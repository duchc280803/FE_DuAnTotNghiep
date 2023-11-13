var idgh = localStorage.getItem('idgiohang');
myApp.controller("sanPhamShopController", function ($http, $scope,$window) {
  var token = $window.localStorage.getItem("token");
  console.log(token);
  $scope.listSanPhamShop = [];
  $scope.listThuongHieu = [];
  $scope.listDanhMuc = [];
  $scope.listSize = [];

  $scope.listSanPhamGiamGia = function () {
    $http
      .get("http://localhost:8080/api/v1/san-pham-giam-gia/show")
      .then(function (response) {
        $scope.listSanPhamShop = response.data;
      });
  };
  $scope.listSanPhamGiamGia();

  $scope.getlistCategory = function () {
    $http
      .get("http://localhost:8080/api/v1/danh-muc/show")
      .then(function (response) {
        $scope.listDanhMuc = response.data;
      });
  };
  $scope.getlistCategory();

  $scope.listKieuDe = [];
    $scope.getListKieuDe = function () {
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.getListKieuDe();

  // TODO: Lấy ra tất cả bản ghi của thương hiệu
  $scope.listThuongHieu = [];
  $scope.getListThuongHieu = function () {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  };
  $scope.getListThuongHieu();

  $scope.listXuatXu = [];
  $scope.getListXuatXu = function () {
    $http
      .get("http://localhost:8080/api/v1/xuat-xu/show")
      .then(function (response) {
        $scope.listXuatXu = response.data;
      });
  };
  $scope.getListXuatXu();

  function loadCart() {
    // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
    var apiURL =
      "http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=" +
      idgh;

    $http.get(apiURL).then(function (response) {
      $scope.products = response.data; // Dữ liệu sản phẩm từ API
      $window.localStorage.setItem(
        "listCart",
        $scope.products.map((item) => item.id)
      );
    });
  }
  loadCart();
    //delete product
    $scope.deleteProduct = function (productId) {
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=" +
        productId;
  
      $http({
        url: apiURL,
        method: "DELETE",
        transformResponse: [
          function () {
            Swal.fire({
              title: "Success",
              text: "Xóa thành công",
              icon: "success",
              position: "bottom-start", // Đặt vị trí ở góc trái
              toast: true, // Hiển thị thông báo nhỏ
              showConfirmButton: false, // Ẩn nút xác nhận
              timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            loadCart();
            loadToTals();
            loadNameAndPrice();
          },
        ],
      });
    };
    function loadToTals() {
      // Gọi API và cập nhật giá trị totalAmount
  
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" + idgh
        )
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

    function loadQuanTiTy() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
        idgh;
  
      $http.get(apiURL).then(function (response) {
        $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API
        console.log($scope.quantity_all)
      });
    }

    loadQuanTiTy();
});
