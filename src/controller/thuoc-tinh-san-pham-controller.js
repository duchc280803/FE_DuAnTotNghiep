myApp.controller("thuongHieuController", function ($http, $scope) {
  $scope.listThuongHieu = [];
  function thuongHieuList() {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  }
  thuongHieuList();
});

myApp.controller("mauSacController", function ($http, $scope) {
  $scope.listMauSac = [];
  function mauSacList() {
    $http
      .get("http://localhost:8080/api/v1/mau-sac/hien-thi")
      .then(function (response) {
        $scope.listMauSac = response.data;
      });
  }
  mauSacList();
});

myApp.controller("kieuDeController", function ($http, $scope) {
  $scope.listKieuDe = [];
  function kieuDeList() {
    $http
      .get("http://localhost:8080/api/v1/kieu-de/hien-thi")
      .then(function (response) {
        $scope.listKieuDe = response.data;
      });
  }
  kieuDeList();
});

myApp.controller("sizeController", function ($http, $scope) {
  $scope.listSize = [];
  function sizeList() {
    $http
      .get("http://localhost:8080/api/v1/size/hien-thi")
      .then(function (response) {
        $scope.listSize = response.data;
      });
  }
  sizeList();
});

myApp.controller("danhMucController", function ($http, $scope) {
  $scope.listDanhMuc = [];
  function danhMucList() {
    $http
      .get("http://localhost:8080/api/v1/the-loai/hien-thi")
      .then(function (response) {
        $scope.listDanhMuc = response.data;
      });
  }
  danhMucList();
});

myApp.controller("chatLieuController", function ($http, $scope) {
  $scope.listChatLieu = [];
  function chatLieuList() {
    $http
      .get("http://localhost:8080/api/v1/chat-lieu/hien-thi")
      .then(function (response) {
        $scope.listChatLieu = response.data;
      });
  }
  chatLieuList();
});

myApp.controller("xuatXuController", function ($http, $scope) {
  $scope.listXuatXu = [];
  function xuatXuList() {
    $http
      .get("http://localhost:8080/api/v1/xuat-xu/hien-thi")
      .then(function (response) {
        $scope.listXuatXu = response.data;
      });
  }
  xuatXuList();
});
