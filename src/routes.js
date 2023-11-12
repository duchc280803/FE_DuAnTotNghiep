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
    })
    .when("/voucher/create", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
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
      controller: "sanPhamShopController"
    }).when("/tai-khoan", {
      templateUrl: "./pages/khach-hang.html",
    })
    .when("/shop/detail/:name", {
      templateUrl: "./pages/shop-details.html",
      controller: "sanPhamShopDetailController"
    })

    .when("/cart", {
      templateUrl: "./pages/shoping-cart.html",
    })
    .when("/proudct-new", {
      templateUrl: "./pages/san-pham-new.html",
    })
    .when("/proudct-update", {
      templateUrl: "./pages/san-pham-update.html",
    }).
    when("/thank-you", {
      templateUrl: "./pages/shoping-cart.html",
    })
    .when("/dia-chi", {
      templateUrl: "./pages/dia-chi.html",
    })
    .when("/don-hang", {
      templateUrl: "./pages/don-hang.html",
    })
    .when("/xuat-xu", {
      templateUrl: "./pages/xuat-xu.html",
      controller: "xuatXuController"
    })
    .when("/thuong-hieu", {
      templateUrl: "./pages/thuong-hieu.html",
      controller: "thuongHieuController"
    })
    .when("/size", {
      templateUrl: "./pages/size.html",
      controller: "sizeController"
    })
    .when("/mau-sac", {
      templateUrl: "./pages/mau-sac.html",
      controller: "mauSacController"
    })
    .when("/kieu-de", {
      templateUrl: "./pages/kieu-de.html",
      controller: "kieuDeController"
    })
    .when("/chat-lieu", {
      templateUrl: "./pages/chat-lieu.html",
      controller: "chatLieuController"
    })
    .when("/danh-muc", {
      templateUrl: "./pages/danh-muc.html",
      controller: "danhMucController"
    })
    .otherwise({
      redirectTo: "/home",
    });
});
