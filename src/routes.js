myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/dashboard", {
      templateUrl: "./pages/dashboard.html",
    })
    .when("/order-counter", {
      templateUrl: "./pages/bantaiquay.html",
      controller: "BanTaiQuayController",
    })
    .when("/hoa-don", {
      templateUrl: "./pages/thuchi.html",
      controller: "hoaDonController",
    })
    .when("/chi-tiet-hoa-don/:id", {
      templateUrl: "./pages/chi-tiet-hoa-don.html",
      controller: "hoaDonChiTietController",
    })
    .when("/khuyen-mai", {
      templateUrl: "./pages/khuyen-mai-sp.html",
      controller: "GiamGiaController",
    })
    .when("/khuyen-mai/create", {
      templateUrl: "./pages/create-giam-gia-san-pham.html",
      controller: "GiamGiaController",
    })
    .when("/khuyen-mai/update", {
      templateUrl: "./pages/update-giam-gia-sanpham.html",
      controller: "GiamGiaController",
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
    
    .when("/khach-hang", {
      templateUrl: "./pages/khach-hang.html",
    })
    .when("/nhan-vien", {
      templateUrl: "./pages/nhan-vien.html",
    })
    .when("/home", {
      templateUrl: "./pages/home.html",
    })
    .when("/shop", {
      templateUrl: "./pages/shop-grid.html",
      controller: "sanPhamShopController",
    })
    .when("/tai-khoan", {
      templateUrl: "./pages/khach-hang.html",
    })
    .when("/shop/detail/:name", {
      templateUrl: "./pages/shop-details.html",
      controller: "sanPhamShopDetailController",
    })
    .when("/cart", {
      templateUrl: "./pages/shoping-cart.html",
    })
    .when("/proudct-new", {
      templateUrl: "./pages/san-pham-new.html",
    })
    .when("/proudct-update", {
      templateUrl: "./pages/san-pham-update.html",
    })
    .when("/thank-you", {
      templateUrl: "./pages/thank-you.html",
    })
    .when("/dia-chi", {
      templateUrl: "./pages/dia-chi.html",
    })
    .when("/don-hang", {
      templateUrl: "./pages/don-hang.html",
    })
    .when("/the-loai", {
      templateUrl: "./pages/the-loai.html",
    })
    .when("/xuat-xu", {
      templateUrl: "./pages/xuat-xu.html",
    })
    .when("/thuong-hieu", {
      templateUrl: "./pages/thuong-hieu.html",
    })
    .when("/size", {
      templateUrl: "./pages/size.html",
    })
    .when("/mau-sac", {
      templateUrl: "./pages/mau-sac.html",
    })
    .when("/kieu-de", {
      templateUrl: "./pages/kieu-de.html",
    })
    .when("/chat-lieu", {
      templateUrl: "./pages/chat-lieu.html",
    })
    .when("/danh-muc", {
      templateUrl: "./pages/danh-muc.html",
    })
    .when("/don-hang-chi-tiet", {
      templateUrl: "./pages/detail-don-hang.html",
    })
    .otherwise({
      redirectTo: "/home",
    });
});
