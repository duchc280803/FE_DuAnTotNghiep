myApp.controller(
  "sanPhamUpdateController",
  function ($scope, $http, $routeParams, $window) {
    var id = $routeParams.id;

    $scope.product = {};
    $scope.getProduct = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham/product/" + id)
        .then(function (response) {
          $scope.product = response.data;
        });
    };
    $scope.getProduct();

    $scope.productDetail = [];
    $scope.getProductDetail = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham/product-detail/" + id)
        .then(function (response) {
          $scope.productDetail = response.data;
        });
    };
    $scope.getProductDetail();

    $scope.image = [];
    $scope.getImage = function () {
      $http
        .get("http://localhost:8080/api/v1/images/image/" + id)
        .then(function (response) {
          $scope.image = response.data;
        });
    };
    $scope.getImage();

    // TODO: Lấy ra tất cả bản ghi của chất liệu
    $scope.listChatLieu = [];
    $scope.getListChatLieu = function () {
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show")
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    };
    $scope.getListChatLieu();

    // TODO: Lấy ra tất cả bản ghi của size
    $scope.listSize = [];
    $scope.getListSize = function () {
      $http
        .get("http://localhost:8080/api/v1/size/show")
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getListSize();

    // TODO: Lấy ra tất cả bản ghi của màu sắc
    $scope.listMauSac = [];
    $scope.getListMauSac = function () {
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show")
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    };
    $scope.getListMauSac();

    $scope.newProductDetail = {};
    $scope.createProductDetail = function () {
      $http
        .post(
          "http://localhost:8080/api/v1/san-pham-chi-tiet/create/" + id,
          $scope.newProductDetail
        )
        .then(function (response) {
          $scope.productDetail.push(response.data);
          $scope.getProductDetail();
        });
    };

    $scope.updateStatusHuy = function (id) {
      $http
        .put(
          "http://localhost:8080/api/v1/san-pham-chi-tiet/update-huy?id=" + id
        )
        .then(function (response) {
          $scope.getProductDetail();
        });
    };

    $scope.updateStatusKichHoat = function (id) {
      $http
        .put(
          "http://localhost:8080/api/v1/san-pham-chi-tiet/update-kich?id=" + id
        )
        .then(function (response) {
          $scope.getProductDetail();
        });
    };

    $scope.uploadImages = function () {
      var formData = new FormData();
      var input = document.getElementById("formFile");
      for (var i = 0; i < input.files.length; i++) {
        formData.append("files", input.files[i]);
      }
      formData.append("sanPhamId", id); // $scope.sanPhamId chứa ID sản phẩm

      $http
        .post("http://localhost:8080/api/v1/images/create", formData, {
          transformRequest: angular.identity,
          headers: { "Content-Type": undefined },
        })
        .then(function (response) {
          $scope.image.push(response.data);
          $scope.getImage();
        })
        .catch(function (error) {
          // Xử lý lỗi
          console.error("Error:", error);
          // Đoạn mã xử lý khi gặp lỗi trong quá trình gửi yêu cầu
        });
    };

    // Cleaned up code
    $scope.deleteImage = function (id) {
      Swal.fire({
        title: "Xác nhận xóa?",
        text: "Bạn có chắc chắn muốn xóa ảnh này ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          $http
            .delete("http://localhost:8080/api/v1/images/remove?id=" + id)
            .then(function () {
              var index = $scope.image.findIndex((img) => img.id === id);
              if (index !== -1) {
                $scope.image.splice(index, 1);
              }
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Xóa thành công",
                showConfirmButton: false,
                timer: 1500,
              });
            });
        }
      });
    };

    $scope.updateQuantity = function (id, soLuong) {
      var apiURL =
        "http://localhost:8080/api/v1/san-pham-chi-tiet/update-quantity?id=" +
        id +
        "&soLuong=" +
        soLuong;
      $http({
        url: apiURL,
        method: "PUT",
        transformResponse: [
          function () {
            $scope.getProductDetail();
          },
        ],
      });
    };
  }
);
