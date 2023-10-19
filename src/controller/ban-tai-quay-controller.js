myApp.controller("BanTaiQuayController", function ($scope, $http, $window) {
  $scope.selectedKhachHang = {};
  $scope.listHoaDonTaiQuay = [];
  $scope.listCart = [];
  $scope.tongSoLuongSanPham = 0;
  $scope.tongTienHang = 0;
  $scope.tienKhachDua = 0;
  $scope.tienThua = 0;
  $scope.luuSoLuong = 1;
  $scope.idSanPhamChiTiet = 0;
  $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng


  $scope.selectedProductQuantity = function (quantity, id) {
    $scope.luuSoLuong = quantity;
    $scope.idSanPhamChiTiet = id;
    console.log(id);
  };

  // TODO: SHOW HÓA ĐƠN THEO ID
  $scope.showHoaDonTheoId = function (id) {
    $window.localStorage.setItem("idHoaDon", id);
    if ($scope.listHoaDonTaiQuay.length === 0) {
      $window.localStorage.removeItem("idHoaDon");
    }
    $http
      .get("http://localhost:8080/api/khach-hang/search_khach_byid?id=" + id)
      .then(function (response) {
        $scope.selectedKhachHang = response.data;
        $window.localStorage.setItem("ten", $scope.selectedKhachHang.ten);
      });
    $scope.listSanPhamInCart();
    $scope.calculateChange();
  };

  // TODO: show sản phẩm trong giỏ hảng
  $scope.listSanPhamInCart = function () {
    var ten = $window.localStorage.getItem("ten");
    $http
      .get("http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?name=" + ten)
      .then(function (response) {
        $scope.listCart = response.data;
        $window.localStorage.setItem('cart', $scope.listCart[0].idGioHang);
        // Tính tổng số lượng sản phẩm
        $scope.tongSoLuongSanPham = 0;
        for (var i = 0; i < $scope.listCart.length; i++) {
          $scope.tongSoLuongSanPham += $scope.listCart[i].soLuong;
          $scope.tongTienHang +=
            $scope.listCart[i].giaBan * $scope.listCart[i].soLuong;
        }
      });
  };

  var cart = $window.localStorage.getItem("cart");

  $scope.calculateChange = function () {
    $scope.tienThua = $scope.tienKhachDua - $scope.tongTienHang;
  };

  var idHoaDon = $window.localStorage.getItem("idHoaDon");
  if (idHoaDon) {
    $scope.showHoaDonTheoId(idHoaDon);
  }

  //TODO: Get all hoa đơn tại quầy
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
      alert("Tối đa chỉ được 5 hóa đơn");
      return;
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

  $scope.taoHoaDonAndCart = function() {
    $scope.createHoaDon();
    $scope.createGioHang();
  }

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

  // TODO: Tìm kiếm sản phẩm
  $scope.keyName = "";
  $scope.searchSanPham = function () {
    $http
      .get("http://localhost:8080/api/chi-tiet-sp?name=" + $scope.keyName)
      .then(function (response) {
        $scope.listSanPhamTaiQuay = response.data;
      });
  };

  // thêm sản phẩm vào giỏ hàng
  $scope.themSanPhamCart = function (idSanPhamChiTiet) {
    $http
      .post(
        "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
          cart +
          "&idSanPhamChiTiet=" +
          idSanPhamChiTiet +
          "&soLuong=" +
          $scope.soLuongSanPham,
        {}
      )
      .then(function (response) {
        $scope.listCart = response.data;
        $scope.listSanPhamInCart();
      });
  };

  // cập nhập sản phẩm trong giỏ hàng
  $scope.updateCart = function (idGioHangChiTiet) {
    $http
      .put(
        "http://localhost:8080/api/gio-hang-chi-tiet/update-quantity?idgiohangchitiet=" +
          $scope.listCart.idGioHang +
          idGioHangChiTiet +
          "&quantity=" +
          $scope.soLuongSanPham,
        {}
      )
      .then(function (response) {
        $scope.listSanPhamInCart();
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

  $scope.detailKhacHang = function (id) {
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
    $scope.getIdHoaDon = $window.localStorage.getItem("idHoaDon");
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
    $http
      .post("http://localhost:8080/api/gio-hang/tao-gio-hang", {})
      .then(function (response) {
        $scope.listCart.push(response.data);
        $window.localStorage.setItem('idCartNew', $scope.listCart);
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

  $scope.viewKhachAndUpdateHoaDon = function (id) {
    $scope.updateKhachHang(id);
    $scope.detailKhacHang(id);
  };
});
