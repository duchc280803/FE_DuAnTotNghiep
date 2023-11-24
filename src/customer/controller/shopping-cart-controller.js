var idgh = localStorage.getItem("idgiohang");
myAppCustom.controller(
  "CartController",
  function ($scope, $http, $window, $location, $route, $routeParams) {
    function loadToTals() {
      // Gọi API và cập nhật giá trị totalAmount
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/total-amount?idgh=" +
          idgh
        )
        .then(function (response) {
          // Lấy giá trị tổng tiền từ phản hồi API
          $scope.totalAmount = response.data[0].tongSoTien;
          $window.localStorage.setItem("totalAmount", $scope.totalAmount);
          if (!$scope.giamGiaVoucher) {
            $scope.tongCong = totalAmount;
          } else {
            // Tính tổng cộng dựa trên giá trị giảm giá
            $scope.tongCong = totalAmount - $scope.giamGiaVoucher;
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });

    } //close loadToTal()

    loadToTals();
    // Hàm thay đổi số lượng sản phẩm
    $scope.changeQuantity = function (product, change) {
      if (change === "increase") {
        product.soluong++;
        Swal.fire({
          title: "Success",
          text: "Thêm số lượng thành công",
          icon: "success",
          position: "bottom-start", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
      } else if (change === "decrease" && product.soluong > 1) {
        product.soluong--;
        Swal.fire({
          title: "Success",
          text: "Giảm số lượng thành công",
          icon: "success",
          position: "bottom-start", // Đặt vị trí ở góc trái
          toast: true, // Hiển thị thông báo nhỏ
          showConfirmButton: false, // Ẩn nút xác nhận
          timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
        });
      }
      // Gọi API để cập nhật số lượng
      console.log(product.id);
      console.log(product.soluong);
      updateQuantity(product.id, product.soluong);
    };

    // Hàm gọi API cập nhật số lượng
    function updateQuantity(productId, newQuantity) {
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/update-quantity?idgiohangchitiet=" +
        productId +
        "&quantity=" +
        newQuantity;

      $http({
        url: apiURL,
        method: "PUT",
        transformResponse: [
          function () {
            loadCart();
            loadToTals();
            loadNameAndPrice();
            loadQuanTiTy();
          },
        ],
      });

    }

    //delete product
    $scope.deleteProduct = function (productId) {
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-san-pham?idgiohangchitiet=" +
        productId;

      $http({
        url: apiURL,
        method: "DELETE",
        transformResponse: [
          function () {
            Swal.fire({
              title: "Success",
              text: "Xóa thành công",
              icon: "success",
              position: "bottom-start", // Đặt vị trí ở góc trái
              toast: true, // Hiển thị thông báo nhỏ
              showConfirmButton: false, // Ẩn nút xác nhận
              timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
            });
            loadCart();
            loadToTals();
            loadNameAndPrice();
            loadQuanTiTy();
          },
        ],
      });
    };

    //delete all product
    $scope.clearCart = function () {
      Swal.fire({
        title: "Xác nhận xóa?",
        text: "Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          if (idgh) {

            var apiURL =
              "http://localhost:8080/api/gio-hang-chi-tiet-not-login/xoa-tat-ca-san-pham?idGioHang=" +
              idgh;

            $http({
              url: apiURL,
              method: "DELETE",
              transformResponse: [
                function () {
                  Swal.fire({
                    title: "Success",
                    text: "Xóa thành công",
                    icon: "success",
                    position: "bottom-start", // Đặt vị trí ở góc trái
                    toast: true, // Hiển thị thông báo nhỏ
                    showConfirmButton: false, // Ẩn nút xác nhận
                    timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
                  });
                  localStorage.removeItem("idgiohang");
                  localStorage.removeItem("idVoucher");
                  localStorage.removeItem("giatrigiam");
                  localStorage.removeItem("hinhthucgiam");
                  localStorage.removeItem("maVoucher");
                  localStorage.removeItem("totalAmount");
                  localStorage.removeItem("listCart");
                  loadCart();
                  loadToTals();
                  loadNameAndPrice();
                  loadQuanTiTy();


                },
              ],
            });
          }
          else {
            console.log("Không có giỏ hàng để xóa.");
          }
        }
      });
    };


    function loadCart() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/hien-thi?idgh=" +
        idgh;

      $http.get(apiURL).then(function (response) {
        $scope.products = response.data; // Dữ liệu sản phẩm từ API
        $window.localStorage.setItem(
          "listCart",
          $scope.products.map((item) => item.id)
        );
      });
      if (idgh) {
        var listCartGet = $window.localStorage.getItem("listCart");
        console.log("listCartGet" + listCartGet)
        // Kiểm tra nếu giỏ hàng trống, thực hiện xóa local storage
        if (listCartGet.length === 0) {
          localStorage.removeItem("idgiohang");
          localStorage.removeItem("idVoucher");
          localStorage.removeItem("giatrigiam");
          localStorage.removeItem("hinhthucgiam");
          localStorage.removeItem("maVoucher");
          localStorage.removeItem("totalAmount");
          localStorage.removeItem("listCart");
        }
      }
      else {
        console.log("Không có giỏ hàng để xóa.");
      }
    }
    loadCart();
    // Gọi API và cập nhật danh sách sản phẩm và tổng tiền
    function loadNameAndPrice() {
      $http
        .get(
          "http://localhost:8080/api/gio-hang-chi-tiet-not-login/name-quantity?idgh=" +
          idgh
        )
        .then(function (response) {
          $scope.items = response.data;

          // Tính tổng tiền sản phẩm
          $scope.totalAmount = 0;
          for (var i = 0; i < $scope.items.length; i++) {
            $scope.totalAmount += parseFloat($scope.items[i].tongTien);
          }
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }
    loadNameAndPrice();
    // Khai báo biến để lưu các giá trị đã binding
    $scope.hoTen = "";
    $scope.soDienThoai = "";
    $scope.email = "";
    $scope.diaChi = "";
    $scope.thanhPho = "";
    $scope.quanHuyen = "";
    $scope.phuongXa = "";
    $scope.tongTien = 0; // Để tránh lỗi nếu không có giá trị tổng tiền
    $scope.tienKhachTra = 0; // Để tránh lỗi nếu không có giá trị tiền khách trả
    $scope.gioHangChiTietList = $scope.gioHangChiTietList;

    var idGioHangChiTiet = $window.localStorage.getItem("listCart");
    var gioHangChiTietList = idGioHangChiTiet.split(",");
    // Lấy giá trị tổng tiền từ localStorage
    var totalAmount = parseFloat($window.localStorage.getItem("totalAmount"));

    // Kiểm tra xem có token đăng nhập hay không
    var token = $window.localStorage.getItem("token-customer");

    if (token) {
      // Nếu có token, gọi API để lấy thông tin khách hàng
      var apiEndpoint = "http://localhost:8080/api/v1/account/profile";
      var apiAddress = "http://localhost:8080/api/v1/account/dia-chi";
      var config = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };

      $http.get(apiEndpoint, config).then(
        function (response) {
          console.log(response.data);
          // Lấy thông tin từ server và gán vào các biến $scope
          $scope.hoTen = response.data.hoTen;
          $scope.email = response.data.email;
          $scope.soDienThoai = response.data.soDienThoai;

          // Gọi API địa chỉ
          $http.get(apiAddress, config).then(
            function (addressResponse) {
              // Lọc các địa chỉ có trạng thái là 1
              $scope.filteredAddresses = addressResponse.data.filter(function (
                address
              ) {
                return address.trangThai === "1";
              });

              // Lấy địa chỉ đầu tiên từ danh sách đã lọc và gán vào $scope.diaChi
              $scope.diaChi =
                $scope.filteredAddresses.length > 0
                  ? $scope.filteredAddresses[0].diaChi
                  : "";
            },
            function (addressError) {
              console.error("Lỗi khi gọi API địa chỉ: " + addressError);
            }
          );
        },
        function (error) {
          console.error("Lỗi khi gọi API thông tin cá nhân: " + error);
        }
      );
    }

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

    var idGiamGiaVoucher = $window.localStorage.getItem('idVoucher')
    // Kiểm tra xem có voucher được chọn không
    if (idGiamGiaVoucher === null || idGiamGiaVoucher === undefined) {
      // Nếu không có voucher, có thể đặt idGiamGiaVoucher thành null hoặc giá trị mặc định
      idGiamGiaVoucher = "beca564d-5d14-4d0c-82cd-75b8db667ced"; // hoặc giá trị mặc định
    }
    //THANH TOAN LOGIC

    $scope.giamGiaVoucher = 0;
    // Lấy giá trị từ localStorage
    var hinhThucGiam = $window.localStorage.getItem('hinhthucgiam');
    var giatrigiam = parseFloat($window.localStorage.getItem('giatrigiam'));

    // Kiểm tra hình thức giảm giá
    if (hinhThucGiam === "1") {
      // Giảm giá theo tỷ lệ %
      console.log('Giảm giá theo tỷ lệ %');
      $scope.giamGiaVoucher = (totalAmount * giatrigiam) / 100;
    }
    if (hinhThucGiam === "2") {
      // Giảm giá theo giá trị VNĐ
      console.log('Giảm giá theo giá trị VNĐ');
      $scope.giamGiaVoucher = giatrigiam;
    }

    if (!$scope.giamGiaVoucher) {
      $scope.tongCong = totalAmount;
    }
    if ($scope.giamGiaVoucher) {
      // Tính tổng cộng dựa trên giá trị giảm giá
      $scope.tongCong = totalAmount - $scope.giamGiaVoucher;
    }

    $scope.thanhToan = function () {
      // Display a confirmation dialog
      var isConfirmed = window.confirm("Bạn có chắc chắn muốn đặt đơn hàng?");

      if (isConfirmed) {
        // If the user confirms, proceed with form submission
        var data = {
          hoTen: $scope.hoTen,
          soDienThoai: $scope.soDienThoai,
          email: $scope.email,
          diaChi: $scope.diaChi,
          thanhPho: $scope.selectedProvince.name,
          quanHuyen: $scope.selectedDistrict.name,
          phuongXa: $scope.selectedWard.name,
          // tongTien: totalAmount,
          tienKhachTra: $scope.tienKhachTra,
          gioHangChiTietList: gioHangChiTietList,
          idGiamGia: idGiamGiaVoucher
        };

        data.tongTien = $scope.tongCong;
        data.tienGiamGia = $scope.giamGiaVoucher;

        if (token) {
          $http
            .post(
              "http://localhost:8080/api/checkout-not-login/thanh-toan-login",
              data,
              config
            )
            .then(
              function (response) {
                // Xử lý response nếu cần thiết
                localStorage.removeItem("idgiohang");
                localStorage.removeItem("idVoucher");
                localStorage.removeItem("giatrigiam");
                localStorage.removeItem("hinhthucgiam");
                localStorage.removeItem("maVoucher");
                localStorage.removeItem("totalAmount");
                localStorage.removeItem("listCart");
                // Chuyển hướng đến trang "thank-you"
                $location.path("/thank-you");
              },
              function (error) {
                console.log(error);
              }
            );
        } else {
          // Send data to the server
          $http({
            method: "POST",
            url: "http://localhost:8080/api/checkout-not-login/thanh-toan",
            data: data,
          }).then(
            function (response) {
              // Handle the response if needed
              localStorage.removeItem("idgiohang");
              localStorage.removeItem("idVoucher");
              localStorage.removeItem("giatrigiam");
              localStorage.removeItem("hinhthucgiam");
              localStorage.removeItem("maVoucher");
              localStorage.removeItem("totalAmount");
              localStorage.removeItem("listCart");
              // Redirect to the "thank-you" route
              $location.path("/thank-you");
            },
            function (error) {
              console.log(error);
            }
          );
        }
      } else {
        alert("Đã hủy");
      }
    }; //close check out

    // voucher here
    $scope.vouchers = [];
    // Gửi yêu cầu API và xử lý kết quả
    $scope.voucher = function () {
      $http
        .get("http://localhost:8080/api/v1/voucher-login/show")
        .then(function (response) {
          $scope.vouchers = response.data;
        });
    };
    $scope.voucher();
    // Khi áp dụng mã giảm giá
    $scope.voucherId = function (id, giatrigiam, hinhthucgiam, magiamgia) {
      $window.localStorage.setItem('idVoucher', id);
      console.log($window.localStorage.getItem('idVoucher'));
      $window.localStorage.setItem('giatrigiam', giatrigiam);
      console.log($window.localStorage.getItem('giatrigiam'));
      $window.localStorage.setItem('hinhthucgiam', hinhthucgiam);
      console.log($window.localStorage.getItem('hinhthucgiam'));
      $window.localStorage.setItem('maVoucher', magiamgia);
      console.log($window.localStorage.getItem('maVoucher'));

      // Gọi hàm để hiển thị thông tin trong ô input
      $scope.magiamgia = $window.localStorage.getItem('maVoucher');
      var idGiamGiaVoucher = $window.localStorage.getItem('idVoucher')
      //THANH TOAN LOGIC
      // Lấy giá trị từ localStorage
      var hinhThucGiam = $window.localStorage.getItem('hinhthucgiam');
      var giatrigiam = parseFloat($window.localStorage.getItem('giatrigiam'));

      // Kiểm tra hình thức giảm giá
      if (hinhThucGiam === "1") {
        // Giảm giá theo tỷ lệ %
        console.log('Giảm giá theo tỷ lệ %');
        $scope.giamGiaVoucher = (totalAmount * giatrigiam) / 100;
      } else {
        // Giảm giá theo giá trị VNĐ
        console.log('Giảm giá theo giá trị VNĐ');
        $scope.giamGiaVoucher = giatrigiam;
      }

      // Tính tổng cộng dựa trên giá trị giảm giá
      $scope.tongCong = totalAmount - $scope.giamGiaVoucher;
      Swal.fire({
        title: "Đã áp dụng voucher",
        text: "Bạn được giảm : " + $scope.giamGiaVoucher + (hinhthucgiam === "1" ? "%" : " VNĐ"),
        icon: "success",
        position: "bottom-start", // Đặt vị trí ở góc trái
        toast: true, // Hiển thị thông báo nhỏ
        showConfirmButton: false, // Ẩn nút xác nhận
        timer: 1500, // Thời gian tự đóng thông báo (milliseconds)
      });

    };

    // Gọi hàm để hiển thị thông tin trong ô input
    $scope.magiamgia = $window.localStorage.getItem('maVoucher');
    function loadQuanTiTy() {
      // Thay đổi idgh bằng id của giỏ hàng bạn muốn hiển thị sản phẩm
      var apiURL =
        "http://localhost:8080/api/gio-hang-chi-tiet-not-login/quantity?idgh=" +
        idgh;

      $http.get(apiURL).then(function (response) {
        $scope.quantity_all = response.data; // Dữ liệu sản phẩm từ API      
      });

    }
    loadQuanTiTy();
  });
