myApp.controller("xuatXuController", function ($http, $scope, $location) {
  $scope.listXuatXu = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedXuatXu = null;
  $scope.pageNumber = 0;
  var id = $location.search().id;

  function xuatXuList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/v1/xuat-xu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

    if ($scope.searchQuery) {
      url += `&tenXuatXu=${$scope.searchQuery}`;
    }

    $http
      .get(url)
      .then(function (response) {
        $scope.listXuatXu = response.data;
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
      xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchXuatXuDetail(id) {
    var detailUrl = "http://localhost:8080/api/v1/xuat-xu/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      $scope.selectedXuatXu = response.data;
      console.log("Thông tin chi tiết: ", $scope.selectedXuatXu);
      if ($scope.selectedXuatXu.trangThai === 1) {
        $scope.selectedXuatXu.trangThai = "1";
      } else {
        $scope.selectedXuatXu.trangThai = "2";
      }
      $scope.selectedXuatXu.xuatXuId = id;
    });
  }

  setTimeout(() => {
    $scope.updateXuatXu = function (updatedData) {
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
            "http://localhost:8080/api/v1/xuat-xu/update?id=" +
            $scope.selectedXuatXu.xuatXuId;

          $http
            .put(updateUrl, updatedData)
            .then(function (response) {
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
                xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi cập nhật thông tin: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.newXuatXu = {};
  setTimeout(() => {
    $scope.createXuatXu = function () {
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
              "http://localhost:8080/api/v1/xuat-xu/create",
              $scope.newXuatXu
            )
            .then(function (response) {
              $scope.listXuatXu.push(response.data);
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
                xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            });
        }
      });
    };
  }, 2000);

  setTimeout(() => {
    $scope.deleteXuatXu = function (id) {
      Swal.fire({
        title: "Bạn có muốn vô hiệu hóa không?",
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
            "http://localhost:8080/api/v1/xuat-xu/delete?id=" + id;

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
                xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi xóa xuất xứ: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.fetchXuatXuDetail = function (id) {
    fetchXuatXuDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.searchXuatXu = function () {
    xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    xuatXuList($scope.selectedTrangThai, $scope.pageNumber);
  };

  if (id) {
    xuatXuList(id);
  } else {
    $scope.onTrangThaiChange();
  }
});
