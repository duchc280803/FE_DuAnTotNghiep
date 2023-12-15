myApp.controller(
  "BanTaiQuayController",
  function ($scope, $http, $window, $location, CartService) {
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

    function getRole() {
      if (role === "ADMIN" || role === "MANAGER") {
        $scope.isAdmin = true;
      }
    }

    getRole();

    $scope.listCart = []; // show list sản phẩm trong giỏ hàng
    $scope.tongSoLuongSanPham = 0; // tính tổng số lượng sản phẩm có trong giỏ hàng
    $scope.tongTienHang = 0; // tính tổng tiền hàng
    $scope.luuSoLuong = 1; // lấy ra tất cả số lượng của sản phẩm đó
    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng
    $scope.showInput = false; // show input giao hàng
    $scope.listHoaDonChiTiet = []; // list hóa đơn chi tiết
    $scope.listSanPhamTaiQuay = []; // list sản phẩm tại quầy để thêm vào giỏ hàng
    $scope.listKhachHang = []; // list khách hàng đã tồn tại
    $scope.listTransaction = []; // list transaction của hóa đơn đó
    $scope.codeOrder = ""; // lưu mã hóa đơn lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.createDate = ""; // lưu ngày tạo lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.orderDetailCounter = {}; // hiển thị thông tin theo hóa đơn

    $scope.selectedOrder = null;
    $scope.selectOrder = function (hd, kh) {
      $window.localStorage.setItem("idHoaDon", hd);
      $window.localStorage.setItem("idKhach", kh);
      if ($scope.selectedOrder === hd) {
        hd.isSelected = false;
        $scope.selectedOrder = null;
      } else {
        if ($scope.selectedOrder) {
          $scope.selectedOrder.isSelected = false;
        }
        hd.isSelected = true;
        $scope.selectedOrder = hd;
      }
      $window.location.reload();
    };

    var id = $window.localStorage.getItem("idHoaDon");
    var idKhach = $window.localStorage.getItem("idKhach");
    console.log(id);

    $scope.listHoaDonTaiQuay = []; // show list hóa đơn tại quầy
    // tạo hóa đơn
    setTimeout(() => {
      $scope.createHoaDon = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        var api = "http://localhost:8080/api/v1/don-hang/create";

        if ($scope.listHoaDonTaiQuay.length >= 5) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "Tối đa 5 hóa đơn",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup", // Add a class to the message
            },
          });
          return;
        }

        Swal.fire({
          title: "Bạn có muốn tạo hóa đơn?",
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
            $http.post(api, {}, config).then(function (response) {
              $scope.listHoaDonTaiQuay.push(response.data);
              $scope.getListHoaDonTaiQuay();
              $scope.selectOrder(response.data.id, response.data.idKhach);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Tạo thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup",
                },
              }).then(() => {
                // $window.location.reload();
              });
            });
          }
        });
      };
    }, 2000);

    // delete hoadon
    setTimeout(() => {
      $scope.deleteOrder = function (id) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        Swal.fire({
          title: "Xác nhận hủy !",
          text: "Bạn có chắc chắn muốn hủy hóa đơn này ?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            $http
              .put(
                "http://localhost:8080/api/v1/don-hang/remove?id=" + id,
                null,
                config
              )
              .then(function () {
                $scope.removeItem();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Hủy thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                }).then(() => {
                  $window.location.reload();
                });
              });
          }
        });
      };
    }, 2000);

    /**
     * Get all hoa đơn tại quầy
     */
    $scope.pageNumber = 0;
    $scope.pageSize = 5;
    $scope.getListHoaDonTaiQuay = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize,
          config
        )
        .then(function (response) {
          if ($scope.listHoaDonTaiQuay.length < 5) {
            $scope.listHoaDonTaiQuay = response.data;
          }
        });
    };
    $scope.getListHoaDonTaiQuay();

    // tìm kiếm hóa đơn
    $scope.kyHoaDonTaiQuay = "";
    $scope.searchOrder = function (ma) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/don-hang/search/" + ma, config)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
      if (ma === null || ma === "") {
        $scope.getListHoaDonTaiQuay();
      }
    };

    $scope.lamMoiHoaDon = function () {
      $scope.getListHoaDonTaiQuay();
      $scope.kyHoaDonTaiQuay = "";
    };

    $scope.detailOrderCounterDetail = function () {
      var token = $window.localStorage.getItem("token");
      console.log(token);
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/order-counter/" + id,
          config
        )
        .then(function (response) {
          $scope.orderDetailCounter = response.data;
          $window.localStorage.setItem(
            "tienGiamGiaTaiQuay",
            $scope.orderDetailCounter.tienGiamGia
          );
        });
    };

    if (id != null) {
      $scope.detailOrderCounterDetail();
    }

    $scope.showInput = true;

    $scope.toggleInput = function () {
      $scope.showInput = !$scope.showInput;
      $scope.tenNguoiShip = "";
      $scope.soDienThoaiNguoiShip = "";
    };

    $scope.selectedProductQuantity = function (quantity, id) {
      $scope.luuSoLuong = quantity;
      $scope.idSanPhamChiTiet = id;
    };

    // TODO: show sản phẩm trong giỏ hảng
    $scope.pageNumberSpTrongGio = 0;
    $scope.pageSizeSpTrongGio = 3;
    $scope.listCart = [];

    $scope.listSanPhamInCart = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?id=" +
            idKhach +
            "&pageNumber=" +
            $scope.pageNumberSpTrongGio +
            "&pageSize=" +
            $scope.pageSizeSpTrongGio,
          config
        )
        .then(function (response) {
          $scope.listCart = response.data;
          if ($scope.listCart.length < $scope.pageSizeSpTrongGio) {
            $scope.showNextButtonSpInCart = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonSpInCart = true; // Hiển thị nút "Next"
          }
        });
    };
    // $scope.listSanPhamInCart = function () {
    //   var token = $window.localStorage.getItem("token");

    //   var config = {
    //     headers: {
    //       Authorization: "Bearer " + token,
    //     },
    //   };

    //   $scope.tongTienHang = 0; // Đặt lại tổng tiền hàng về 0 trước khi tính lại

    //   function getTotalPrice(pageNumber) {
    //     $http
    //       .get(
    //         "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?id=" +
    //           idKhach +
    //           "&pageNumber=" +
    //           pageNumber +
    //           "&pageSize=" +
    //           $scope.pageSizeSpTrongGio,
    //         config
    //       )
    //       .then(function (response) {
    //         $scope.listCart = response.data;
    //         console.log($scope.listCart);
    //         for (var i = 0; i < $scope.listCart.length; i++) {
    //           $scope.tongTienHang +=
    //             $scope.listCart[i].giaGiam * $scope.listCart[i].soLuong;
    //         }

    //         if ($scope.listCart.length === $scope.pageSizeSpTrongGio) {
    //           getTotalPrice(pageNumber + 1); // Nếu còn trang tiếp theo, tiếp tục lấy dữ liệu
    //         } else {
    //           $window.localStorage.setItem(
    //             "tongTienHangTaiQuay",
    //             $scope.tongTienHang
    //           );
    //           console.log($scope.tongSoLuongSanPham);
    //         }
    //       });
    //   }

    //   getTotalPrice(0); // Bắt đầu tính từ trang đầu tiên
    // };

    $scope.listSanPhamTienInCart = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi-tien?id=" +
            idKhach,
          config
        )
        .then(function (response) {
          $scope.listCartTien = response.data;
          $scope.tongTienHang = 0;
          for (var i = 0; i < $scope.listCartTien.length; i++) {
            $scope.tongTienHang +=
              $scope.listCartTien[i].giaGiam * $scope.listCartTien[i].soLuong;
          }
          $window.localStorage.setItem(
            "tongTienHangTaiQuay",
            $scope.tongTienHang
          );
        });
    };

    if (id != null) {
      $scope.listSanPhamInCart();
      $scope.listSanPhamTienInCart();
    }

    // TODO: Quay lại trang
    $scope.previousPageSpTrongGio = function () {
      if ($scope.pageNumberSpTrongGio > 0) {
        $scope.pageNumberSpTrongGio--;
        $scope.listSanPhamInCart();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPageSpTrongGio = function () {
      $scope.pageNumberSpTrongGio++;
      $scope.listSanPhamInCart();
    };

    if (id != null) {
      CartService.setIdCart(id).then(function () {});
      CartService.setIdCart(id).then(function () {
        var idCart = CartService.getIdCart();
        CartService.setIdCartDetail(idCart).then(function () {});
      });
    }

    $scope.themSanPhamCart = function (idCtSp, soLuongSanPham) {
      if (soLuongSanPham == undefined) {
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "Bạn đã thêm quá số lượng có sẵn",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            popup: "small-popup", // Add a class to the message
          },
        });
      } else {
        Swal.fire({
          title: "Bạn có muốn thêm sản phẩm này vào giỏ?",
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
            var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
            var config = {
              headers: {
                Authorization: "Bearer " + token, // Thêm token vào header Authorization
              },
            };

            var idGioHang = CartService.getIdCart(); // Lấy ID giỏ hàng từ service
            $http
              .post(
                "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
                  idGioHang +
                  "&idSanPhamChiTiet=" +
                  idCtSp +
                  "&soLuong=" +
                  soLuongSanPham +
                  "&id=" +
                  id,
                {},
                config // Truyền thông tin token qua config
              )
              .then(function (response) {
                $scope.listCart.push(response.data);
                // $scope.listCart.map((item) => item.idGioHang);
                // $window.location.reload(); // Reload trang trước khi hiển thị thông báo
                $scope.listSanPhamInCart();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm sản phẩm vào giỏ thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                }).then(() => {
                  $window.location.reload();
                  $scope.listSanPhamInCart();
                  $scope.listSanPhamTienInCart();
                });
              });
          }
        });
      }
    };

    // delete sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.deleteProduct = function (index) {
        Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            let p = $scope.listCart[index];
            var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
            var config = {
              headers: {
                Authorization: "Bearer " + token,
              },
            };
            $http
              .delete(
                "http://localhost:8080/api/gio-hang-chi-tiet/delete_product?id=" +
                  p.idGioHang,
                config // Chuyền token vào config
              )
              .then(function () {
                $scope.listCart.splice(index, 1);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Xóa thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $window.location.reload();
                  $scope.listSanPhamInCart();
                  $scope.listSanPhamTienInCart();
                });
              });
          }
        });
      };
    }, 2000);

    // cập nhập sản phẩm trong giỏ hàng
    $scope.updateCart = function (idGioHangChiTiet, soLuong, index) {
      if (soLuong === 0) {
        $scope.deleteProduct(index);
      } else {
        var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage

        var config = {
          headers: {
            Authorization: "Bearer " + token, // Thêm token vào header Authorization
          },
        };

        var apiURL =
          "http://localhost:8080/api/gio-hang-chi-tiet/update-quantity?idgiohangchitiet=" +
          idGioHangChiTiet +
          "&quantity=" +
          soLuong;

        $http({
          url: apiURL,
          method: "PUT",
          headers: config.headers, // Truyền thông tin token qua headers
          transformResponse: [
            function () {
              $window.location.reload();
              // $scope.loadVouchers(totalOrderValue);
            },
          ],
        });
      }
    };

    $scope.pageNumberKhach = 0;
    $scope.pageSizeKhach = 20;
    // TODO: Hiển thị khách hàng
    $scope.showKhachHang = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/khach-hang/hien-thi?pageNumberKhach" +
            $scope.pageNumberKhach +
            "&pageSizeKhach=" +
            $scope.pageSizeKhach,
          config
        )
        .then(function (response) {
          $scope.listKhachHang = response.data;
          if ($scope.listKhachHang.length < $scope.pageSizeKhach) {
            $scope.showNextButtonKhach = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButtonKhach = true; // Hiển thị nút "Next"
          }
        });
    };
    $scope.showKhachHang();

    $scope.previousPageKhach = function () {
      if ($scope.pageNumberKhach > -1) {
        $scope.pageNumberKhach--;
        $scope.showKhachHang();
      }
    };

    $scope.nextPageKhach = function () {
      $scope.pageNumberKhach++;
      $scope.showKhachHang();
    };

    // TODO: Hiển thị detail khách hàng
    $scope.searchKeyword = "";
    $scope.searchKhach = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/khach-hang/search?key=" +
            $scope.searchKeyword,
          config
        )
        .then(function (response) {
          $scope.listKhachHang = response.data;
        });
    };

    setTimeout(() => {
      $scope.updateKhachHang = function (idcustom) {
        Swal.fire({
          title: "Xác nhận chọn?",
          text: "Bạn có muốn chọn khách này chứ?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
            var idGioHang = CartService.getIdCart(); // Lấy ID giỏ hàng từ service

            var config = {
              headers: {
                Authorization: "Bearer " + token, // Thêm token vào header Authorization
              },
            };
            $http
              .put(
                "http://localhost:8080/api/khach-hang/update-hoa-don?id=" +
                  idcustom +
                  "&idHoaDon=" +
                  id +
                  "&idGioHang=" +
                  idGioHang,
                null,
                config // Truyền thông tin token qua config
              )
              .then(function (response) {
                $("#exampleModal2").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Chọn khách thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                }).then(() => {
                  $scope.selectOrder(id, idcustom);
                });
              });
          }
        });
      };
    }, 2000);

    $scope.lamMoiKhachHang = function () {
      $scope.searchKeyword = "";
      $scope.showKhachHang();
    };

    $scope.formatSoTien = function () {
      if ($scope.newTransaction.soTien) {
        $scope.formattedSoTien =
          $scope.newTransaction.soTien.toLocaleString("vi-VN");
      } else {
        $scope.formattedSoTien = "";
      }
    };

    // TODO:Show phương thức thanh toán của khách
    $scope.totalAmountPaid = 0;
    $scope.remainingAmount = 0;
    $scope.tienCuoiCungCuaDon = 0;
    $scope.tienThuaTraKhach = 0;
    $scope.showTransaction = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/transaction/show?id=" + id, config)
        .then(function (response) {
          $scope.listTransaction = response.data;
          $scope.totalAmountPaid = 0; // Reset the total amount paid
          for (var i = 0; i < $scope.listTransaction.length; i++) {
            $scope.totalAmountPaid += $scope.listTransaction[i].soTien;
          }
          $scope.tienCuoiCungCuaDon = totalOrderValue - $scope.totalAmountPaid;
          $scope.tienThuaTraKhach = $scope.totalAmountPaid - totalOrderValue;
          $window.localStorage.setItem(
            "soTienkhachTra",
            $scope.totalAmountPaid
          );
        });
    };

    if (id != null) {
      $scope.showTransaction();
    }

    $scope.newTransaction = {};
    setTimeout(() => {
      $scope.createTransaction = function () {
        Swal.fire({
          title: "Thanh toán tiền mặt?",
          text: "Bạn có muốn thanh toán không?",
          icon: "warning",
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
            $http
              .post(
                "http://localhost:8080/api/v1/transaction/create?idHoaDon=" +
                  id +
                  "&id=" +
                  idKhach,
                $scope.newTransaction,
                config
              )
              .then(function (response) {
                $scope.listTransaction.push(response.data);
                $scope.showTransaction();
                // $scope.newTransaction.soTien = "";
                $location.path("/order-counter");
              });
          }
        });
      };
    }, 2000);

    $scope.listTransaction = []; // Lấy các tham số từ URL
    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;
    $scope.maGiaoDinh = $scope.queryParams.vnp_TxnRef;
    $scope.tienCuoiCungVnPay = $scope.amountParamValue / 100;

    // TODO: thanh toán chuyển khoản
    $scope.createTransactionVnpay = function () {
      var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage

      var config = {
        headers: {
          Authorization: "Bearer " + token, // Thêm token vào header Authorization
        },
      };

      $http
        .post(
          "http://localhost:8080/api/v1/transaction/create-vnpay?idHoaDon=" +
            id +
            "&id=" +
            idKhach +
            "&maGiaoDinh=" +
            $scope.maGiaoDinh +
            "&vnp_Amount=" +
            $scope.tienCuoiCungVnPay,
          null,
          config // Truyền thông tin token qua headers
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
        });
    };

    var transactionVnpayCalled = false;
    if (
      $scope.maGiaoDinh != null &&
      $scope.tienCuoiCungVnPay != null &&
      !transactionVnpayCalled
    ) {
      $scope.createTransactionVnpay();
      transactionVnpayCalled = true;
    }

    $scope.quayVe = function () {
      $window.location.href = "#/order-counter";
    };

    // TODO: ApiVNPay
    $scope.Vnpay = function (amountParam) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .post(
          "http://localhost:8080/api/v1/payment/vn_pay?amountParam=" +
            amountParam,
          config
        )
        .then(function (response) {
          $window.location.href = response.data.url;
        });
    };

    $scope.removeItem = function () {
      $window.localStorage.removeItem("idHoaDon");
      $window.localStorage.removeItem("idKhach");
      $window.localStorage.removeItem("soTienkhachTra");
      $window.localStorage.removeItem("tienGiamGia");
      $window.localStorage.removeItem("idVoucherResponse");
      $window.localStorage.removeItem("tongTienHangTaiQuay");
      $window.localStorage.removeItem("tienGiamGiaTaiQuay");
    };

    setTimeout(() => {
      $scope.generatePDF = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Bạn có muốn in hóa đơn này không?",
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
            $http
              .get("http://localhost:8080/api/v1/pdf/pdf/generate/" + id, {
                responseType: "arraybuffer",
                config,
              })
              .then(function (response) {
                var file = new Blob([response.data], {
                  type: "application/pdf",
                });
                var fileURL = URL.createObjectURL(file);
                var a = document.createElement("a");
                a.href = fileURL;
                a.download =
                  "pdf_" +
                  new Date().toISOString().slice(0, 19).replace(/:/g, "-") +
                  ".pdf";
                document.body.appendChild(a);
                a.click();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "In thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup", // Add a class to the message
                  },
                });
              });
          }
        });
      };
    }, 2000);

    //TODO:thanh toán hóa đơn
    setTimeout(() => {
      $scope.createHoaDonChiTiet = function (
        tongTienHang,
        tienKhachTra,
        tienThua,
        hoTen,
        soDienThoai,
        diaChi
      ) {
        var soTienKhachTra = $window.localStorage.getItem("soTienkhachTra");
        var totalOrderValue =
          tongTienTaiQuay -
          tienGiamGiaTaiQuay +
          ($scope.tienGiao ? +$scope.tienGiao : 0);
        if (soTienKhachTra < totalOrderValue) {
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title:
              "Vui lòng thanh toán tiền hàng trước khi xác nhận thanh toán !",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              popup: "small-popup",
            },
          });
        } else {
          var token = $window.localStorage.getItem("token");

          var config = {
            headers: {
              Authorization: "Bearer " + token,
            },
          };
          var idDetail = CartService.getIdCartDetail();
          var requestData = {
            tongTien: tongTienHang,
            tienKhachTra: tienKhachTra,
            tienThua: tienThua,
            hoTen: hoTen,
            soDienThoai: soDienThoai,
            diaChi: diaChi,
            gioHangChiTietList: idDetail,
          };
          var api =
            "http://localhost:8080/api/v1/don-hang/create-hoa-don-chi-tiet?idHoaDon=" +
            id;
          Swal.fire({
            title: "Bạn muốn thanh toán hóa đơn này?",
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
              $http.post(api, requestData, config).then(function (response) {
                $scope.listHoaDonChiTiet.push(response.data);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thanh toán thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                }).then(() => {
                  $scope.generatePDF();
                  $window.location.reload();
                });
                $scope.removeItem();
              });
            }
          });
        }
      };
    }, 2000);

    /**
     * thanh toán hóa đơn giao
     * @param {tongTienHang, tienKhachTra, tienThua}
     */
    setTimeout(() => {
      $scope.createHoaDonChiTietGiao = function (
        tongTienHang,
        tienKhachTra,
        tienThua
      ) {
        Swal.fire({
          title: "Bạn muốn đặt hàng?",
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
            var idDetail = CartService.getIdCartDetail();
            $scope.orderDetailCounter = {
              tongTien: tongTienHang,
              tienKhachTra: tienKhachTra,
              tienThua: tienThua,
              tienGiao: $scope.tienGiao,
              hoTen: $scope.tenKhach,
              tenNguoiShip: $scope.tenNguoiShip,
              soDienThoaiNguoiShip: $scope.soDienThoaiNguoiShip,
              soDienThoai: $scope.soDienThoai,
              email: $scope.email,
              diaChi: $scope.diaChi,
              gioHangChiTietList: idDetail,
            };
            var config = {
              headers: {
                Authorization: "Bearer " + token, // Thêm token vào header Authorization
              },
            };
            var api =
              "http://localhost:8080/api/v1/don-hang/create-hoa-don-chi-tiet-giao?idHoaDon=" +
              id;

            $http
              .post(api, $scope.orderDetailCounter, config)
              .then(function (response) {
                $scope.listHoaDonChiTiet.push(response.data);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Đặt hàng thành công thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $scope.removeItem();
              })
              .catch(function (error) {
                $scope.errorhoTen = error.data.tenKhach;
                $scope.errorsoDienThoai = error.data.soDienThoai;
                $scope.errortinh = error.data.tinh;
                $scope.errorhuyen = error.data.huyen;
                $scope.errorphuong = error.data.phuong;
                $scope.errordiaChi = error.data.diaChi;
                $scope.erroremail = error.data.email;
                $scope.errortienGiao = error.data.tienGiao;
              });
          }
        });
      };
    }, 2000);

    // TODO: Lấy ra tất cả bản ghi của chất liệu
    $scope.listChatLieu = [];
    $scope.getListChatLieu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/chat-lieu/show", config)
        .then(function (response) {
          $scope.listChatLieu = response.data;
        });
    };
    $scope.getListChatLieu();

    // TODO: Lấy ra tất cả bản ghi của size
    $scope.listSize = [];
    $scope.getListSize = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/size/show", config)
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getListSize();

    // TODO: Lấy ra tất cả bản ghi của màu sắc
    $scope.listMauSac = [];
    $scope.getListMauSac = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/mau-sac/show", config)
        .then(function (response) {
          $scope.listMauSac = response.data;
        });
    };
    $scope.getListMauSac();

    // TODO: Lấy ra tất cả bản ghi của thương hiệu
    $scope.listThuongHieu = [];
    $scope.getListThuongHieu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/hien-thi", config)
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    };
    $scope.getListThuongHieu();

    // TODO: Lấy ra tất cả bản ghi của danh mục
    $scope.listDanhMuc = [];
    $scope.getListDanhMuc = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show", config)
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getListDanhMuc();

    // TODO: Lấy ra tất cả bản ghi của kiểu đế
    $scope.listKieuDe = [];
    $scope.getListKieuDe = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/kieu-de/show", config)
        .then(function (response) {
          $scope.listKieuDe = response.data;
        });
    };
    $scope.getListKieuDe();

    // TODO: Lấy ra tất cả bản ghi của sản phẩm
    $scope.listXuatXu = [];
    $scope.getListXuatXu = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show", config)
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.getListXuatXu();

    $scope.pageNumberSp = 0; // Trang hiện tại
    $scope.pageSizeSp = 20; // Số bản ghi trên mỗi trang
    // TODO: Get ALL sản phẩm tại quầy
    $scope.getListSanPhamTaiQuay = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/chi-tiet-sp/hien-thi?pageNumber=" +
            $scope.pageNumberSp +
            "&pageSize=" +
            $scope.pageSizeSp,
          config
        )
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          $scope.keyName = "";
          if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
            $scope.showNextButton = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButton = true; // Hiển thị nút "Next"
          }
        });
    };

    $scope.getListSanPhamTaiQuay();

    $scope.previousPageSp = function () {
      if ($scope.pageNumberSp > -1) {
        $scope.pageNumberSp--;
        $scope.getListSanPhamTaiQuay();
      }
    };

    $scope.nextPageSp = function () {
      $scope.pageNumberSp++;
      $scope.getListSanPhamTaiQuay();
    };

    // TODO: Tìm kiếm sản phẩm
    $scope.searchKeyName = "";
    $scope.searchSanPham = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/chi-tiet-sp/search-name?name=" +
            $scope.pageNumberSp +
            "&pageSize=" +
            $scope.pageSizeSp +
            "&name=" +
            $scope.searchKeyName,
          config
        )
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
            $scope.showNextButton = false; // Ẩn nút "Next"
          } else {
            $scope.showNextButton = true; // Hiển thị nút "Next"
          }
        });
    };

    $scope.lamMoiSanPhamTaiQuay = function () {
      $scope.searchKeyName = "";
      $scope.brand = "";
      $scope.locCategory = "";
      $scope.locSole = "";
      $scope.locOrigin = "";
      $scope.locMauSac = "";
      $scope.locMaterial = "";
      $scope.locSize = "";
      $scope.getListSanPhamTaiQuay();
    };

    // TODO:  Lọc sản phẩm theo thương hiệu
    $scope.brand = "";
    $scope.filterBrand = function () {
      // if ($scope.brand == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locCategory == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locSole == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locOrigin == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locMauSac == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locMaterial == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      // if ($scope.locSize == "") {
      //   $scope.getListSanPhamTaiQuay();
      // }
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      var params = {
        pageNumber: $scope.pageNumber || 0,
        pageSize: $scope.pageSize || 20,
        tenThuongHieu: $scope.brand || null,
        tenXuatXu: $scope.locOrigin || null,
        tenDanhMuc: $scope.locCategory || null,
        tenDe: $scope.locSole || null,
        tenChatLieu: $scope.locMaterial || null,
        tenMauSac: $scope.locMauSac || null,
        size: $scope.locSize || null,
      };

      var config = {
        headers: {
          Authorization: "Bearer " + $window.localStorage.getItem("token"),
          Accept: "application/json",
          // Add other headers if needed
        },
        params: params,
      };

      $http
        .get("http://localhost:8080/api/chi-tiet-sp/filter-brand", config)
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
            $scope.showNextButton = false;
          } else {
            $scope.showNextButton = true;
          }
        })
        .catch(function (error) {
          // Xử lý lỗi nếu có
        });
    };

    // TODO: Lọc sản phẩm theo category
    $scope.locCategory = "";
    $scope.filterCategory = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locCategory === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-category?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.locCategory,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // TODO:  Lọc sản phẩm theo kiểu đế
    $scope.locSole = "";
    $scope.filterSole = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locSole === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-sole?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.locSole,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // TODO:  Lọc sản phẩm theo xuất xứ
    $scope.locOrigin = "";
    $scope.filterOrigin = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locOrigin === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-origin?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.locOrigin,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // TODO:  Lọc sản phẩm theo size
    $scope.locSize = "";
    $scope.filterSize = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locSize === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-size?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&size=" +
              $scope.locSize,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // TODO:  Lọc sản phẩm theo chất liệu
    $scope.locMaterial = "";
    $scope.filterMaterial = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locMaterial === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-material?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.locMaterial,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // TODO:  Lọc sản phẩm theo màu sắc
    $scope.locMauSac = "";
    $scope.filterColor = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      if ($scope.locMauSac === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-color?pageNumber=" +
              $scope.pageNumberSp +
              "&pageSize=" +
              $scope.pageSizeSp +
              "&name=" +
              $scope.locMauSac,
            config
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
            if ($scope.listSanPhamTaiQuay.length < $scope.pageSize) {
              $scope.showNextButton = false; // Ẩn nút "Next"
            } else {
              $scope.showNextButton = true; // Hiển thị nút "Next"
            }
          });
      }
    };

    // Đảm bảo rằng thư viện Instascan đã được import vào trang HTML của bạn
    let scanner = new Instascan.Scanner({
      video: document.getElementById("preview"),
    });
    scanner.addListener("scan", function (content) {
      var idGioHang = CartService.getIdCart();
      var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
      var config = {
        headers: {
          Authorization: "Bearer " + token, // Thêm token vào header Authorization
        },
      };

      $http
        .post(
          "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham-qrcode?idGioHang=" +
            idGioHang +
            "&qrCode=" +
            content,
          {},
          config
        )
        .then(function (response) {
          $scope.listCart.push(response.data);
          $scope.listSanPhamInCart();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Thêm sản phẩm vào giỏ thành công",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch(function (error) {});
    });
    Instascan.Camera.getCameras()
      .then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error("No cameras found.");
        }
      })
      .catch(function (e) {
        console.error(e);
      });

    $scope.updateOrder = function (idVoucher, thanhTien) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .put(
          "http://localhost:8080/api/v1/voucher-counter/update?idHoaDon=" +
            id +
            "&idVoucher=" +
            idVoucher +
            "&thanhTien=" +
            thanhTien,
          null,
          config // Truyền thông tin token qua config
        )
        .then(function (response) {
          $window.location.reload();
        });
    };

    $scope.newKhachHang = {};

    setTimeout(() => {
      $scope.createKhachHang = function () {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
        Swal.fire({
          title: "Thêm khách hàng?",
          text: "Bạn có muốn thêm không?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
          cancelButtonColor: "#d33",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Then make the API call to create the customer
            $http
              .post(
                "http://localhost:8080/api/khach-hang/create",
                $scope.newKhachHang,
                config
              )
              .then(function (response) {
                $scope.listKhachHang.push(response.data);
                $("#exampleModal3").modal("hide");
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                  customClass: {
                    popup: "small-popup",
                  },
                });
                $scope.getListHoaDonTaiQuay();
                $scope.detailOrderCounterDetail();
                $scope.listSanPhamInCart();
                CartService.setIdCart(id).then(function () {});
                CartService.setIdCart(id).then(function () {
                  var idCart = CartService.getIdCart();
                  CartService.setIdCartDetail(idCart).then(function () {});
                });
                $scope.showKhachHang();
                $scope.showTransaction();
                $scope.showTransaction();
                $scope.getVoucherName();
              })
              .catch(function (error) {
                $scope.errorMessage = error.data.message;
                $scope.errorHoTen = error.data.hoTen;
                $scope.errorSoDienThoai = error.data.soDienThoai;
                $scope.errorEmail = error.data.email;
                $scope.errorDiaChi = error.data.diaChi;
                $scope.errorNgaySinh = error.data.ngaySinh;
              });
          }
        });
      };
    }, 2000);

    // API ĐỊA CHỈ
    $scope.provinces = [];
    $scope.districts = [];
    $scope.wards = [];

    $scope.getTinh = function () {
      $http
        .get("https://provinces.open-api.vn/api/?depth=1")
        .then(function (response) {
          $scope.provinces = response.data;
        });
    };

    $scope.getTinh();

    $scope.getDistricts = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/p/" +
            $scope.selectedProvince.code +
            "?depth=2"
        )
        .then(function (response) {
          $scope.districts = response.data.districts;
        });
    };

    $scope.getWards = function () {
      $http
        .get(
          "https://provinces.open-api.vn/api/d/" +
            $scope.selectedDistrict.code +
            "?depth=2"
        )
        .then(function (response) {
          $scope.wards = response.data.wards;
        });
    };

    var tongTienTaiQuay = $window.localStorage.getItem("tongTienHangTaiQuay");
    var tienGiamGiaTaiQuay = $window.localStorage.getItem("tienGiamGiaTaiQuay");
    var tienGiamGiaResponse = $window.localStorage.getItem("tienGiamGia");

    $scope.listVoucher = [];
    $scope.loadVouchers = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http
        .get("http://localhost:8080/api/v1/voucher-counter/show", config)
        .then(function (response) {
          $scope.listVoucher = response.data;
          // let maxDiscount = 0; // Initialize maxDiscount outside the loop
          // let selectedVoucher = null; // Initialize selectedVoucher to null

          // if (totalOrderValue != 0) {
          //   $scope.listVoucher.forEach(function (voucher) {
          //     if (
          //       totalOrderValue >= voucher.priceOrder &&
          //       voucher.price > maxDiscount
          //     ) {
          //       if (voucher.style === 1) {
          //         maxDiscount = voucher.price / 100;
          //       } else if (voucher.style === 2) {
          //         maxDiscount = voucher.price;
          //       }
          //       selectedVoucher = voucher;
          //     }
          //   });

          //   // if (tienGiamGiaResponse != 0) {
          //   //   if (selectedVoucher.price > tienGiamGiaResponse) {
          //   //     $scope.updateOrder(selectedVoucher.id, totalOrderValue);
          //   //   } else {
          //   //     console.log(ok);
          //   //   }
          //   // }
          // }
        });
    };

    var totalOrderValue =
      tongTienTaiQuay -
      tienGiamGiaTaiQuay +
      ($scope.tienGiao ? +$scope.tienGiao : 0);
    $scope.loadVouchers();
    console.log(tongTienTaiQuay);
    $scope.voucherResponse = {};
    $scope.getVoucherResponse = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/voucher-counter/voucher?id=" + id,
          config
        )
        .then(function (response) {
          $scope.voucherReponse = response.data;
          $window.localStorage.setItem("idVoucherResponse", response.data.id);
          $window.localStorage.setItem("tienGiamGia", response.data.tienGiam);
        });
    };
    // $scope.getVoucherResponse();

    $scope.voucherName = "";
    $scope.getVoucherName = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .get(
          "http://localhost:8080/api/v1/voucher-counter/name?id=" + id,
          config
        )
        .then(function (response) {
          $scope.voucherName = response.data.voucherName;
        });
    };

    if (id != null) {
      $scope.getVoucherName();
    }

    $scope.huyVoucherHoaDon = function (tien) {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .put(
          "http://localhost:8080/api/v1/voucher-counter/close?idHoaDon=" +
            id +
            "&thanhTien=" +
            tien,
          null,
          config
        )
        .then(function (response) {});
    };

    // Thêm token vào function updateOrder
    $scope.updateOrder = function (idVoucher) {
      var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
      var config = {
        headers: {
          Authorization: "Bearer " + token, // Thêm token vào header Authorization
        },
      };
      $http
        .put(
          "http://localhost:8080/api/v1/voucher-counter/update?idHoaDon=" +
            id +
            "&idVoucher=" +
            idVoucher +
            "&thanhTien=" +
            totalOrderValue,
          null,
          config // Truyền thông tin token qua config
        )
        .then(function (response) {
          // Swal.fire({
          //   position: "top-end",
          //   icon: "success",
          //   title: "Thanh toán thành công",
          //   showConfirmButton: false,
          //   timer: 1500,
          //   customClass: {
          //     popup: "small-popup",
          //   },
          // }).then(() => {
          //   $window.location.reload();
          // });
        });
    };

    $scope.updateOrderCounter = function (idVoucher) {
      Swal.fire({
        title: "Chọn voucher?",
        text: "Bạn có muốn chọn voucher này không?",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Hủy bỏ", // Thay đổi từ "Cancel" thành "Hủy bỏ"
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Xác nhận", // Thay đổi từ "Yes" thành "Có"
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          var token = $window.localStorage.getItem("token"); // Lấy token từ localStorage
          var config = {
            headers: {
              Authorization: "Bearer " + token, // Thêm token vào header Authorization
            },
          };
          $http
            .put(
              "http://localhost:8080/api/v1/voucher-counter/update?idHoaDon=" +
                id +
                "&idVoucher=" +
                idVoucher +
                "&thanhTien=" +
                tongTienTaiQuay,
              null,
              config // Truyền thông tin token qua config
            )
            .then(function (response) {
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Chọn voucher thành công",
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                  popup: "small-popup",
                },
              }).then(() => {
                $window.location.reload();
              });
            });
        }
      });
    };
  }
);
