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
    $scope.hoaDonChiTiet = {};
    $scope.getHoaDonChiTiet = function () {
      const apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" + id;
      $http.get(apiUrl).then(function (response) {
        $scope.hoaDonChiTiet = response.data;
      });
    };
    $scope.getHoaDonChiTiet();

    $scope.listSanPhamInOrder = [];
    $scope.tongTienKhongGiam = 0;
    $scope.tongTienSauGiam = 0;
    $scope.tongTienKhongGiamHoanTra = 0;
    $scope.tongTienSauGiamHoanTra = 0;
    $scope.tongTienHoanTra = 0;

    // Hàm để tải sản phẩm từ API
    $scope.getSanPham = function () {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-san-pham/" + id;

      $http.get(apiUrl).then(function (response) {
        // Gán dữ liệu sản phẩm vào biến $scope.hoaDonChiTiet.sanPham
        $scope.listSanPhamInOrder = response.data;
        for (var i = 0; i < $scope.listSanPhamInOrder.length; i++) {
          if (
            $scope.listSanPhamInOrder[i].donGiaSauGiam !=
              $scope.listSanPhamInOrder[i].giaBan &&
            $scope.listSanPhamInOrder[i].trangThai == 7
          ) {
            $scope.tongTienSauGiamHoanTra +=
              $scope.listSanPhamInOrder[i].donGiaSauGiam *
              $scope.listSanPhamInOrder[i].soLuong;
          }
          if (
            $scope.listSanPhamInOrder[i].donGiaSauGiam ==
              $scope.listSanPhamInOrder[i].giaBan &&
            $scope.listSanPhamInOrder[i].trangThai == 7
          ) {
            $scope.tongTienKhongGiamHoanTra +=
              $scope.listSanPhamInOrder[i].giaBan *
              $scope.listSanPhamInOrder[i].soLuong;
          }
        }
        $scope.tongTienHoanTra =
          $scope.tongTienSauGiamHoanTra + $scope.tongTienKhongGiamHoanTra;
      });
    };

    $scope.getSanPham();

    $scope.soTienKhachTra = 0;
    $scope.soTienHoan = 0;
    $scope.getlichSuThanhToan = function () {
      var apiUrl =
        "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-lich-su/" + id;

      $http.get(apiUrl).then(function (response) {
        $scope.lichSu = response.data;
        for (var i = 0; i < $scope.lichSu.length; i++) {
          if ($scope.lichSu[i].tenLoai == "Khách thanh toán") {
            $scope.soTienKhachTra += $scope.lichSu[i].soTienTra;
          }
          if ($scope.lichSu[i].tenLoai == "Nhân viên hoàn tiền") {
            $scope.soTienHoan += $scope.lichSu[i].soTienTra;
          }
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
          $scope.getHoaDonChiTiet();
          $scope.getSanPham();
          $scope.getlichSuThanhToan();
          $scope.getlichSuThayDoi();
          $scope.selectMoney(id);
          $scope.getTongTienHang();
          $scope.getOrderDetailUpdate();
          $window.location.reload();
        });
    };

    $scope.newOrderClient = {};
    $scope.confirmOrderClient = function () {
      $http
        .put(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/confirm-order-client/" +
            id,
          $scope.newOrderClient
        )
        .then(function (response) {
          $scope.getHoaDonChiTiet();
          $scope.getSanPham();
          $scope.getlichSuThanhToan();
          $scope.getlichSuThayDoi();
          $scope.selectMoney(id);
          $scope.getTongTienHang();
          $scope.getOrderDetailUpdate();
          $window.location.reload();
        });
    };

    $scope.soLuongSanPham = 1; // số lượng thêm vào giỏ hàng

    setTimeout(() => {
      $scope.themSanPhamHoaDonChiTiet = function (idCtSp, soLuongSanPham) {
        var token = $window.localStorage.getItem("token");

        var config = {
          headers: {
            Authorization: "Bearer " + token,
          },
        };
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
                {},
                config
              )
              .then(function (response) {
                $scope.listSanPhamInOrder.push(response.data);
                $scope.getHoaDonChiTiet();
                $scope.getSanPham();
                $scope.getlichSuThanhToan();
                $scope.getlichSuThayDoi();
                $scope.selectMoney(id);
                $scope.getTongTienHang();
                $scope.getOrderDetailUpdate();
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
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $scope.updateOrder = function (idHoaDonChiTiet, soLuong) {
        var apiURL =
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/update-quantity?idHoaDonChiTiet=" +
          idHoaDonChiTiet +
          "&quantity=" +
          soLuong;
        $http({
          url: apiURL,
          method: "PUT",
          headers: config.headers,
          transformResponse: [
            function () {
              $scope.getHoaDonChiTiet();
              $scope.getSanPham();
              $scope.getlichSuThanhToan();
              $scope.getlichSuThayDoi();
              $scope.selectMoney(id);
              $scope.getTongTienHang();
              $scope.getOrderDetailUpdate();
              $window.location.reload();
            },
          ],
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
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .post(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/tra-hang?idhdct=" + id,
          JSON.stringify($scope.newOrderDetail),
          config
        )
        .then(function (response) {
          $scope.listSanPhamInOrder.push(response.data);
          $scope.getlichSuThanhToan();
          $scope.getHoaDonChiTiet();
          $scope.getSanPham();
          $scope.getlichSuThayDoi();
          $scope.selectMoney(id);
          $scope.getTongTienHang();
          $scope.getOrderDetailUpdate();
          $window.location.reload();
        });
    };

    // delete sản phẩm trong giỏ hàng
    $scope.deleteProduct = function (event, index) {
      event.preventDefault();
      let p = $scope.listSanPhamInOrder[index];
      var token = $window.localStorage.getItem("token");

      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      $http
        .delete(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/delete?idHoaDon=" +
            id +
            "&id=" +
            p.idHoaDonChiTiet,
          config
        )
        .then(function () {
          $scope.listSanPhamInOrder.splice(index, 1);
          $scope.getHoaDonChiTiet();
          $scope.getSanPham();
          $scope.getlichSuThanhToan();
          $scope.getlichSuThayDoi();
          $scope.selectMoney(id);
          $scope.getTongTienHang();
          $scope.getOrderDetailUpdate();
          $location.path("/order-detail/" + id);
        });
    };

    $scope.fillMoney = {};
    $scope.selectMoney = function (id) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don-chi-tiet/thanh-tien/" + id)
        .then(function (response) {
          $scope.fillMoney = response.data;
        });
    };
    $scope.selectMoney(id);

    $scope.traHangis = false;
    $scope.isTraHang = function (id) {
      $http
        .get("http://localhost:8080/api/v1/hoa-don-chi-tiet/tra-hang/" + id)
        .then(function (response) {
          $scope.traHangis = response.data;
        });
    };
    $scope.isTraHang(id);

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

    $scope.orderDetailUpdate = {};
    $scope.getOrderDetailUpdate = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/order-detail-update/" +
            id
        )
        .then(function (response) {
          $scope.orderDetailUpdate = response.data;
        });
    };

    $scope.getOrderDetailUpdate();

    $scope.generatePDF = function () {
      $http
        .get("http://localhost:8080/api/v1/pdf/pdf/generate/" + id, {
          responseType: "arraybuffer",
        })
        .then(function (response) {
          var file = new Blob([response.data], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(file);
          var a = document.createElement("a");
          a.href = fileURL;
          a.download =
            "pdf_" +
            new Date().toISOString().slice(0, 19).replace(/:/g, "-") +
            ".pdf";
          document.body.appendChild(a);
          a.click();
        });
    };

    $scope.tongTienHang = 0;
    $scope.getTongTienHang = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/hoa-don-chi-tiet/tong-tien-don-hang/" +
            id
        )
        .then(function (response) {
          $scope.tongTienHang = response.data;
        });
    };

    $scope.getTongTienHang();
  }
);
