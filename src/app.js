var myApp = angular.module("myModule", ["ngRoute"]);
myApp.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");

  $routeProvider
    .when("/admin/dashboard", {
      templateUrl: "./pages/dashboard.html",
    })
    .when("/admin/orders", {
      templateUrl: "./pages/bantaiquay.html",
    })
    .when("/admin/hoa-don", {
      templateUrl: "./pages/thuchi.html",
    })
    .when("/admin/discounts", {
      templateUrl: "./pages/khuyen-mai.html",
    })
    .when("/admin/discount/new", {
      templateUrl: "./pages/create-ma-khuyen-mai.html",
    })
    .when("/admin/discount/new_automatic", {
      templateUrl: "./pages/create-chuong-trinhkm.html",
    })
    .when("/admin/account/nhan-vien", {
      templateUrl: "./pages/nhan-vien.html",
      controller: "nhanVienController",
    })
    .when("/admin/account/khach-hang", {
      templateUrl: "./pages/khach-hang.html",
    })
    .otherwise({
      redirectTo: "/admin/dashboard",
    });
});
