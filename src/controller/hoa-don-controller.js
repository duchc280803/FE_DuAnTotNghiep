myApp.controller("hoaDonController", function ($http, $scope, $window){
// TODO: Trạng thái 1
 $scope.listHoaDon = [];
function fetchHoaDon1(){

  var token = $window.localStorage.getItem("token");
  var config = {
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  $http
  .get("http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=1", config)
  .then(function(response){
    $scope.listHoaDon = response.data;
  });
}
    fetchHoaDon1();

// TODO: Trạng thái 2
    $scope.listHoaDon2 = [];
    function fetchHoaDon2(){
    
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    
      $http
      .get("http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=2", config)
      .then(function(response){
        $scope.listHoaDon2 = response.data;
      });
    }
        fetchHoaDon2();

// TODO: Trạng thái 3
    $scope.listHoaDon3 = [];
    function fetchHoaDon3(){
    
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    
      $http
      .get("http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=3", config)
      .then(function(response){
        $scope.listHoaDon3 = response.data;
      });
    }
        fetchHoaDon3();

        // TODO: Trạng thái 4
    $scope.listHoaDon4 = [];
    function fetchHoaDon4(){
    
      var token = $window.localStorage.getItem("token");
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
    
      $http
      .get("http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=4", config)
      .then(function(response){
        $scope.listHoaDon4 = response.data;
      });
    }
        fetchHoaDon4();

     // TODO: Trạng thái 5
     $scope.listHoaDon5 = [];
     function fetchHoaDon5(){
     
       var token = $window.localStorage.getItem("token");
       var config = {
         headers: {
           Authorization: "Bearer " + token,
         },
       };
     
       $http
       .get("http://localhost:8080/api/manager/hoa-don/hien-thi?trangThaiHD=5", config)
       .then(function(response){
         $scope.listHoaDon5 = response.data;
       });
     }
         fetchHoaDon5();

});