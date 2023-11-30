myApp.controller("kieuDeController", function ($http, $scope, $location) {
  $scope.listKieuDe = [];
  $scope.selectedTrangThai = "";
  $scope.searchQuery = "";
  $scope.selectedKieuDe = null;
  $scope.pageNumber = 0;
  var id = $location.search().id;

  function kieuDeList(trangThai, pageNumber) {
    var url = `http://localhost:8080/api/v1/kieu-de/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

    if ($scope.searchQuery) {
      url += `&tenKieuDe=${$scope.searchQuery}`;
    }

    $http
      .get(url)
      .then(function (response) {
        $scope.listKieuDe = response.data;
        console.log("Dữ liệu trả về: ", response.data);

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
      kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
    }
  };

  $scope.nextPage = function () {
    $scope.pageNumber++;
    kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  function fetchKieuDeDetail(id) {
    var detailUrl = "http://localhost:8080/api/v1/kieu-de/detail?id=" + id;
    $http.get(detailUrl).then(function (response) {
      $scope.selectedKieuDe = response.data;
      console.log("Thông tin chi tiết: ", $scope.selectedKieuDe);
      if ($scope.selectedKieuDe.trangThai === 1) {
        $scope.selectedKieuDe.trangThai = "1";
      } else {
        $scope.selectedKieuDe.trangThai = "2";
      }
      $scope.selectedKieuDe.kieuDeId = id;
    });
  }

  setTimeout(() => {
    $scope.updateKieuDe = function (updatedData) {
      Swal.fire({
        title: "Bạn có muốn thêm kiểu đế mới không?",
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
            "http://localhost:8080/api/v1/kieu-de/update?id=" +
            $scope.selectedKieuDe.kieuDeId;
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
                kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Lỗi khi cập nhật thông tin: ", error);
            });
        }
      });
    };
  }, 2000);

  $scope.newKieuDe = {};
  setTimeout(() => {
    $scope.createKieuDe = function () {
      Swal.fire({
        title: "Bạn có muốn thêm kiểu đế mới không?",
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
              "http://localhost:8080/api/v1/kieu-de/create",
              $scope.newKieuDe
            )
            .then(function (response) {
              $scope.listKieuDe.push(response.data);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thêm mới thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              }).then(() => {
                kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
              });
            })
            .catch(function (error) {
              console.error("Error:", error);
            });
        }
      });
    };
  }, 2000);

  $scope.deleteKieuDe = function (id) {
    Swal.fire({
      title: "Bạn có muốn vô hiệu hóa kiểu đế này không?",
      text: "",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes!",
      reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
    }).then((result) => {
      if (result.isConfirmed) {
        var deleteUrl = "http://localhost:8080/api/v1/kieu-de/delete?id=" + id;

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
              kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
            });
          })
          .catch(function (error) {
            console.error("Lỗi khi xóa chất liệu: ", error);
          });
      }
    });
  };

  $scope.fetchKieuDeDetail = function (id) {
    fetchKieuDeDetail(id);
  };

  $scope.onTrangThaiChange = function () {
    kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.searchKieuDe = function () {
    kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  $scope.clearSearch = function () {
    $scope.searchQuery = "";
    kieuDeList($scope.selectedTrangThai, $scope.pageNumber);
  };

  if (id) {
    kieuDeList(id);
  } else {
    $scope.onTrangThaiChange();
  }
});
