myApp.controller(
  "sanPhamUpdateController",
  function ($scope, $http, $routeParams, $window) {
    var id = $routeParams.id;

    $scope.productDetail = [];
    $scope.getProductDetail = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham/product-detail/" + id)
        .then(function (response) {
          $scope.productDetail = response.data;
          $scope.generateQRCode($scope.productDetail.qrcode);
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
    setTimeout(() => {
      $scope.createProductDetail = function () {
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
                "http://localhost:8080/api/v1/san-pham-chi-tiet/create/" + id,
                $scope.newProductDetail
              )
              .then(function (response) {
                $scope.newProductDetail = {};
                $scope.productDetail.push(response.data);
                $("#productDetailModal").modal("hide");
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
                  $scope.getProductDetail();
                });
              })
              .catch(function (error) {
                $scope.errorSoLuong = error.data.soLuong;
                $scope.errorChatLieu = error.data.idChatLieu;
                $scope.errorSize = error.data.idSize;
                $scope.errorMauSac = error.data.idMauSac;
              });
          }
        });
      };
    }, 2000);

    setTimeout(() => {
      $scope.updateStatusHuy = function (id) {
        Swal.fire({
          title: "Bạn có muốn hủy kích hoạt không?",
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
              .put(
                "http://localhost:8080/api/v1/san-pham-chi-tiet/update-huy?id=" +
                  id
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Hủy thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $scope.getProductDetail();
                });
              });
          }
        });
      };
    }, 2000);

    $scope.product = {};
    setTimeout(() => {
      $scope.updateProduct = function () {
        Swal.fire({
          title: "Bạn có muốn update không?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          reverseButtons: true,
        }).then((result) => {
          $http
            .put(
              "http://localhost:8080/api/v1/san-pham/update?id=" + id,
              $scope.product
            )
            .then(function (response) {
              $scope.getProduct();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Update thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup", // Add a class to the message
                },
              });
            })
            .catch(function (error) {
              $scope.errorMaSanPham = error.data.maSanPham;
              $scope.errorProductName = error.data.productName;
              $scope.errorDescribe = error.data.describe;
              $scope.errorPrice = error.data.price;
              $scope.errorBaoHanh = error.data.baoHang;
              $scope.errorKieuDe = error.data.idKieuDe;
              $scope.errorXuatXu = error.data.idXuatXu;
              $scope.errorThuognHieu = error.data.idBrand;
              $scope.errorDanhMuc = error.data.idCategory;
            });
        });
      };
    });

    $scope.getProduct = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham/product/" + id)
        .then(function (response) {
          $scope.product = response.data;
        });
    };
    $scope.getProduct();

    setTimeout(() => {
      $scope.updateStatusKichHoat = function (id) {
        Swal.fire({
          title: "Bạn có muốn kích hoạt không?",
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
              .put(
                "http://localhost:8080/api/v1/san-pham-chi-tiet/update-kich?id=" +
                  id
              )
              .then(function (response) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Kích hoạt thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $scope.getProductDetail();
                });
              });
          }
        });
      };
    }, 2000);

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
    setTimeout(() => {
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
    }, 2000);

    setTimeout(() => {
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
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Thành công",
                showConfirmButton: false,
                timer: 1500,
              });
              $scope.getProductDetail();
            },
          ],
        });
      };
    }, 2000);

    $scope.generateQRCode = function (data) {
      $http({
        method: "GET",
        url: "http://localhost:8080/api/qrcode/generate-product/" + data,
        responseType: "arraybuffer",
      }).then(
        function (response) {
          var blob = new Blob([response.data], { type: "image/png" });
          $scope.qrCodeImage = URL.createObjectURL(blob);
        },
        function (error) {
          console.error("Lỗi khi lấy hình ảnh QR code:", error);
        }
      );
    };
    // TODO: Lấy ra tất cả bản ghi của danh mục
    $scope.listDanhMuc = [];
    $scope.getListDanhMuc = function () {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getListDanhMuc();

    // TODO: Lấy ra tất cả bản ghi của thương hiệu
    $scope.listThuongHieu = [];
    $scope.getListThuongHieu = function () {
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi")
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    };
    $scope.getListThuongHieu();

    $scope.listKieuDe = [];
    $scope.getListKieuDe = function () {
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show")
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.getListKieuDe();

    // TODO: Lấy ra tất cả bản ghi của sản phẩm
    $scope.listXuatXu = [];
    $scope.getListXuatXu = function () {
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.getListXuatXu();
  }
);
