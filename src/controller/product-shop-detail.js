myApp.controller(
  "sanPhamShopDetailController",
  function ($http, $scope, $routeParams, $window) {
    $scope.detailProduct = {};
    $scope.detailSizeProduct = [];
    $scope.detailChatLieuProduct = [];
    $scope.detailColorProduct = [];
    $scope.detailMaterialProduct = [];
    $scope.detailQuantity = {};

    var name = $routeParams.name;
    $scope.getDetailProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-name-price-image/" +
            name
        )
        .then(function (response) {
          $scope.detailProduct = response.data;
    
          // Lấy giá trị idThuongHieu từ $scope.detailProduct
          var idThuongHieu = $scope.detailProduct .idThuongHieu;
          console.log(idThuongHieu);
          // Lưu giá trị idThuongHieu vào localStorage
          window.localStorage.setItem('idThuongHieu', idThuongHieu);
        });
    };
    

    $scope.getDetailSizeProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-size/" + name
        )
        .then(function (response) {
          $scope.detailSizeProduct = response.data;
        });
    };

    $scope.getDetailMauSacProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-mau-sac/" +
            name
        )
        .then(function (response) {
          $scope.detailColorProduct = response.data;
        });
    };

    $scope.getDetailChatLieuProduct = function () {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/show-all-chat-lieu/" +
            name
        )
        .then(function (response) {
          $scope.detailMaterialProduct = response.data;
        });
    };

    $scope.loadmausac_chatlieu_not_login = [];
    $scope.findMauSacChatLieuBySize = function (idsize) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-size/" +
            name +
            "?idsize=" +
            idsize
        )
        .then(function (response) {
          $scope.loadmausac_chatlieu_not_login = response.data;
        });
    };


    $scope.listSizeChatLieuByMauSac = [];
    $scope.findByMauSac = function (id) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-mau-sac/" +
            name +
            "?idmausac=" +
            id
        )
        .then(function (response) {
          $scope.listSizeChatLieuByMauSac = response.data;
        });
    };

    $scope.listMauSizeByChatLieu = [];
    $scope.findByChatLieu = function (id) {
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-by-chat-lieu/" +
            name +
            "?idchatlieu=" +
            id
        )
        .then(function (response) {
          $scope.listMauSizeByChatLieu = response.data;
        });
    };

    $scope.showQuantity = {};
    $scope.quantity = {
      colorId: null,
      sizeId: null,
      chatLieuId: null,
      soluong: null,
      sanPhamChiTietId: null,
    };
    $scope.getQuantity = function () {
      var idMauSac = $scope.quantity.colorId;
      var idSize = $scope.quantity.sizeId;
      var idChatLieu = $scope.quantity.chatLieuId;
      $http
        .get(
          "http://localhost:8080/api/v1/san-pham-giam-gia/find-idspct-soluong/" +
            name +
            "?idmausac=" +
            idMauSac +
            "&idsize=" +
            idSize +
            "&idchatlieu=" +
            idChatLieu
        )
        .then(function (response) {
          $scope.showQuantity = response.data;
          console.log($scope.showQuantity);
          $scope.quantity.soluong = response.data.soluong;
          $scope.quantity.sanPhamChiTietId = response.data.id;
        });
    };

    $scope.selectedSize = null;
    $scope.selectSize = function (size) {
      $scope.quantity.sizeId = size.id;
      if (size.isSelected) {
        size.isSelected = false;
      } else {
        $scope.detailSizeProduct.forEach(function (item) {
          item.isSelected = false;
        });
        size.isSelected = true;
        $scope.selectedSize = size;
      }
      if ($scope.quantity.sizeId && $scope.quantity.colorId && $scope.quantity.chatLieuId) {
        $scope.getQuantity();
      }

    };

    $scope.selectedColor = null; // Changed from $scope.selectColor to $scope.selectedColor
    $scope.selectColor = function (color) {
      var colorMatchSize = $scope.loadmausac_chatlieu_not_login.some(function(item) {
        return item.tenMauSac === color.tenmausac;
      });

      var materialMatchSize = $scope.loadmausac_chatlieu_not_login.some(function(item) {
        return item.tenChatLieu === color.tenchatlieu;
      });
    
      if (!colorMatchSize && !materialMatchSize) {
        alert('không phù hợp với size đã chọn');
        return;
      }
    
      $scope.quantity.colorId = color.id;
      if (color.isSelected) {
        color.isSelected = false;
      } else {
        $scope.detailColorProduct.forEach(function (item) {
          item.isSelected = false;
        });
        color.isSelected = true;
        $scope.selectedColor = color;
      }
      if ($scope.quantity.sizeId && $scope.quantity.colorId && $scope.quantity.chatLieuId) {
        $scope.getQuantity();
      }
    };

    $scope.selectedMaterial = null; // Changed from $scope.selectColor to $scope.selectedColor
    $scope.selectMaterial = function (material) {
      var colorMatchMaterial = $scope.listSizeChatLieuByMauSac.some(function(item) {
        return item.tenMauSac === material.tenmausac;
      });

      var sizeMatchMaterial = $scope.loadmausac_chatlieu_not_login.some(function(item) {
        return item.size === material.tenchatlieu;
      });
    
      if (!colorMatchMaterial && !sizeMatchMaterial) {
        alert('không phù hợp với đã chọn');
        return;
      }
      
      $scope.quantity.chatLieuId = material.id;
      if (material.isSelected) {
        material.isSelected = false;
      } else {
        $scope.detailMaterialProduct.forEach(function (item) {
          item.isSelected = false;
        });
        material.isSelected = true;
        $scope.selectedMaterial = material; // Changed from $scope.selectColor to $scope.selectedColor
        if ($scope.quantity.sizeId && $scope.quantity.colorId && $scope.quantity.chatLieuId) {
          $scope.getQuantity();
        }
      }
    };

// Tạo giỏ hàng mới và lưu idGioHang vào localStorage
$scope.CreateNewCart = function () {
  $http
    .post("http://localhost:8080/api/gio-hang-not-login/tao-gio-hang")
    .then(function (response) {
      // Lưu idGioHang vào localStorage
      var idGioHang = response.data;     
      localStorage.setItem('idgiohang', idGioHang);
    })
    .catch(function (error) {
      // Xử lý lỗi nếu cần
      console.error('Lỗi khi tạo giỏ hàng', error);
    });
};

// Thêm sản phẩm vào giỏ hàng
$scope.addToCart = function (idSanPhamChiTiet) {
  // Lấy idGioHang từ localStorage
  var idGioHang = localStorage.getItem('idgiohang');
  var soluong = $scope.soluong ;
  if (!idGioHang) {
    // Nếu không có idGioHang trong localStorage, gọi hàm CreateNewCart để tạo giỏ hàng mới
    $scope.CreateNewCart();

  } else {
    // Nếu có idGioHang trong localStorage, thực hiện gọi API để thêm sản phẩm vào giỏ hàng
    var url = "http://localhost:8080/api/gio-hang-chi-tiet-not-login/them-san-pham?idGioHang=" + idGioHang + "&idSanPhamChiTiet=" + idSanPhamChiTiet + "&soLuong=" + soluong;
    $http
      .post(url)
      .then(function () {
      })
      .catch(function (error) {
      });
  }
};

    
    $scope.getDetailProduct();
    $scope.getDetailSizeProduct();
    $scope.getDetailMauSacProduct();
    $scope.getDetailChatLieuProduct();

    function loadRelatedProducts() {
      var idThuongHieu = window.localStorage.getItem("idThuongHieu"); // Thay thế bằng id thương hiệu tương ứng
      $http
        .get("http://localhost:8080/api/v1/san-pham-giam-gia/show-sp-lien-quan?idthuonghieu=" + idThuongHieu)
        .then(function (response) {
          $scope.relatedProducts = response.data;
        })
        .catch(function (error) {
          console.error("Lỗi khi gọi API: " + error);
        });
    }
  
    loadRelatedProducts();
  }
);
