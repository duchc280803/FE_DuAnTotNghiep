myApp.controller(
  "BanTaiQuayController",
  function ($scope, $http, $window, $location, CartService) {
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

    $scope.luuIdHoaDon = function (id) {
      $window.localStorage.setItem("idHoaDon", id);
      var hd = $scope.listHoaDonTaiQuay.find(function (hd) {
        return hd.id === id;
      });
      $scope.selectOrder(hd);
      $window.location.reload();
    };

    var id = $window.localStorage.getItem("idHoaDon");
    console.log(id);
    var idKhach = $window.localStorage.getItem("idKhach");
    console.log(idKhach);

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
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            $http.post(api, {}, config).then(function (response) {
              $scope.listHoaDonTaiQuay.push(response.data);
              $scope.getListHoaDonTaiQuay();
              $scope.luuIdHoaDon(response.data.id);
              $location.path("/order-counter");
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
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          if ($scope.listHoaDonTaiQuay.length < 5) {
            $scope.listHoaDonTaiQuay = response.data;
          }
        });
    };
    $scope.getListHoaDonTaiQuay();

    // tìm kiếm hóa đơn
    $scope.searchOrder = function (ma) {
      $http
        .get("http://localhost:8080/api/v1/don-hang/search/" + ma)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };

    $scope.detailOrderCounterDetail = function () {
      $http
        .get("http://localhost:8080/api/v1/don-hang/order-counter/" + id)
        .then(function (response) {
          $scope.orderDetailCounter = response.data;
          $window.localStorage.setItem(
            "tienGiamGiaTaiQuay",
            $scope.orderDetailCounter.tienGiamGia
          );
          $window.localStorage.setItem(
            "idKhach",
            $scope.orderDetailCounter.idKhach
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
    $scope.pageNumber = 0;
    $scope.pageSize = 5;
    $scope.listSanPhamInCart = function () {
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?id=" + idKhach
        )
        .then(function (response) {
          $scope.listCart = response.data;
          // Calculate the total quantity and total price for all products in the cart
          for (var i = 0; i < $scope.listCart.length; i++) {
            $scope.tongTienHang +=
              $scope.listCart[i].giaGiam * $scope.listCart[i].soLuong;
          }
          $window.localStorage.setItem(
            "tongTienHangTaiQuay",
            $scope.tongTienHang
          );
          $scope.listCart = $scope.listCart.slice(
            $scope.pageNumber * $scope.pageSize,
            ($scope.pageNumber + 1) * $scope.pageSize
          );
          $scope.listCart.map((item) => item.idGioHang);
        });
    };

    if (id != null) {
      $scope.listSanPhamInCart();
    }

    // TODO: updatePage
    $scope.updatePage = function (pageNumber) {
      $scope.pageNumber = pageNumber;
      $scope.listSanPhamInCart();
    };

    // TODO: Quay lại trang
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.listSanPhamInCart();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.listSanPhamInCart();
    };

    if (id != null) {
      CartService.setIdCart(id).then(function () {});
      CartService.setIdCart(id).then(function () {
        var idCart = CartService.getIdCart();
        CartService.setIdCartDetail(idCart).then(function () {});
      });
    }

    setTimeout(() => {
      $scope.themSanPhamCart = function (idCtSp, soLuongSanPham) {
        Swal.fire({
          title: "Bạn có muốn thêm sản phẩm này vào giỏ?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            var idGioHang = CartService.getIdCart(); // Get the cart ID from the service
            $http
              .post(
                "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
                  idGioHang + // Use the cart ID in the URL
                  "&idSanPhamChiTiet=" +
                  idCtSp +
                  "&soLuong=" +
                  soLuongSanPham,
                {}
              )
              .then(function (response) {
                $scope.listCart.push(response.data);
                $scope.listCart.map((item) => item.idGioHang);
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm sản phẩm vào giỏ thành công",
                  showConfirmButton: false,
                  timer: 1500,
                }).then(() => {
                  $window.location.reload();
                });
              });
          }
        });
      };
    }, 2000);

    // cập nhập sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.updateCart = function (idGioHangChiTiet, soLuong) {
        var apiURL =
          "http://localhost:8080/api/gio-hang-chi-tiet/update-quantity?idgiohangchitiet=" +
          idGioHangChiTiet +
          "&quantity=" +
          soLuong;
        $http({
          url: apiURL,
          method: "PUT",
          transformResponse: [
            function () {
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
              // $window.location.reload();
            },
          ],
        });
      };
    }, 2000);

    // delete sản phẩm trong giỏ hàng
    setTimeout(() => {
      $scope.deleteProduct = function (event, index) {
        Swal.fire({
          title: "Xác nhận xóa?",
          text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Xóa",
          cancelButtonText: "Hủy",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            event.preventDefault();
            let p = $scope.listCart[index];
            $http
              .delete(
                "http://localhost:8080/api/gio-hang-chi-tiet/delete_product?id=" +
                  p.idGioHang
              )
              .then(function () {
                $scope.listCart.splice(index, 1);
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
                });
              });
          }
        });
      };
    }, 2000);

    // TODO: Hiển thị khách hàng
    $scope.showKhachHang = function () {
      $http
        .get("http://localhost:8080/api/khach-hang/hien-thi")
        .then(function (response) {
          $scope.listKhachHang = response.data;
        });
    };
    $scope.showKhachHang();

    // TODO: Hiển thị detail khách hàng
    $scope.searchKeyword = "";
    $scope.searchKhach = function () {
      $http
        .get(
          "http://localhost:8080/api/khach-hang/search?key=" +
            $scope.searchKeyword
        )
        .then(function (response) {
          $scope.listKhachHang = response.data;
        });
    };

    /**
     * update khách hàng vào hóa đơn
     */
    setTimeout(() => {
      $scope.updateKhachHang = function (idcustom) {
        Swal.fire({
          title: "Xác nhận chọn?",
          text: "Bạn có muốn chọn khách này chứ?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Chọn",
          cancelButtonText: "Hủy",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            var idGioHang = CartService.getIdCart();
            $http
              .put(
                "http://localhost:8080/api/khach-hang/update-hoa-don?id= " +
                  idcustom +
                  "&idHoaDon=" +
                  id +
                  "&idGioHang=" +
                  idGioHang
              )
              .then(function (response) {
                $scope.detailOrderCounterDetail(id);
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
                // $location.path("/order-counter");
              });
          }
        });
      };
    }, 2000);

    // TODO:Show phương thức thanh toán của khách
    $scope.totalAmountPaid = 0;
    $scope.remainingAmount = 0;
    $scope.showTransaction = function () {
      $http
        .get("http://localhost:8080/api/v1/transaction/show?id=" + id)
        .then(function (response) {
          $scope.listTransaction = response.data;
          $scope.totalAmountPaid = 0; // Reset the total amount paid
          for (var i = 0; i < $scope.listTransaction.length; i++) {
            $scope.totalAmountPaid += $scope.listTransaction[i].soTien;
          }
        });
    };

    if (id != null) {
      $scope.showTransaction();
    }

    // TODO: thanh toán tiền mặt
    $scope.newTransaction = {};
    setTimeout(() => {
      $scope.createTransaction = function () {
        Swal.fire({
          title: "Thanh toán tiền mặt?",
          text: "Bạn có muốn thanh toán không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Thanh toán",
          cancelButtonText: "Hủy",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            $http
              .post(
                "http://localhost:8080/api/v1/transaction/create?idHoaDon=" +
                  id +
                  "&id=" +
                  idKhach,
                $scope.newTransaction
              )
              .then(function (response) {
                $scope.listTransaction.push(response.data);
                $scope.newTransaction.soTien = "";
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
                // $location.path("/order-counter");
              });
          }
        });
      };
    }, 2000);

    $scope.listTransaction = []; // Lấy các tham số từ URL
    $scope.queryParams = $location.search();

    // Lấy giá trị của tham số 'vnp_Amount'
    $scope.amountParamValue = $scope.queryParams.vnp_Amount;
    $scope.tienCuoiCungVnPay = $scope.amountParamValue / 100;

    // TODO: thanh toán chuyển khoản
    $scope.createTransactionVnpay = function () {
      $http
        .post(
          "http://localhost:8080/api/v1/transaction/create-vnpay?idHoaDon=" +
            id +
            "&id=" +
            idKhach +
            "&vnp_Amount=" +
            $scope.tienCuoiCungVnPay
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
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
        });
    };

    // TODO: ApiVNPay
    $scope.addVnPay = {};
    $scope.Vnpay = function (amount) {
      $http
        .post("http://localhost:8080/api/v1/payment/pay?amount=" + amount)
        .then(function (response) {
          $scope.addVnPay = response.data;
          $window.location.href = $scope.addVnPay.value;
        });
    };

    $scope.removeItem = function () {
      $window.localStorage.removeItem("idHoaDon");
      $window.localStorage.removeItem("idKhach");
    };

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
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            $http
              .post(api, requestData)
              .then(function (response) {
                $scope.listHoaDonChiTiet.push(response.data);
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
                $scope.removeItem();
              })
              .then(function (error) {
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thanh toán thành công",
                  showConfirmButton: false,
                  timer: 1500,
                });
              });
          }
        });
      };
    }, 2000);

    //TODO:thanh toán hóa đơn giao
    setTimeout(() => {
      $scope.createHoaDonChiTietGiao = function (
        tongTienHang,
        tienKhachTra,
        tienThua
      ) {
        var idDetail = CartService.getIdCartDetail();
        var requestData = {
          tongTien: tongTienHang,
          tienKhachTra: tienKhachTra,
          tienThua: tienThua,
          tienGiao: $scope.tienGiao,
          hoTen: $scope.hoTen,
          tenNguoiShip: $scope.tenNguoiShip,
          soDienThoaiNguoiShip: $scope.soDienThoaiNguoiShip,
          soDienThoai: $scope.soDienThoai,
          email: $scope.email,
          diaChi:
            $scope.diaChi +
            ", " +
            $scope.selectedWard.name +
            ", " +
            $scope.selectedDistrict.name +
            ", " +
            $scope.selectedProvince.name,
          gioHangChiTietList: idDetail,
        };
        var api =
          "http://localhost:8080/api/v1/don-hang/create-hoa-don-chi-tiet-giao?idHoaDon=" +
          id;
        Swal.fire({
          title: "Bạn muốn đặt hàng?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            $http.post(api, requestData).then(function (response) {
              $scope.listHoaDonChiTiet.push(response.data);
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
              $scope.removeItem();
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Đặt hàng thành công thành công",
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }
        });
      };
    }, 2000);

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

    // TODO: Lấy ra tất cả bản ghi của kiểu đế
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

    $scope.pageNumberSp = 0; // Trang hiện tại
    $scope.pageSizeSp = 20; // Số bản ghi trên mỗi trang
    // TODO: Get ALL sản phẩm tại quầy
    $scope.getListSanPhamTaiQuay = function () {
      $http
        .get(
          "http://localhost:8080/api/chi-tiet-sp/hien-thi?pageNumber=" +
            $scope.pageNumberSp +
            "&pageSize=" +
            $scope.pageSizeSp
        )
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          $scope.keyName = "";
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

    $scope.getPaginationNumbers = function () {
      var paginationNumbers = [];
      var totalPages = Math.ceil(
        $scope.listSanPhamTaiQuay.length / $scope.pageSizeSp
      );
      var startPage = Math.max(1, $scope.pageNumberSp - 3);
      var endPage = Math.min(startPage + 6, totalPages);

      for (var i = startPage; i <= endPage; i++) {
        paginationNumbers.push(i);
      }

      return paginationNumbers;
    };

    // TODO: Tìm kiếm sản phẩm
    $scope.key = "";
    $scope.searchSanPham = function () {
      $http
        .get(
          "http://localhost:8080/api/chi-tiet-sp/search-name?name=" + $scope.key
        )
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
        });
    };

    // TODO:  Lọc sản phẩm theo thương hiệu
    $scope.brand;
    $scope.filterBrand = function () {
      if ($scope.brand === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-brand?name=" +
              $scope.brand
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO: Lọc sản phẩm theo category
    $scope.locCategory;
    $scope.filterCategory = function () {
      if ($scope.locCategory === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-category?name=" +
              $scope.locCategory
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo kiểu đế
    $scope.locSole = "";
    $scope.filterSole = function () {
      if ($scope.locSole === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-sole?name=" +
              $scope.locSole
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo xuất xứ
    $scope.locOrigin = "";
    $scope.filterOrigin = function () {
      if ($scope.locOrigin === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-origin?name=" +
              $scope.locOrigin
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo size
    $scope.locSize;
    $scope.filterSize = function () {
      if ($scope.locSize === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-size?size=" +
              $scope.locSize
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo chất liệu
    $scope.locMaterial = "";
    $scope.filterMaterial = function () {
      if ($scope.locMaterial === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-material?name=" +
              $scope.locMaterial
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    // TODO:  Lọc sản phẩm theo màu sắc
    $scope.locMauSac = "";
    $scope.filterColor = function () {
      if ($scope.locMauSac === "") {
        $scope.getListSanPhamTaiQuay();
      } else {
        $http
          .get(
            "http://localhost:8080/api/chi-tiet-sp/filter-color?name=" +
              $scope.locMauSac
          )
          .then(function (response) {
            $scope.listSanPhamTaiQuay = response.data;
          });
      }
    };

    $scope.selectedOrder = null;
    $scope.selectOrder = function (hd) {
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
    };

    let scanner = new Instascan.Scanner({
      video: document.getElementById("preview"),
    });
    scanner.addListener("scan", function (content) {
      var idGioHang = CartService.getIdCart();
      $http
        .post(
          "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham-qrcode?idGioHang=" +
            idGioHang +
            "&qrCode=" +
            content,
          {}
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

    $scope.newKhachHang = {};

    setTimeout(() => {
      $scope.createKhachHang = function () {
        Swal.fire({
          title: "Thêm khách hàng?",
          text: "Bạn có muốn thêm không?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Thêm",
          cancelButtonText: "Hủy",
          reverseButtons: true, // Đảo ngược vị trí của nút Yes và No
        }).then((result) => {
          if (result.isConfirmed) {
            $scope.newKhachHang.tinh = $scope.selectedProvince.name;
            $scope.newKhachHang.huyen = $scope.selectedDistrict.name;
            $scope.newKhachHang.phuong = $scope.selectedWard.name;

            // Then make the API call to create the customer
            $http
              .post(
                "http://localhost:8080/api/khach-hang/create",
                $scope.newKhachHang
              )
              .then(function (response) {
                $scope.listKhachHang.push(response.data);
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

    $scope.listVoucher = [];
    $scope.getALlVoucher = function () {
      var totalOrderValue =
        tongTienTaiQuay -
        tienGiamGiaTaiQuay +
        ($scope.tienGiao ? +$scope.tienGiao : 0);
      $http
        .get("http://localhost:8080/api/v1/voucher-counter/show")
        .then(function (response) {
          $scope.listVoucher = response.data;
          var maxPriceVoucher = Math.max(
            ...$scope.listVoucher.map((voucher) => voucher.price)
          );
          if (maxPriceVoucher) {
            // $scope.listVoucher.forEach(function (voucher) {
            //   $scope.updateOrder(voucher.id, totalOrderValue);
            //   voucher.soLuongDung--;
            //   return;
            // });
          }
        });
    };

    $scope.getALlVoucher();

    $scope.voucherName = "";
    $scope.getVoucherName = function () {
      $http
        .get("http://localhost:8080/api/v1/voucher-counter/name?id=" + id)
        .then(function (response) {
          $scope.voucherName = response.data.voucherName;
        });
    };
    if (id != null) {
      $scope.getVoucherName();
    }

    $scope.updateOrder = function (idVoucher, thanhTien) {
      $http
        .put(
          "http://localhost:8080/api/v1/voucher-counter/update?idHoaDon=" +
            id +
            "&idVoucher=" +
            idVoucher +
            "&thanhTien=" +
            thanhTien
        )
        .then(function (response) {
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
          // $window.location.reload();
        });
    };
  }
);
