myApp.controller(
  "chatLieuController",
  function ($http, $scope, $location, $window) {
    $scope.listChatLieu = [];
    $scope.selectedTrangThai = "";
    $scope.searchQuery = "";
    $scope.selectedChatLieu = null;
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
        .get("http://localhost:8080/api/v1/audilog/chatlieu")
        .then(function (response) {
          $scope.listHistory = response.data;
        });
    }

    fetchHistortyList();
    function chatLieuList(trangThai, pageNumber) {
      var url = `http://localhost:8080/api/v1/chat-lieu/hien-thi?trangThai=${trangThai}&pageNumber=${pageNumber}`;

      if ($scope.searchQuery) {
        url += `&tenChatLieu=${$scope.searchQuery}`;
      }

      $http
        .get(url)
        .then(function (response) {
          $scope.listChatLieu = response.data;
          console.log("Dữ liệu trả về: ", response.data);

          // Update currentPageNumber based on the response
          $scope.currentPageNumber = response.data.number;
          $scope.totalNumberOfPages = response.data.totalPages;
        })
        .catch(function (error) {
          console.error("Lỗi khi tìm kiếm: ", error);
        });
    }
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
        "http://localhost:8080/api/v1/audilog/chatlieusearch?startDate=" +
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
        "http://localhost:8080/api/v1/audilog/auditlogchatlieubydate?searchDate=" +
        encodeURIComponent(formattedStartDate);
      $http.get(searchUrl).then(function (response) {
        $scope.listHistory = response.data;
      });
    };
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
      }
    };

    $scope.nextPage = function () {
      $scope.pageNumber++;
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    function fetchChatLieuDetail(id) {
      var detailUrl = "http://localhost:8080/api/v1/chat-lieu/detail?id=" + id;
      $http.get(detailUrl).then(function (response) {
        $scope.selectedChatLieu = response.data;
        console.log("Thông tin chi tiết: ", $scope.selectedChatLieu);
        if ($scope.selectedChatLieu.trangThai === 1) {
          $scope.selectedChatLieu.trangThai = "1";
        } else {
          $scope.selectedChatLieu.trangThai = "2";
        }
        $scope.selectedChatLieu.chatLieuId = id;
      });
    }

    setTimeout(() => {
      $scope.updateChatLieu = function (updatedData) {
        Swal.fire({
          title: "Bạn có muốn chỉnh sửa không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
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
              "http://localhost:8080/api/v1/chat-lieu/update?id=" +
              $scope.selectedChatLieu.chatLieuId;

            $http
              .put(updateUrl, updatedData, config)
              .then(function (response) {
                Swal.fire({
                  position: "bottom-start",
                  icon: "success",
                  title: "Chỉnh sửa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi cập nhật thông tin: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.newChatLieu = {};
    $scope.createChatLieu = function () {
      Swal.fire({
        title: "Bạn có muốn thêm mới không?",
        text: "",
        icon: "question",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ",
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận",
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
              "http://localhost:8080/api/v1/chat-lieu/create",
              $scope.newChatLieu,
              config
            )
            .then(function (response) {
              $("#themChatLieu").modal("hide"); // Đóng modal khi thêm thành công
              $scope.newChatLieu = {};
              $scope.listChatLieu.push(response.data);
              chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
              Swal.fire({
                position: "bottom-start",
                icon: "success",
                title: "Thêm thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup",
                },
              });
            }).catch(function(error) {
              $scope.errorTenChatLieu = error.data.tenChatLieu;
              $scope.errorTrangThai = error.data.trangThai;
            });
        }
      });
    };

    setTimeout(() => {
      $scope.deleteChatLieu = function (id) {
        Swal.fire({
          title: "Bạn có muốn vô hiệu hóa không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var deleteUrl =
              "http://localhost:8080/api/v1/chat-lieu/delete?id=" + id;

            $http
              .put(deleteUrl)
              .then(function (response) {
                Swal.fire({
                  position: "bottom-start",
                  icon: "success",
                  title: "Vô hiệu hóa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
                });
              })
              .catch(function (error) {
                console.error("Lỗi khi xóa chất liệu: ", error);
              });
          }
        });
      };
    }, 2000);

    $scope.fetchChatLieuDetail = function (id) {
      fetchChatLieuDetail(id);
    };

    $scope.onTrangThaiChange = function () {
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.searchChatLieu = function () {
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    $scope.clearSearch = function () {
      $scope.searchQuery = "";
      chatLieuList($scope.selectedTrangThai, $scope.pageNumber);
    };

    if (id) {
      chatLieuList(id);
    } else {
      $scope.onTrangThaiChange();
    }
  }
);
