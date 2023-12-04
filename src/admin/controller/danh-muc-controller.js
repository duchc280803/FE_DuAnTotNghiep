myApp.controller(
  "danhMucController",
  function ($http, $scope, $location, $window, $sce) {
    $scope.listDanhMuc = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedDanhMuc = null;
    $scope.pageNumber = 0;
    var id = $location.search().id;
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    function fetchHistortyList() {
      $http
        .get("http://localhost:8080/api/v1/audilog/danhmuc")
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    fetchHistortyList();
    function danhMucList(trangThai, pageNumber) {
      var url = `http://localhost:8080/api/v1/danh-muc/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenDanhMuc=${$scope.searchQuery}`;
      }

      $http
        .get(url)
        .then(function (response) {
          $scope.listDanhMuc = response.data;
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
        danhMucList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchDanhMucDetail(id) {
      var detailUrl = "http://localhost:8080/api/v1/danh-muc/detail?id=" + id;
      $http.get(detailUrl).then(function (response) {
        $scope.selectedDanhMuc = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedDanhMuc);
        if ($scope.selectedDanhMuc.trangThai === 1) {
          $scope.selectedDanhMuc.trangThai = "1";
        } else {
          $scope.selectedDanhMuc.trangThai = "2";
        }
        $scope.selectedDanhMuc.danhMucId = id;
      });
    }

    setTimeout(() => {
      $scope.updateDanhMuc = function (updatedData) {
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
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            var updateUrl =
              "http://localhost:8080/api/v1/danh-muc/update?id=" +
              $scope.selectedDanhMuc.danhMucId;

            $http
              .put(updateUrl, updatedData, config)
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
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi cập nhật thông tin: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.newDanhMuc = {};
    setTimeout(() => {
      $scope.createDanhMuc = function () {
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
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .post(
                "http://localhost:8080/api/v1/danh-muc/create",
                $scope.newDanhMuc,
                config
              )
              .then(function (response) {
                $scope.listDanhMuc.push(response.data);
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
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.deleteDanhMuc = function (id) {
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
              "http://localhost:8080/api/v1/danh-muc/delete?id=" + id;

            $http
              .put(deleteUrl)
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
                  danhMucList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchDanhMucDetail = function (id) {
      fetchDanhMucDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchDanhMuc = function () {
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      danhMucList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      danhMucList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
