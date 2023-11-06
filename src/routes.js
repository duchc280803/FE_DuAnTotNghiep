myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/dashboard", {
      templateUrl: "./pages/dashboard.html",
    })
    .when("/order-counter", {
      templateUrl: "./pages/don-tai-quay.html",
      controller: "orderCounterController",
    })
    .when("/order-counter/carts/:id", {
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
    .when("/giam-gia", {
      templateUrl: "./pages/voucher-hoa-don.html",
    })
    .when("/giam-gia/create", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
    })
    .when("/home", {
      templateUrl: "./pages/home.html",
    })
    .when("/shop", {
      templateUrl: "./pages/shop-grid.html",
      controller: "sanPhamGiamGiaController"
    })
    .when("/shop/detail/:name", {
      templateUrl: "./pages/shop-details.html",
      controller: "sanPhamGiamGiaController"
    })
    .when("/cart", {
      templateUrl: "./pages/shoping-cart.html",
    }).otherwise({
      redirectTo: "/dashboard",
    });
});
