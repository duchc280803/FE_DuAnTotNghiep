myApp.controller(
  "VoucherHistoryController",
  function ($http, $scope, $location, $route, $window, $sce) {
    var role = $window.localStorage.getItem("role");
    if (role === "USER") {
      Swal.fire({
        icon: "error",
        title: "Bạn không có quyền truy cập",
        text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }
    if (role === null) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng đăng nhập",
        text: "Vui lòng đăng nhập để có thể sử dụng chức năng.",
      });
      window.location.href =
        "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    }
    $scope.listVoucherHistory = [];

    $scope.pageNumber = 0;
    $scope.pageSize = 20;

    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.searchQuery2 = "";
    $scope.searchQuery3 = "";

    function fetchGiamGiaList(pageNumber) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var url = `http://localhost:8080/api/v1/audilog/voucher?page=${pageNumber}`;

      if ($scope.searchQuery) {
        if (!isNaN($scope.searchQuery)) {
          url += `&searchUsername=${$scope.searchQuery}`;
        } else {
          url += `&searchUsername=${$scope.searchQuery}`;
        }
      }
      //   if ($scope.searchQuery2) {
      //     if (!isNaN($scope.searchQuery2)) {
      //       url += `&maGiamGia=${$scope.searchQuery2}`;
      //     } else {
      //       url += `&tenGiamGia=${$scope.searchQuery2}`;
      //     }
      //   }
      //   if ($scope.searchQuery3) {
      //     if (!isNaN($scope.searchQuery3)) {
      //       url += `&ngayBatDau=${$scope.searchQuery3}`;
      //     } else {
      //       url += `&ngayBatDau=${$scope.searchQuery3}`;
      //     }
      //   }

      $http
        .get(url, config)
        .then(function (response) {
          $scope.listVoucherHistory = response.data;
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
        fetchGiamGiaList($scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      fetchGiamGiaList($scope.pageNumber);
    };

    $scope.searchKhach = function () {
      fetchGiamGiaList($scope.pageNumber);
    };

    // $scope.onTrangThaiChange = function () {
    //   fetchGiamGiaList("");
    // };

    // $scope.searchGiamGia = function () {
    //   fetchGiamGiaList($scope.pageNumber);
    // };

    // $scope.searchTenKhach = function () {
    //   fetchGiamGiaList($scope.pageNumber);
    // };
    fetchGiamGiaList($scope.pageNumber);
  }
);
