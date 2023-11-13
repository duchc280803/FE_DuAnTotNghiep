myApp.controller("nhanVienController", function ($http, $scope, $location) {
  $scope.listNhanVien = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedNhanVien = null;

  var id = $location.search().id;

  function fetchNhanVienList(trangThai) {
    $http
      .get("http://localhost:8080/api/v1/nhan-vien/hien-thi?trangThai="+ trangThai)
      if ($scope.searchQuery !== "") {
        if (!isNaN($scope.searchQuery)) {
            url += "&maNhanVien=" + $scope.searchQuery;
        } else {
            url += "&maTaiKhoan=" + $scope.searchQuery;
        }
        $http.get(url).then(function (response) {
          $scope.listKhachHang = response.data;
          console.log("Dữ liệu trả về: ", response.data);
      });
  }
}
  
  fetchNhanVienList();
});
