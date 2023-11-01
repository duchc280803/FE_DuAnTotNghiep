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
    $scope.idSanPhamChiTiet = 0; // lấy ra idsanphamchitiet
    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng
    $scope.showInput = false; // show input giao hàng
    $scope.listHoaDonChiTiet = []; // list hóa đơn chi tiết
    $scope.listSanPhamTaiQuay = []; // list sản phẩm tại quầy để thêm vào giỏ hàng
    $scope.listKhachHang = []; // list khách hàng đã tồn tại
    $scope.listTransaction = []; // list transaction của hóa đơn đó
    $scope.codeOrder = ""; // lưu mã hóa đơn lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.createDate = ""; // lưu ngày tạo lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.orderDetailCounter = {}; // hiển thị thông tin theo hóa đơn

    var id = $routeParams.id;

    $scope.detailOrderCounterDetail = function (id) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/order-counter/" + id)
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

    $scope.reloadTrang = function () {
      $location.path("/order-counter");
      $route.reload();
    };

    // TODO: SHOW input giao hàng
    $scope.toggleInput = function () {
      $scope.showInput = !$scope.showInput;
    };

    $scope.selectedProductQuantity = function (quantity, id) {
      $scope.luuSoLuong = quantity;
      $scope.idSanPhamChiTiet = id;
    };

    // TODO: show sản phẩm trong giỏ hảng
    $scope.pageNumber = 0;
    $scope.pageSize = 2;
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

    // TODO: Get ALL sản phẩm tại quầy
    $scope.getListSanPhamTaiQuay = function () {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp/hien-thi")
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
          $scope.keyName = "";
        });
    };
    $scope.getListSanPhamTaiQuay();

    // TODO: get one sản phẩm tại quầy
    $scope.showGetOneProduct = function (id) {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp/san-pham/" + id)
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
        });
    };

    // TODO: Tìm kiếm sản phẩm
    $scope.keyName = "";
    $scope.searchSanPham = function () {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp?name=" + $scope.keyName)
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
        });
    };

    // lấy ra id cart
    $scope.idCartChiTiet = {};
    $scope.showIdCart = function () {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/id_cart?id=" + id)
        .then(function (response) {
          $scope.idCartChiTiet = response.data;
          $window.localStorage.setItem("gioHangId", $scope.idCartChiTiet.id);
        });
    };
    $scope.showIdCart(idKhach);

    // TODO: thêm sản phẩm vào giỏ hàng
    var gioHangId = $window.localStorage.getItem("gioHangId");
    $scope.themSanPhamCart = function () {
      $http
        .post(
          "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
            gioHangId +
            "&idSanPhamChiTiet=" +
            $scope.idSanPhamChiTiet +
            "&soLuong=" +
            $scope.soLuongSanPham,
          {}
        )
        .then(function (response) {
          $scope.listCart.push(response.data);
          $scope.listSanPhamInCart();
        })
        .catch(function (error) {});
    };
    console.log(gioHangId);

    // cập nhập sản phẩm trong giỏ hàng
    $scope.updateCart = function (idGioHangChiTiet) {
      $http
        .put(
          "http://localhost:8080/api/gio-hang-chi-tiet/update-quantity?idgiohangchitiet=" +
            idGioHangChiTiet +
            "&quantity=" +
            $scope.soLuongSanPham,
          {}
        )
        .then(function (response) {
          $scope.listSanPhamInCart();
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

    // TODO: thanh toán
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
          $scope.showTransaction();
        });
    };

    // TODO: thanh toán
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
          $window.location.href = response.data.value;
        });
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
        "http://localhost:8080/api/v1/hoa-don/create-hoa-don-chi-tiet?idHoaDon=" +
        id;
      $http.post(api, requestData).then(function (response) {
        $scope.listHoaDonChiTiet.push(response.data);
        $location.path("/order-counter");
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
        "http://localhost:8080/api/v1/hoa-don/create-hoa-don-chi-tiet-giao?idHoaDon=" +
        id;
      $http.post(api, requestData).then(function (response) {
        $scope.listHoaDonChiTiet.push(response.data);
        $location.path("/order-counter");
      });
    };
  },
]);
