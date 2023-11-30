myApp.controller("sizeController", function ($http, $scope, $location) {
  $scope.listSize = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedSize = null;
  $scope.pageNumber = 0;
  var id = $location.search().id;

  function sizeList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/v1/size/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

    if ($scope.searchQuery) {
      url += `&size=${$scope.searchQuery}`;
    }

    $http
      .get(url)
      .then(function (response) {
        $scope.listSize = response.data;
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
      sizeList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    sizeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchSizedetail(id) {
    var detailUrl = "http://localhost:8080/api/v1/size/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      $scope.selectedSize = response.data;
      console.log("Thông tin chi tiết: ", $scope.selectedSize);
      if ($scope.selectedSize.trangThai === 1) {
        $scope.selectedSize.trangThai = "1";
      } else {
        $scope.selectedSize.trangThai = "0";
      }
      $scope.selectedSize.sizeId = id;
    });
  }

  setTimeout(() => {
    $scope.updateSize = function (updatedData) {
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
            "http://localhost:8080/api/v1/size/update?id=" +
            $scope.selectedSize.sizeId;

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
                sizeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi cập nhật thông tin: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.newSize = {};
  setTimeout(() => {
    $scope.createSize = function () {
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
            .post("http://localhost:8080/api/v1/size/create", $scope.newSize)
            .then(function (response) {
              $scope.listSize.push(response.data);
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
                sizeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            });
        }
      });
    };
  }, 2000);

  setTimeout(() => {
    $scope.deleteSize = function (id) {
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
          var deleteUrl = "http://localhost:8080/api/v1/size/delete?id=" + id;

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
                sizeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi xóa chất liệu: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.fetchSizedetail = function (id) {
    fetchSizedetail(id);
  };

  $scope.onTrangThaiChange = function () {
    sizeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.searchSize = function () {
    sizeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    sizeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  if (id) {
    sizeList(id);
  } else {
    $scope.onTrangThaiChange();
  }
});
