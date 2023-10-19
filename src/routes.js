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
    .when("/giam-gia/create", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
    })
});
