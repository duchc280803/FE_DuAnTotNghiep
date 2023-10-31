myApp.controller(
  "sanPhamGiamGiaController",
  function ($http, $scope, $routeParams, $window) {
    $scope.listSpGiamGia = [];
    $scope.listThuongHieu = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];
    $scope.detailProduct = {};
    $scope.detailSizeProduct = [];
    $scope.detailChatLieuProduct = [];
    $scope.detailKieuDeProduct = [];
    $scope.detailColorProduct = [];
    $scope.detailQuantity = {};
    var name = $routeParams.name;

    $scope.listSanPhamGiamGia = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham-giam-gia/show")
        .then(function (response) {
          $scope.listSpGiamGia = response.data;
        });
    };
    $scope.listSanPhamGiamGia();

    $scope.getlistCategory = function () {
      $http
        .get("http://localhost:8080/api/v1/danh-muc/show")
        .then(function (response) {
          $scope.listDanhMuc = response.data;
        });
    };
    $scope.getlistCategory();

    $scope.getlistSize = function () {
      $http
        .get("http://localhost:8080/api/v1/size/show")
        .then(function (response) {
          $scope.listSize = response.data;
        });
    };
    $scope.getlistSize();

    $scope.getDetailProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail/" + name)
        .then(function (response) {
          $scope.detailProduct = response.data;
          console.log($scope.detailProduct);
        });
    };

    $scope.getDetailSizeProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail-size/" + name)
        .then(function (response) {
          $scope.detailSizeProduct = response.data;
          console.log($scope.detailSizeProduct);
        });
    };

    $scope.getDetailQuantityProduct = function (id) {
      $http
        .get("http://localhost:8080/api/v1/product/quantity?id=" + id)
        .then(function (response) {
          $scope.detailQuantity = response.data;
        });
    };

    $scope.selectedSize = null;
    $scope.addToCart = function () {
        var selectedSizeId = $scope.selectedSize.id;
        console.log("Selected Size ID:", selectedSizeId);
    };

    $scope.selectSize = function (size) {
      // Deselect all sizes
      $scope.detailSizeProduct.forEach(function (item) {
        item.isSelected = false;
      });

      // Select the clicked size
      size.isSelected = true;

      $scope.selectedSize = size;

      // Get the id for the selected size
      $scope.getDetailQuantityProduct(size.id);
    };

    $scope.selectChatLieu = function (chatLieu) {
      $scope.detailSizeProduct.forEach(function (item) {
        item.isSelected = false;
      });
      // Set a property on the selected size object to indicate it is selected
      chatLieu.isSelected = !chatLieu.isSelected;
    };

    $scope.selectColor = function (color) {
      $scope.detailSizeProduct.forEach(function (item) {
        item.isSelected = false;
      });
      // Set a property on the selected size object to indicate it is selected
      color.isSelected = !color.isSelected;
    };

    $scope.selectKieuDe = function (kieuDe) {
      $scope.detailSizeProduct.forEach(function (item) {
        item.isSelected = false;
      });
      // Set a property on the selected size object to indicate it is selected
      kieuDe.isSelected = !kieuDe.isSelected;
    };

    $scope.$watch("detailSizeProduct", function () {
      if ($scope.detailSizeProduct.length > 0) {
        $scope.selectSize($scope.detailSizeProduct[0]);
      }
    });

    $scope.$watch("detailColorProduct", function () {
      if ($scope.detailColorProduct.length > 0) {
        $scope.selectColor($scope.detailColorProduct[0]);
      }
    });

    $scope.$watch("detailChatLieuProduct", function () {
      if ($scope.detailChatLieuProduct.length > 0) {
        $scope.selectChatLieu($scope.detailChatLieuProduct[0]);
      }
    });

    $scope.$watch("detailKieuDeProduct", function () {
      if ($scope.detailKieuDeProduct.length > 0) {
        $scope.selectKieuDe($scope.detailKieuDeProduct[0]);
      }
    });

    $scope.getDetailProduct(name);
    $scope.getDetailSizeProduct(name);
  }
);
