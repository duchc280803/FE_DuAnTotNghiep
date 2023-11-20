myApp.controller(
  "hoaDonChiTietController",
  function ($http, $scope, $routeParams, $window, StatusService) {
    // Xác định `id` từ `$routeParams`
    var id = $routeParams.id;

    const breadcrumbSteps = document.querySelectorAll(".breadcrumb__step");
    // Xử lý sự kiện breadcrumb nếu cần
    for (let i = 0; i < breadcrumbSteps.length; i++) {
      const item = breadcrumbSteps[i];
      item.onclick = () => {
        // Loại bỏ lớp 'breadcrumb__step--active' khỏi tất cả các breadcrumb
        breadcrumbSteps.forEach((step) => {
          step.classList.remove("breadcrumb__step--active");
        });

        // Đánh dấu breadcrumb hiện tại và tất cả các breadcrumb trước nó
        for (let j = 0; j <= i; j++) {
          breadcrumbSteps[j].classList.add("breadcrumb__step--active");
        }
      };
    }

    // Gọi hàm để lấy dữ liệu chi tiết hoá đơn dựa trên `id`
    function getHoaDonChiTiet() {
      const apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" + id;
      $http.get(apiUrl).then(function (response) {
        $scope.hoaDonChiTiet = response.data;
      });
    }
    getHoaDonChiTiet();

    $scope.listSanPhamInOrder = [];
    $scope.tongTienKhongGiam = 0;
    $scope.tongTienSauGiam = 0;
    $scope.tongTienHang = 0;

    // Hàm để tải sản phẩm từ API
    function getSanPham() {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-san-pham/" + id;

      $http.get(apiUrl).then(function (response) {
        // Gán dữ liệu sản phẩm vào biến $scope.hoaDonChiTiet.sanPham
        $scope.listSanPhamInOrder = response.data;
        for (var i = 0; i < $scope.listSanPhamInOrder.length; i++) {
          if ($scope.listSanPhamInOrder[i].donGiaSauGiam != 0) {
            $scope.tongTienSauGiam +=
              $scope.listSanPhamInOrder[i].donGiaSauGiam *
              $scope.listSanPhamInOrder[i].soLuong;
          }
          if ($scope.listSanPhamInOrder[i].donGiaSauGiam == 0) {
            $scope.tongTienKhongGiam +=
              $scope.listSanPhamInOrder[i].giaBan *
              $scope.listSanPhamInOrder[i].soLuong;
          }
        }
        $scope.tongTienHang = $scope.tongTienSauGiam + $scope.tongTienKhongGiam;
      });
    }

    getSanPham();

    $scope.soTienKhachTra = 0;
    $scope.getlichSuThanhToan = function () {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-lich-su/" + id;

      $http.get(apiUrl).then(function (response) {
        $scope.lichSu = response.data;
        for (var i = 0; i < $scope.lichSu.length; i++) {
          $scope.soTienKhachTra += $scope.lichSu[i].soTienTra;
        }
      });
    };
    $scope.getlichSuThanhToan();

    // Gọi hàm để lấy dữ liệu lịch trạng thái sử dựa trên `id`
    $scope.lichSuThayDoi = [];

    $scope.getlichSuThayDoi = function () {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-trang-thai/" +
        id;

      $http.get(apiUrl).then(function (response) {
        $scope.lichSuThayDoi = response.data;
      });
    };

    $scope.getlichSuThayDoi();

    $scope.newStatusOrder = {
      ghiChu: "",
      newTrangThai: "",
    };

    $scope.comfirmStatusOrder = function () {
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .post(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order/" + id,
          JSON.stringify($scope.newStatusOrder),
          config
        )
        .then(function (response) {
          $scope.lichSuThayDoi.push(response.data);
          $scope.getlichSuThayDoi();
          $scope.getlichSuThanhToan();
          getSanPham();
          console.log($scope.newStatusOrder.newTrangThai);
          $window.location.reload();
        });
    };

    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng

    setTimeout(() => {
      $scope.themSanPhamHoaDonChiTiet = function (idCtSp, soLuongSanPham) {
        Swal.fire({
          title: "Bạn có muốn thêm sản phẩm này vào giỏ?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes!",
        }).then((result) => {
          if (result.isConfirmed) {
            $http
              .post(
                "http://localhost:8080/api/v1/hoa-don-chi-tiet/them-san-pham?idHoaDon=" +
                  id +
                  "&idSanPhamChiTiet=" +
                  idCtSp +
                  "&soLuong=" +
                  soLuongSanPham,
                {}
              )
              .then(function (response) {
                $scope.listSanPhamInOrder.push(response.data);
                $scope.getlichSuThayDoi();
                $scope.getlichSuThanhToan();
                getSanPham();
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Thêm sản phẩm thành công",
                  showConfirmButton: false,
                  timer: 1500,
                });
              })
              .catch(function (error) {});
          }
        });
      };
    }, 2000);

    // cập nhập sản phẩm trong hóa đơn
    setTimeout(() => {
      $scope.updateOrder = function (idHoaDonChiTiet, soLuong) {
        var apiURL =
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/update-quantity?idHoaDonChiTiet=" +
          idHoaDonChiTiet +
          "&quantity=" +
          soLuong;
        $http({
          url: apiURL,
          method: "PUT",
          transformResponse: [
            function () {
              $scope.getlichSuThayDoi();
              $scope.getlichSuThanhToan();
              getSanPham();
              $scope.getAllMoneyByHoaDon();
              $window.location.reload();
            },
          ],
        });
      };
    }, 2000);

    // xác nhận khách thanh toán
    $scope.newTransaction = {
      soTien: "",
      ghiChu: "",
      trangThai: "",
    };
    setTimeout(() => {
      $scope.createTransaction = function (idKhach) {
        $http
          .post(
            "http://localhost:8080/api/v1/hoa-don-chi-tiet/thanh-toan-hoa-don-online?idHoaDon=" +
              id +
              "&id=" +
              idKhach,
            $scope.newTransaction
          )
          .then(function (response) {
            $scope.lichSu.push(response.data);
            $scope.getlichSuThanhToan();
          });
      };
    }, 2000);

    $scope.button1Clicked = function (idKhach) {
      $scope.newTransaction.trangThai = 1;
      $scope.createTransaction(idKhach);
    };

    $scope.button2Clicked = function (idKhach) {
      $scope.newTransaction.trangThai = 2;
      $scope.createTransaction(idKhach);
    };

    $scope.thongTinTienDonHang = {};
    $scope.getAllMoneyByHoaDon = function () {
      $http
        .get("http://localhost:8080/api/v1/hoa-don-chi-tiet/thanh-tien/" + id)
        .then(function (response) {
          $scope.thongTinTienDonHang = response.data;
        });
    };
    $scope.getAllMoneyByHoaDon();

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
    $scope.pageSizeSp = 5; // Số bản ghi trên mỗi trang
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

    $scope.fillProductTraHang = {};
    $scope.selectProductTraHang = function (id) {
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/detail-product?idhdct=" +
            id
        )
        .then(function (response) {
          $scope.fillProductTraHang = response.data;
        });
    };

    $scope.id = function (id) {
      console.log(id);
    };

    $scope.newOrderDetail = {};
    $scope.traHang = function (id) {
      $http
        .post(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/tra-hang?idhdct=" + id,
          JSON.stringify($scope.newOrderDetail)
        )
        .then(function (response) {
          $scope.listSanPhamInOrder.push(response.data);
          console.log(id);
          $scope.getlichSuThayDoi();
          $scope.getlichSuThanhToan();
          getSanPham();
        });
    };

    // delete sản phẩm trong giỏ hàng
    $scope.deleteProduct = function (event, index) {
      event.preventDefault();
      let p = $scope.listSanPhamInOrder[index];
      $http
        .delete(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/delete?id=" +
            p.idHoaDonChiTiet
        )
        .then(function () {
          $scope.listSanPhamInOrder.splice(index, 1);
          $scope.getlichSuThayDoi();
          $scope.getlichSuThanhToan();
          getSanPham();
          $scope.getAllMoneyByHoaDon();
          $location.path('/order-detail/' + id)
        });
    };
  }
);
