myApp.controller(
  "xuatXuController",
  function ($http, $scope, $location, $window, $sce) {
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
    $scope.formatMa = function (username) {
      // Kiểm tra nếu có dấu phẩy thì thay thế bằng thẻ xuống dòng
      if (username && username.includes(",")) {
        return $sce.trustAsHtml(username.replace(/,/g, "<br>"));
      }
      return username;
    };
    function fetchHistortyList() {
      $http
        .get("http://localhost:8080/api/v1/audilog/xuatxu")
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    fetchHistortyList();

    $scope.searchVouchers = function () {
      // Make sure both startDate and endDate are provided
      if (!$scope.startDate || !$scope.endDate) {
        // Handle error or provide user feedback
        return;
      }

      var formattedStartDate = new Date($scope.startDate)
        .toISOString()
        .split("T")[0];
      var formattedEndDate = new Date($scope.endDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/xuatxusearch?startDate=" +
        encodeURIComponent(formattedStartDate) +
        "&endDate=" +
        encodeURIComponent(formattedEndDate);

      $http.get(searchUrl).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.searchVouchersByDay = function () {
      var formattedStartDate = new Date($scope.searchDate)
        .toISOString()
        .split("T")[0];

      var searchUrl =
        "http://localhost:8080/api/v1/audilog/auditlogxuatxubydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl).then(function (response) {
        $scope.listHistory = response.data;
      });
    };

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
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var token = $window.localStorage.getItem("token");

            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            var updateUrl =
              "http://localhost:8080/api/v1/xuat-xu/update?id=" +
              $scope.selectedXuatXu.xuatXuId;

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
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
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
                "http://localhost:8080/api/v1/xuat-xu/create",
                $scope.newXuatX,
                config
              )
              .then(function (response) {
                $scope.listXuatXu.push(response.data);
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
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Có", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
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
  }
);
