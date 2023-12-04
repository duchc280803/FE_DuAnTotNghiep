myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/dashboard", {
      templateUrl: "./pages/thong-ke.html",
      controller: "thongKeController",
    })
    .when("/admin/login", {
      templateUrl: "./pages/authentication-login.html",
      controller: "loginController",
    })
    .when("/order-counter", {
      templateUrl: "./pages/bantaiquay.html",
      controller: "BanTaiQuayController",
    })
    .when("/order", {
      templateUrl: "./pages/thuchi.html",
      controller: "hoaDonController",
    })
    .when("/order-detail/:id", {
      templateUrl: "./pages/chi-tiet-hoa-don.html",
      controller: "hoaDonChiTietController",
    })
    .when("/promotion", {
      templateUrl: "./pages/khuyen-mai-sp.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/create", {
      templateUrl: "./pages/create-giam-gia-san-pham.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/history", {
      templateUrl: "./pages/history-giam-gia-san-pham.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/product", {
      templateUrl: "./pages/san-pham-khuyen-mai.html",
      controller: "GiamGiaController",
    })
    .when("/promotion/update/:id", {
      templateUrl: "./pages/update-giam-gia-sanpham.html",
      controller: "giamgiaChiTietController",
    })
    .when("/voucher", {
      templateUrl: "./pages/voucher-hoa-don.html",
      controller: "VoucherController",
    })
    .when("/voucher/create", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
      controller: "VoucherController",
    })
    .when("/voucher/update/:id", {
      templateUrl: "./pages/update-chuong-trinhkm.html",
      controller: "voucherChiTietController",
    })
    .when("/voucher/history", {
      templateUrl: "./pages/voucher-history.html",
      controller: "VoucherController",
    })
    .when("/customer", {
      templateUrl: "./pages/khach-hang.html",
      controller: "khachHangController",
    })
    .when("/staff", {
      templateUrl: "./pages/nhan-vien.html",
      controller: "nhanVienController",
    })
    .when("/product/create", {
      templateUrl: "./pages/san-pham-new.html",
      controller: "sanPhamController",
    })
    .when("/product/history", {
      templateUrl: "./pages/san-pham-history.html",
      controller: "sanPhamController",
    })
    .when("/product-detail/:id", {
      templateUrl: "./pages/sanphamchitiet.html",
      controller: "sanPhamChiTietController",
    })
    .when("/product", {
      templateUrl: "./pages/san-pham.html",
      controller: "sanPhamController",
    })
    .when("/product-update/:id", {
      templateUrl: "./pages/san-pham-update.html",
      controller: "sanPhamUpdateController",
    })
    .when("/origin", {
      templateUrl: "./pages/xuat-xu.html",
      controller: "xuatXuController",
    })
    .when("/origin/history", {
      templateUrl: "./pages/xuat-xu-history.html",
      controller: "xuatXuController",
    })
    .when("/brand", {
      templateUrl: "./pages/thuong-hieu.html",
      controller: "thuongHieuController",
    })
    .when("/brand/history", {
      templateUrl: "./pages/thuong-hieu-history.html",
      controller: "thuongHieuController",
    })
    .when("/size", {
      templateUrl: "./pages/size.html",
      controller: "sizeController",
    })
    .when("/size/history", {
      templateUrl: "./pages/size-history.html",
      controller: "sizeController",
    })
    .when("/color", {
      templateUrl: "./pages/mau-sac.html",
      controller: "mauSacController",
    })
    .when("/color/history", {
      templateUrl: "./pages/mau-sac-history.html",
      controller: "mauSacController",
    })
    .when("/sole", {
      templateUrl: "./pages/kieu-de.html",
      controller: "kieuDeController",
    })
    .when("/sole/history", {
      templateUrl: "./pages/kieu-de-history.html",
      controller: "kieuDeController",
    })
    .when("/material", {
      templateUrl: "./pages/chat-lieu.html",
      controller: "chatLieuController",
    })
    .when("/material/history", {
      templateUrl: "./pages/chat-lieu-history.html",
      controller: "chatLieuController",
    })
    .when("/category", {
      templateUrl: "./pages/danh-muc.html",
      controller: "danhMucController",
    })
    .when("/category/history", {
      templateUrl: "./pages/danh-muc-history.html",
      controller: "danhMucController",
    })
    .when("/transaction-done", {
      templateUrl: "./pages/vnpay-done.html",
      controller: "BanTaiQuayController",
    })
    .when("/hoa-don-history", {
      templateUrl: "./pages/hoa-don-history.html",
      controller: "hoaDonController",
    })
    .otherwise({
      redirectTo: "/dashboard",
    });
});
