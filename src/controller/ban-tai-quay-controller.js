myApp.controller("BanTaiQuayController", [
  "$scope",
  "$http",
  "$window",
  "$timeout",
  function ($scope, $http, $window, $timeout) {
    $scope.selectedKhachHang = {}; // selected khách hàng fill tên
    $scope.listHoaDonTaiQuay = []; // show list hóa đơn tại quầy
    $scope.listCart = []; // show list sản phẩm trong giỏ hàng
    $scope.tongSoLuongSanPham = 0; // tính tổng số lượng sản phẩm có trong giỏ hàng
    $scope.tongTienHang = 0; // tính tổng tiền hàng
    $scope.luuSoLuong = 1; // lấy ra tất cả số lượng của sản phẩm đó
    $scope.idSanPhamChiTiet = 0; // lấy ra idsanphamchitiet
    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng
    $scope.showInput = false; // show input giao hàng
    $scope.transactiton = 1; // trang thái của transaction
    $scope.listHoaDonChiTiet = []; // list hóa đơn chi tiết
    $scope.listSanPhamTaiQuay = []; // list sản phẩm tại quầy để thêm vào giỏ hàng
    $scope.listKhachHang = []; // list khách hàng đã tồn tại
    $scope.listTransaction = []; // list transaction của hóa đơn đó
    $scope.codeOrder = ""; // lưu mã hóa đơn lại để truyền cộng thông tin sản phẩm or thanh toán
    $scope.createDate = ""; // lưu ngày tạo lại để truyền cộng thông tin sản phẩm or thanh toán

    // TODO: SHOW input giao hàng
    $scope.toggleInput = function () {
      $scope.showInput = !$scope.showInput;
    };

    $scope.selectedProductQuantity = function (quantity, id) {
      $scope.luuSoLuong = quantity;
      $scope.idSanPhamChiTiet = id;
    };

    // TODO: SHOW HÓA ĐƠN THEO ID
    $scope.showHoaDonTheoId = function (id, maHoaDon, ngayTao) {
      $scope.codeOrder = maHoaDon;
      $scope.createDate = ngayTao;
      $window.localStorage.setItem("idHoaDon", id);
      if ($scope.listHoaDonTaiQuay.length === 0) {
        $window.localStorage.removeItem("idHoaDon");
      }
      $scope.listSanPhamInCart();
      $scope.detailKhacHang();
    };

    // TODO: Hiển thị detail khách hàng
    $scope.detailKhacHang = function () {
      $http
        .get(
          "http://localhost:8080/api/khach-hang/search_khach_byid?id=" +
            idHoaDon
        )
        .then(function (response) {
          $scope.selectedKhachHang = response.data;
          $window.localStorage.setItem("ten", $scope.selectedKhachHang.ten);
        });
    };

    var tenKh = $window.localStorage.getItem("ten");

    // TODO: show sản phẩm trong giỏ hảng
    $scope.listSanPhamInCart = function () {
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?name=" + tenKh
        )
        .then(function (response) {
          $scope.listCart = response.data;
          // Tính tổng số lượng sản phẩm
          $scope.tongSoLuongSanPham = 0;
          for (var i = 0; i < $scope.listCart.length; i++) {
            $scope.tongSoLuongSanPham += $scope.listCart[i].soLuong;
            $scope.tongTienHang +=
              $scope.listCart[i].giaBan * $scope.listCart[i].soLuong;
          }
        })
        .catch(function (error) {});
    };

    var idHoaDon = $window.localStorage.getItem("idHoaDon");
    if (idHoaDon) {
      $scope.showHoaDonTheoId(idHoaDon);
    }

    // TODO: tự động click khi tạo hóa đơn mới
    $scope.selectHoaDon = function (hd) {
      // Unselect all other invoices
      $scope.listHoaDonTaiQuay.forEach(function (invoice) {
        invoice.isSelected = false;
      });

      // Select the clicked invoice
      hd.isSelected = true;
      console.log(hd.isSelected);
    };

    //TODO: Tạo hóa đơn
    $scope.createHoaDon = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      var api = "http://localhost:8080/api/v1/hoa-don/create";

      $http.post(api, {}, config).then(function (response) {
        $scope.listHoaDonTaiQuay.push(response.data);
        $scope.getListHoaDonTaiQuay();
        hd.isSelected = true;
      });
    };

    $scope.taoHoaDonAndCart = function () {
      $scope.createHoaDon();
    };

    //TODO: Get all hoa đơn tại quầy
    $scope.pageNumber = 0;
    $scope.pageSize = 4;
    $scope.getListHoaDonTaiQuay = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don/show?pageNumber=" +
            $scope.pageNumber +
            "&pageSize=" +
            $scope.pageSize
        )
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };
    $scope.getListHoaDonTaiQuay();

    $scope.searchOrder = function (ma) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/search/" + ma)
        .then(function (response) {
          $scope.listHoaDonTaiQuay = response.data;
        });
    };

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

    //TODO:thanh toán hóa đơn
    $scope.requestData = {
      idHoaDon: idHoaDon,
      tienKhachTra: "",
      tongTien: "",
      gioHangChiTietList: [],
    };

    $scope.createHoaDonChiTiet = function () {
      angular.forEach($scope.listCart, function (id) {
        $scope.requestData.gioHangChiTietList.push(id);
      });
      var api =
        "http://localhost:8080/api/v1/hoa-don/create-hoa-don-chi-tiet?idHoaDon=" +
        idHoaDon;
      $http.post(api, $scope.requestData).then(function (response) {
        $scope.listHoaDonChiTiet.push(response.data);
      });
    };

    // TODO: Get ALL sản phẩm tại quầy
    $scope.getListSanPhamTaiQuay = function () {
      $http
        .get("http://localhost:8080/api/chi-tiet-sp/hien-thi")
        .then(function (response) {
          $scope.listSanPhamTaiQuay = response.data;
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

    // thêm sản phẩm vào giỏ hàng
    var idGioHangChiTietId = $window.localStorage.getItem("idCartChiTiet");
    $scope.themSanPhamCart = function () {
      $http
        .post(
          "http://localhost:8080/api/gio-hang-chi-tiet/them-san-pham?idGioHang=" +
            idGioHangChiTietId +
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

    // lấy ra id cart
    $scope.idCartChiTiet = {};
    $scope.showIdCart = function (name) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don/id_cart?name=" + name)
        .then(function (response) {
          $scope.idCartChiTiet = response.data;
          $window.localStorage.setItem(
            "idCartChiTiet",
            $scope.idCartChiTiet.id
          );
        });
    };
    $scope.showIdCart(tenKh);

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
    $scope.updateKhachHang = function (idkhach) {
      $scope.getIdHoaDon = $window.localStorage.getItem("idHoaDon");
      $http
        .put(
          "http://localhost:8080/api/khach-hang/update-hoa-don?id= " +
            idkhach +
            "&idHoaDon=" +
            $scope.getIdHoaDon
        )
        .then(function (response) {
          $scope.getListHoaDonTaiQuay();
          $scope.detailKhacHang();
        });
    };

    // TODO: thêm khách hàng
    $scope.newKhachHang = {};
    $scope.createKhahHang = function () {
      $http
        .post(
          "http://localhost:8080/api/khach-hang/create",
          $scope.newKhachHang
        )
        .then(function (response) {
          $scope.listKhachHang.push(response.data);
          $scope.selectedKhachHang = response.data;
        });
    };

    // TODO: tạo giỏ hàng
    $scope.gioHangCart = [];
    $scope.createGioHang = function (idkhach) {
      $http
        .post("http://localhost:8080/api/gio-hang/tao-gio-hang", {})
        .then(function (response) {
          var idGioHang = response.data; // Retrieve the idGioHang
          $scope.gioHangCart.push(response.data);
          $http
            .put(
              "http://localhost:8080/api/gio-hang/update?idGioHang=" +
                idGioHang +
                "&idKhachHang=" +
                idkhach
            )
            .then(function (response) {});
        });
    };

    $scope.viewKhachAndUpdateHoaDon = function (id) {
      $scope.createGioHang(id);
      $scope.updateKhachHang(id);
    };

    // TODO:Show phương thức thanh toán của khách
    $scope.totalAmountPaid = 0;
    $scope.remainingAmount = 0;
    $scope.showTransaction = function () {
      $http
        .get("http://localhost:8080/api/v1/transaction/show?name=" + tenKh)
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
            idHoaDon +
            "&name=" +
            tenKh +
            "&phuongThuc=" +
            $scope.transactiton,
          $scope.newTransaction
        )
        .then(function (response) {
          $scope.listTransaction.push(response.data);
          $scope.showTransaction(tenKh);
        });
    };
  },
]);
