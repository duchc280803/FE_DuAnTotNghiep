myApp.controller("BanTaiQuayController", [
  "$scope",
  "$http",
  "$window",
  "$routeParams",
  "$route",
  "$location",
  function ($scope, $http, $window, $routeParams, $route, $location) {
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
      window.localStorage.setItem("idHoaDon", id);
      $route.reload();
      $location.path("/order-counter");
    };

    var id = $window.localStorage.getItem("idHoaDon");

    $scope.listHoaDonTaiQuay = []; // show list hóa đơn tại quầy
    // tạo hóa đơn
    $scope.createHoaDon = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var api = "http://localhost:8080/api/v1/don-hang/create";

      $http.post(api, {}, config).then(function (response) {
        $scope.listHoaDonTaiQuay.push(response.data);
        $scope.getListHoaDonTaiQuay();
        var newHoaDonId = response.data.id;
        console.log(newHoaDonId);

        // Chọn hóa đơn mới tạo
        $scope.luuIdHoaDon(newHoaDonId);
      });
    };

    //TODO: Get all hoa đơn tại quầy
    $scope.pageNumber = 0;
    $scope.pageSize = 4;
    $scope.getListHoaDonTaiQuay = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/don-hang/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };
    $scope.getListHoaDonTaiQuay();

    // hiển thị số trang
    $scope.getPageNumbers = function () {
      var totalPages = Math.ceil(
        $scope.listHoaDonTaiQuay.length / $scope.pageSize
      );
      var pageNumbers = [];
      for (var i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    };

    // TODO: updatePage
    $scope.updatePage = function (pageNumber) {
      $scope.pageNumber = pageNumber;
      $scope.getListHoaDonTaiQuay();
    };

    // TODO: Quay lại trang
    $scope.previousPage = function () {
      if ($scope.pageNumber > 0) {
        $scope.pageNumber--;
        $scope.getListHoaDonTaiQuay();
      }
    };

    // TODO: tiến đến trang khác
    $scope.nextPage = function () {
      $scope.pageNumber++;
      $scope.getListHoaDonTaiQuay();
    };

    // tìm kiếm hóa đơn
    $scope.searchOrder = function (ma) {
      $http
        .get("http://localhost:8080/api/v1/don-hang/search/" + ma)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };

    $scope.detailOrderCounterDetail = function (id) {
      $http
        .get("http://localhost:8080/api/v1/don-hang/order-counter/" + id)
        .then(function (response) {
          $scope.orderDetailCounter = response.data;
          $window.localStorage.setItem(
            "idKhach",
            $scope.orderDetailCounter.idKhach
          );
        });
    };

    $scope.detailOrderCounterDetail(id);

    var idKhach = $window.localStorage.getItem("idKhach");

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
    $scope.pageSize = 3;
    $scope.listSanPhamInCart = function () {
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?id=" +
            idKhach +
            "&pageNumber=0&pageSize=9999" // Fetch all products in a single request
        )
        .then(function (response) {
          $scope.listCart = response.data;
          $window.localStorage.setItem(
            "listCart",
            $scope.listCart.map((item) => item.idGioHang)
          );
          $scope.tongSoLuongSanPham = 0;
          $scope.tongTienHang = 0;

          // Calculate the total quantity and total price for all products in the cart
          for (var i = 0; i < $scope.listCart.length; i++) {
            $scope.tongSoLuongSanPham += $scope.listCart[i].soLuong;
            $scope.tongTienHang +=
              $scope.listCart[i].giaBan * $scope.listCart[i].soLuong;
          }

          // Slice the listCart array to display only 2 products per page
          $scope.listCart = $scope.listCart.slice(
            $scope.pageNumber * $scope.pageSize,
            ($scope.pageNumber + 1) * $scope.pageSize
          );
        });
    };
    $scope.listSanPhamInCart();
    var idGioHangChiTiet = $window.localStorage.getItem("listCart");
    var gioHangChiTietList = idGioHangChiTiet.split(",");
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

    // lấy ra id cart
    $scope.idCartChiTiet = {};
    $scope.showIdCart = function () {
      $http
        .get("http://localhost:8080/api/v1/don-hang/id_cart?id=" + id)
        .then(function (response) {
          $scope.idCartChiTiet = response.data;
          $window.localStorage.setItem("gioHangId", $scope.idCartChiTiet.id);
        });
    };
    $scope.showIdCart(idKhach);

    // TODO: thêm sản phẩm vào giỏ hàng
    var gioHangId = $window.localStorage.getItem("gioHangId");
    $scope.themSanPhamCart = function (idCtSp, soLuongSanPham) {
      $http
        .post(
          "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
            gioHangId +
            "&idSanPhamChiTiet=" +
            idCtSp +
            "&soLuong=" +
            soLuongSanPham,
          {}
        )
        .then(function (response) {
          $scope.listCart.push(response.data);
          $scope.listSanPhamInCart();
        })
        .catch(function (error) {});
    };
    // cập nhập sản phẩm trong giỏ hàng
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
            $scope.listSanPhamInCart();
          },
        ],
      });
    };

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

    // update khách hàng vào hóa đơn
    $scope.updateKhachHang = function (idcustom) {
      $http
        .put(
          "http://localhost:8080/api/khach-hang/update-hoa-don?id= " +
            idcustom +
            "&idHoaDon=" +
            id +
            "&idGioHang=" +
            gioHangId
        )
        .then(function (response) {
          $scope.detailOrderCounterDetail(id);
          $scope.getListHoaDonTaiQuay(); 
        });
    };

    // TODO: thêm khách hàng
    $scope.newKhachHang = {};
    $scope.createKhachHang = function () {
      $http
        .post(
          "http://localhost:8080/api/khach-hang/create",
          $scope.newKhachHang
        )
        .then(function (response) {
          $scope.listKhachHang.push(response.data);
          $scope.showKhachHang();
        });
    };

    // delete sản phẩm trong giỏ hàng
    $scope.deleteProduct = function (event, index) {
      event.preventDefault();
      let p = $scope.listCart[index];
      $http
        .delete(
          "http://localhost:8080/api/gio-hang-chi-tiet/delete_product?id=" +
            p.idGioHang
        )
        .then(function () {
          $scope.listCart.splice(index, 1);
        });
    };

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

    $scope.showTransaction();

    // TODO: thanh toán tiền mặt
    $scope.newTransaction = {};
    $scope.createTransaction = function () {
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
          $scope.showTransaction();
        });
    };

    // TODO: thanh toán chuyển khoản
    $scope.newTransactionVnPay = {};
    $scope.createTransactionVnpay = function (amount) {
      $scope.newTransactionVnPay = {
        amountParam: amount,
      };
      $http
        .post(
          "http://localhost:8080/api/v1/transaction/create-pay?idHoaDon=" +
            id +
            "&id=" +
            idKhach,
          $scope.newTransactionVnPay
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
        });
    };

    // TODO: ApiVNPay
    $scope.Vnpay = function (amount) {
      $scope.newTransactionVnPay = {
        amountParam: amount,
      };
      $http
        .post(
          "http://localhost:8080/api/v1/transaction/pay?amoutParam=" +
            $scope.newTransactionVnPay
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
          $window.location.href = response.data.value;
        });
    };

    $scope.tongHopThanhToan = function (amount) {
      $scope.Vnpay(amount);
      if ($location.path() === "/admin/index.html") {
        $scope.createTransactionVnpay(amount);
      }
    };

    //TODO:thanh toán hóa đơn
    $scope.createHoaDonChiTiet = function (
      tongTienHang,
      tienKhachTra,
      tienThua,
      hoTen,
      soDienThoai,
      diaChi
    ) {
      var requestData = {
        tongTien: tongTienHang,
        tienKhachTra: tienKhachTra,
        tienThua: tienThua,
        hoTen: hoTen,
        soDienThoai: soDienThoai,
        diaChi: diaChi,
        gioHangChiTietList: gioHangChiTietList,
      };
      var api =
        "http://localhost:8080/api/v1/don-hang/create-hoa-don-chi-tiet?idHoaDon=" +
        id;
      $http.post(api, requestData).then(function (response) {
        $scope.listHoaDonChiTiet.push(response.data);
        $window.localStorage.removeItem('idHoaDon');
        $route.reload();
        $location.path("/hoa-don");
      });
    };

    //TODO:thanh toán hóa đơn
    $scope.createHoaDonChiTietGiao = function (
      tongTienHang,
      tienKhachTra,
      tienThua
    ) {
      var requestData = {
        tongTien: tongTienHang,
        tienKhachTra: tienKhachTra,
        tienThua: tienThua,
        tienGiao: $scope.tienGiao,
        hoTen: $scope.hoTen,
        tenNguoiShip: $scope.tenNguoiShip,
        soDienThoaiNguoiShip: $scope.soDienThoaiNguoiShip,
        soDienThoai: $scope.soDienThoai,
        diaChi: $scope.diaChi,
        gioHangChiTietList: gioHangChiTietList,
      };
      var api =
        "http://localhost:8080/api/v1/don-hang/create-hoa-don-chi-tiet-giao?idHoaDon=" +
        id;
      $http.post(api, requestData).then(function (response) {
        $scope.listHoaDonChiTiet.push(response.data);
        $location.path("/hoa-don");
      });
    };

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

    // TODO: Lấy ra tất cả bản ghi của xuất xứ
    $scope.listXuatXu = [];
    $scope.getListXuatXu = function () {
      $http
        .get("http://localhost:8080/api/v1/xuat-xu/show")
        .then(function (response) {
          $scope.listXuatXu = response.data;
        });
    };
    $scope.getListXuatXu();

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
    $scope.pageSizeSp = 8; // Số bản ghi trên mỗi trang
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
  },
]);
