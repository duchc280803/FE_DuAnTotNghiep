myApp.controller("BanTaiQuayController", function ($scope, $http, $window) {
  $scope.selectedKhachHang = {};
  // TODO: SHOW HÓA ĐƠN THEO ID
  $scope.showHoaDonTheoId = function (id) {
    $window.localStorage.setItem("idHoaDon", id);
    var idHoaDon = $window.localStorage.getItem("idHoaDon");

    $http
      .get(
        "http://localhost:8080/api/khach-hang/search_khach_byid?id=" + idHoaDon
      )
      .then(function (response) {
        $scope.selectedKhachHang = response.data;
      });
  };
  var idHoaDon = $window.localStorage.getItem("idHoaDon");
  if (idHoaDon) {
    $scope.showHoaDonTheoId(idHoaDon);
  }
  // TODO: SHOW HÓA ĐƠN THEO ID

  //TODO: Get all hoa đơn tại quầy
  $scope.listHoaDonTaiQuay = [];

  $scope.getListHoaDonTaiQuay = function () {
    $http
      .get("http://localhost:8080/api/v1/hoa-don/show")
      .then(function (response) {
        $scope.listHoaDonTaiQuay = response.data;
      });
  };

  $scope.getListHoaDonTaiQuay();

  //TODO: Tạo hóa đơn
  $scope.createHoaDon = function () {
    if ($scope.listHoaDonTaiQuay.length >= 5) {
      // Swal.fire({
      //   position: "bottom-end", // Change the position to bottom right corner
      //   icon: "success",
      //   title: "Tối đa chỉ được 5 hóa đơn",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
      alert("Tối đa chỉ được 5 hóa đơn");
      return;
    }
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
    });
  };

  // TODO: Get ALL sản phẩm tại quầy
  $scope.listSanPhamTaiQuay = [];

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
    console.log(id);
    $http
      .get("http://localhost:8080/api/chi-tiet-sp/san-pham/" + id)
      .then(function (response) {
        $scope.listSanPhamTaiQuay = response.data;
        console.log();
      });
  };

  $scope.chonSanPham = function () {
    const form = document.createElement("div");
    form.innerHTML = `
  <div class="product__details__quantity">
    <div class="quantity">
        <div class="pro-qty">
            <span class="dec qtybtn" onclick="decrement()">-</span>
              <input id="quantityInput" type="text" value="1" />
                <span class="inc qtybtn" onclick="increment()">+</span>
        </div>
    </div>
  </div>
  `;
    Swal.fire({
      title: "Adjust Quantity",
      html: form,
      showCancelButton: true,
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "OK",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = document.getElementById("quantity").value;
        Swal.fire(
          "Quantity Updated!",
          `You selected ${quantity} items.`,
          "success"
        );
      }
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

  // TODO: Hiển thị sản phẩm cố trong giỏ hàng
  $scope.listCart = [];
  $scope.showProductCart = function (idgh) {
    $http
      .get("http://localhost:8080/api/gio-hang-chi-tiet/hien-thi?idgh=" + idgh)
      .then(function (response) {
        $scope.listCart = response.data;
      });
  };

  // TODO: Hiển thị khách hàng
  $scope.listKhachHang = [];
  $scope.showKhachHang = function () {
    $http
      .get("http://localhost:8080/api/khach-hang/hien-thi")
      .then(function (response) {
        $scope.listKhachHang = response.data;
      });
  };
  $scope.showKhachHang();

  // TODO: Hiển thị detail khách hàng

  $scope.detailKhacHang = function (id) {
    $http
      .get(
        "http://localhost:8080/api/khach-hang/detail?id=" +
          id +
          "&idHoaDon=" +
          idHoaDon
      )
      .then(function (response) {
        $scope.selectedKhachHang = response.data;
      });
  };
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
      .then(function (response) {});
  };

  // TODO: thêm khách hàng
  $scope.newKhachHang = {};
  $scope.createKhahHang = function () {
    $http
      .post("http://localhost:8080/api/khach-hang/create", $scope.newKhachHang)
      .then(function (response) {
        $scope.listKhachHang.push(response.data);
        $scope.selectedKhachHang = response.data;
      });
  };

  // TODO: tạo giỏ hàng
  $scope.listCart = [];
  $scope.getIdCart = "";

  $scope.createGioHang = function () {
    var token = $window.localStorage.getItem("token"); // Lấy token từ local storage

    var config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
    $http
      .post("http://localhost:8080/api/gio-hang/tao-gio-hang", {}, config)
      .then(function (response) {
        $scope.listCart.push(response.data);
        $window.localStorage.setItem("idCart", response.data);
      });
  };

  // update khách hàng vào hóa đơn
  $scope.updateGioHangKhach = function (idkhach) {
    var idCart = $window.localStorage.getItem("idCart");
    $http
      .put(
        "http://localhost:8080/api/gio-hang/update?idGioHang= " +
          idCart +
          "&idKhachHang=" +
          idkhach
      )
      .then(function (response) {});
  };

  $scope.viewKhachAndUpdateHoaDon = function (id) {
    $scope.updateKhachHang(id);
    $scope.detailKhacHang(id);
  };
});
