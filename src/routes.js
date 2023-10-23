myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/dashboard", {
      templateUrl: "./pages/dashboard.html",
    })
    .when("/ban-tai-quay", {
      templateUrl: "./pages/bantaiquay.html",
      controller: "BanTaiQuayController",
    })
    .when("/hoa-don", {
      templateUrl: "./pages/thuchi.html",
      controller: "hoaDonController",
    })
    .when("/chi-tiet-hoa-don", {
      templateUrl: "./pages/chi-tiet-hoa-don.html",
    })
    .when("/khuyen-mai", {
      templateUrl: "./pages/khuyen-mai-sp.html",
    })
    .when("/khuyen-mai/create", {
      templateUrl: "./pages/create-giam-gia-san-pham.html",
    })
    .when("/giam-gia", {
      templateUrl: "./pages/voucher-hoa-don.html",
    })
    .when("/home", {
      templateUrl: "./pages/home.html",
    })
    .when("/shop", {
      templateUrl: "./pages/shop-grid.html",
      controller: "sanPhamGiamGiaController"
    })
    .when("/shop/detail", {
      templateUrl: "./pages/shop-details.html",
    })
    .when("/cart", {
      templateUrl: "./pages/shoping-cart.html",
    }).otherwise({
      redirectTo: "/dashboard",
    });
});
