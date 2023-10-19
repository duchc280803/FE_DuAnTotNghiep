
myApp.controller("SanPhamController", function ($http, $scope) {
    $scope.listGiamGia = [];
    $scope.listThuongHieu = [];
    $scope.listSanPham = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];
    $scope.listImage = [];
  
    function fetchGiamGiaList() {
        $http.get("http://localhost:8080/api/giam-gia/show")
            .then(function (response) {
                $scope.listGiamGia = response.data;
            });
    }
  
    function fetchThuongHieuList() {
        $http.get("http://localhost:8080/api/thuong-hieu/show")
            .then(function (response) {
                $scope.listThuongHieu = response.data;
            });
    }
    function fetchDanhMucList() {
        $http.get("http://localhost:8080/api/danh-muc/show")
            .then(function (response) {
                $scope.listDanhMuc = response.data;
            });
    }
    function fetchSizeList() {
        $http.get("http://localhost:8080/api/size/show")
            .then(function (response) {
                $scope.listSize = response.data;
            });
    }
  
    function fetchSanPhamList(id) {
          $http
        .get("http://localhost:8080/api/image/hien-thi/" + id)
        .then(function (response) {
          $scope.istImage = response.data;
        });
    }
    fetchGiamGiaList();
    fetchThuongHieuList();
    fetchSanPhamList();
    fetchDanhMucList();
    fetchSizeList();
  });
  