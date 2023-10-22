myApp.controller("GiamGiaController", function ($http, $scope) {
    $scope.listGiamGia = [];
    function fetchGiamGiaList() {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/show")
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
    fetchGiamGiaList();
  $scope.key = '';
  $scope.searchByKey = function () {
    $http
      .get(
        "http://localhost:8080/api/v1/giam-gia/searchString_bykey?key=" + $scope.key
      )
      .then(function (response) {
        $scope.listGiamGia = response.data;
        console.log($scope.listGiamGia);
        console.log($scope.key);
      });
  };
  
  
  });
  