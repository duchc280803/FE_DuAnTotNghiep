myApp.controller("orderCounterController", [
  "$scope",
  "$http",
  "$window",
  "$route",
  "$location",
  function ($scope, $http, $window, $route, $location) {
    $scope.listHoaDonTaiQuay = []; // show list hóa đơn tại quầy
    // tạo hóa đơn
    $scope.createHoaDon = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var api = "http://localhost:8080/api/v1/hoa-don/create";

      $http.post(api, {}, config).then(function (response) {
        $scope.listHoaDonTaiQuay.push(response.data);
        $scope.getListHoaDonTaiQuay();
      });
    };

    //TODO: Get all hoa đơn tại quầy
    $scope.pageNumber = 0;
    $scope.pageSize = 4;
    $scope.getListHoaDonTaiQuay = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };
    $scope.getListHoaDonTaiQuay();

    // hiển thị số trang
    $scope.getPageNumbers = function () {
      var totalPages = Math.ceil(
        $scope.listHoaDonTaiQuay.length / $scope.pageSize
      );
      var pageNumbers = [];
      for (var i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    };

    // TODO: updatePage
    $scope.updatePage = function (pageNumber) {
      $scope.pageNumber = pageNumber;
      $scope.getListHoaDonTaiQuay();
    };

    // TODO: Quay lại trang
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.getListHoaDonTaiQuay();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.getListHoaDonTaiQuay();
    };

    // tìm kiếm hóa đơn
    $scope.searchOrder = function (ma) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/search/" + ma)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };

    $scope.reloadTrang = function(id) {
      $location.path("/order-counter/carts/" + id);
      $route.reload();
    };
  },
]);
