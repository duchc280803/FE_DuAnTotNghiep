myApp.controller("BanTaiQuayController", function ($scope, $http, $window) {
  // TODO: SHOW HÓA ĐƠN THEO ID
  $scope.getIdHoaDon = null;
  $scope.showHoaDonTheoId = function (id) {
    $window.localStorage.setItem("idHoaDon", id);
    var idHoaDon = $window.localStorage.getItem("idHoaDon");
  };
  // TODO: SHOW HÓA ĐƠN THEO ID

  //TODO: Get all hoa đơn tại quầy
  $scope.listHoaDonTaiQuay = [];

  $scope.getListHoaDonTaiQuay = function () {
    $http
      .get("http://localhost:8080/api/v1/hoa-don/show")
      .then(function (response) {
        $scope.listHoaDonTaiQuay = response.data;
      });
  };

  $scope.getListHoaDonTaiQuay();

  //TODO: Tạo hóa đơn
  $scope.createHoaDon = function () {
    if ($scope.listHoaDonTaiQuay.length >= 5) {
      alert('Tối đa chỉ được 5 hóa đơn');
      return; // Dừng hàm
    }
    var token = $window.localStorage.getItem("token");
    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    var api = "http://localhost:8080/api/v1/hoa-don/create";
    $http.post(api, {}, config).then(function (response) {
      $scope.listHoaDonTaiQuay.push(response.data);
      $scope.getListHoaDonTaiQuay();
    });
  };

  $scope.createHoaDonAndGioHang = function () {
    $scope.createHoaDon();
    $scope.createGioHang();
  };

  // TODO: Get ALL sản phẩm tại quầy
  $scope.listSanPhamTaiQuay = [];

  $scope.getListSanPhamTaiQuay = function () {
    $http
      .get("http://localhost:8080/api/chi-tiet-sp/hien-thi")
      .then(function (response) {
        $scope.listSanPhamTaiQuay = response.data;
      });
  };

  $scope.getListSanPhamTaiQuay();
  // TODO: get one sản phẩm tại quầy
  $scope.showGetOneProduct = function (id) {
    console.log(id);
    $http
      .get("http://localhost:8080/api/chi-tiet-sp/san-pham/" + id)
      .then(function (response) {
        $scope.listSanPhamTaiQuay = response.data;
        console.log();
      });
  };

  // TODO: get detail sản phẩm tại quầy
  $scope.listDetailSP = [];
  $scope.showProductDetail = function (id) {
    console.log(id);
    $http
      .get("http://localhost:8080/api/chi-tiet-sp/san-pham-detail/" + id)
      .then(function (response) {
        $scope.listDetailSP = response.data;
      });
  };

  $scope.fullDEtail = function (id) {
    $scope.showGetOneProduct(id);
    $scope.showProductDetail(id);
  };

  // TODO: get detail sản phẩm lấy số lượng theo id và size
  $scope.keyId = "";
  $scope.keySize = "";
  $scope.getSoLuong = {};

  $scope.showSoLuongBySize = function (size, id) {
    // Thay đổi đối số từ id thành size
    $scope.keySize = size; // Cập nhật keySize với kích cỡ được chọn
    $scope.keyId = id;
    $http
      .get(
        "http://localhost:8080/api/chi-tiet-sp/san-pham-detail-soluong?id=" +
          $scope.keyId +
          "&size=" +
          $scope.keySize
      )
      .then(function (response) {
        $scope.getSoLuong = response.data;
      });
  };

  // TODO: Tìm kiếm sản phẩm
  $scope.keyName = "";
  $scope.searchSanPham = function () {
    $http
      .get("http://localhost:8080/api/chi-tiet-sp?name=" + $scope.keyName)
      .then(function (response) {
        $scope.listSanPhamTaiQuay = response.data;
      });
  };

  // TODO: Hiển thị sản phẩm cố trong giỏ hàng
  $scope.listCart = [];
  $scope.showProductCart = function (idgh) {
    $http
      .get("http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?idgh=" + idgh)
      .then(function (response) {
        $scope.listCart = response.data;
      });
  };

  // TODO: Hiển thị khách hàng
  $scope.listKhachHang = [];
  $scope.showKhachHang = function () {
    $http
      .get("http://localhost:8080/api/khach-hang/hien-thi")
      .then(function (response) {
        $scope.listKhachHang = response.data;
      });
  };
  $scope.showKhachHang();

  // TODO: Hiển thị detail khách hàng
  $scope.selectedKhachHang = {};

  $scope.detailKhacHang = function (id, idHoaDon) {
    $http
      .get(
        "http://localhost:8080/api/khach-hang/detail?id=" +
          id +
          "&idHoaDon=" +
          idHoaDon
      )
      .then(function (response) {
        $scope.selectedKhachHang = response.data;
      });
  };
  // TODO: Hiển thị detail khách hàng
  $scope.searchKeyword = "";

  $scope.searchKhach = function () {
    $http
      .get(
        "http://localhost:8080/api/khach-hang/search?key=" +
          $scope.searchKeyword
      )
      .then(function (response) {
        $scope.listKhachHang = response.data;
      });
  };

  // update khách hàng vào hóa đơn
  $scope.updateKhachHang = function (idkhach) {
    $http
      .put(
        "http://localhost:8080/api/khach-hang/update-hoa-don?id= " +
          idkhach +
          "&idHoaDon=" +
          $scope.getIdHoaDon
      )
      .then(function (response) {});
  };

  // TODO: thêm khách hàng
  $scope.newKhachHang = {};
  $scope.createKhahHang = function () {
    $http
      .post("http://localhost:8080/api/khach-hang/create", $scope.newKhachHang)
      .then(function (response) {
        $scope.listKhachHang.push(response.data);
        $scope.selectedKhachHang = response.data;
      });
  };

  // TODO: tạo giỏ hàng
  $scope.listCart = [];
  $scope.getIdCart = "";

  $scope.createGioHang = function () {
    var token = $window.localStorage.getItem("token"); // Lấy token từ local storage

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .post("http://localhost:8080/api/gio-hang/tao-gio-hang", {}, config)
      .then(function (response) {
        $scope.listCart.push(response.data);
        $window.localStorage.setItem("idCart", response.data);
      });
  };

  // update khách hàng vào hóa đơn
  $scope.updateGioHangKhach = function (idkhach) {
    var idCart = $window.localStorage.getItem("idCart");
    $http
      .put(
        "http://localhost:8080/api/gio-hang/update?idGioHang= " +
          idCart +
          "&idKhachHang=" +
          idkhach
      )
      .then(function (response) {});
  };

  $scope.viewKhachAndCreateCart = function (id) {
    $scope.updateKhachHang(id);
    $scope.detailKhacHang(id);
    $scope.updateGioHangKhach(id);
  };
});
