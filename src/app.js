var myApp = angular.module("myModule", []);
myApp.controler("nhanVienController", function ($http, $scope) {
    $scope.listNhanVien = [];
    function fetchNhanVienList() {
      $http
        .get("http://localhost:8080/api/nhan-vien/hien-thi")
        .then(function (response) {
          $scope.listNhanVien = response.data;
        });
    }
    fetchNhanVienList();
  });
  