myAppCustom.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/home", {
      templateUrl: "./pages/home.html",
      controller: "homeController",
    })
    .when("/shop", {
      templateUrl: "./pages/shop-grid.html",
      controller: "sanPhamShopController",
    })
    .when("/shop/detail/:name", {
      templateUrl: "./pages/shop-details.html",
      controller: "sanPhamShopDetailController",
    })
    .when("/check-out", {
      templateUrl: "./pages/shoping-cart.html",
      controller: "CartController",
    })
    .when("/thank-you", {
      templateUrl: "./pages/thankyou.html",
    })
    .when("/don-hang", {
      templateUrl: "./pages/don-hang.html",
      controller: "donHangController",
    })
    .when("/login", {
      templateUrl: "/src/customer/pages/login.html",
      controller: "loginCutomController",
    })
    .when("/don-hang-chi-tiet/:idHoaDon", {
      templateUrl: "./pages/detail-don-hang.html",
      controller: "detailDonHangController",
    })
    .when("/dia-chi", {
      templateUrl: "./pages/dia-chi.html",
      controller: "DiaChiController",
    })
    .otherwise({
      redirectTo: "/home",
    });
});
