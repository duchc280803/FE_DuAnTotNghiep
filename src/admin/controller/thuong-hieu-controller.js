myApp.controller("thuongHieuController", function ($http, $scope, $location) {
  $scope.listThuongHieu = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedThuongHieu = null;
  $scope.pageNumber = 0;
  var id = $location.search().id;

  function thuongHieuList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/v1/thuong-hieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

    if ($scope.searchQuery) {
      url += `&tenThuongHieu=${$scope.searchQuery}`;
    }

    $http
      .get(url)
      .then(function (response) {
        $scope.listThuongHieu = response.data;
        console.log("Dữ liệu trả về: ", response.data);

        // Update currentPageNumber based on the response
        $scope.currentPageNumber = response.data.number;
        $scope.totalNumberOfPages = response.data.totalPages;
      })
      .catch(function (error) {
        console.error("Lỗi khi tìm kiếm: ", error);
      });
  }

  $scope.previousPage = function () {
    if ($scope.pageNumber > 0) {
      $scope.pageNumber--;
      thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchThuongHieuDetail(id) {
    var detailUrl = "http://localhost:8080/api/v1/thuong-hieu/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      $scope.selectedThuongHieu = response.data;
      console.log("Thông tin chi tiết: ", $scope.selectedThuongHieu);
      if ($scope.selectedThuongHieu.trangThai === 1) {
        $scope.selectedThuongHieu.trangThai = "1";
      } else {
        $scope.selectedThuongHieu.trangThai = "2";
      }
      $scope.selectedThuongHieu.thuongHieuId = id;
    });
  }

  setTimeout(() => {
    $scope.updateThuongHieu = function (updatedData) {
      Swal.fire({
        title: "Bạn có muốn update không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
      }).then((result) => {
        if (result.isConfirmed) {
          var updateUrl =
            "http://localhost:8080/api/v1/thuong-hieu/update?id=" +
            $scope.selectedThuongHieu.thuongHieuId;
          $http
            .put(updateUrl, updatedData)
            .then(function (response) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Update thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi cập nhật thông tin: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.newThuongHieu = {};
  setTimeout(() => {
    $scope.createThuongHieu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
      }).then((result) => {
        if (result.isConfirmed) {
          $http
            .post(
              "http://localhost:8080/api/v1/thuong-hieu/create",
              $scope.newThuongHieu
            )
            .then(function (response) {
              $scope.listThuongHieu.push(response.data);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thêm thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            });
        }
      });
    };
  }, 2000);

  setTimeout(() => {
    $scope.deleteThuongHieu = function (id) {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes!",
        reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
      }).then((result) => {
        if (result.isConfirmed) {
          var deleteUrl =
            "http://localhost:8080/api/v1/thuong-hieu/delete?id=" + id;

          $http
            .put(deleteUrl)
            .then(function (response) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Vô hiệu hóa thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi xóa thương hiệu: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.fetchThuongHieuDetail = function (id) {
    fetchThuongHieuDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.searchThuongHieu = function () {
    thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    thuongHieuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  if (id) {
    thuongHieuList(id);
  } else {
    $scope.onTrangThaiChange();
  }
});
