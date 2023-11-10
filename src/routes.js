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
    .when("/the-loai", {
      templateUrl: "./pages/the-loai.html",
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
    .otherwise({
      redirectTo: "/home",
    });
});
