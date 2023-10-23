myApp.controller(
  "sanPhamGiamGiaController",
  function ($http, $scope, $routeParams) {
    $scope.listSpGiamGia = [];
    $scope.listThuongHieu = [];
    $scope.listDanhMuc = [];
    $scope.listSize = [];
    $scope.detailProduct = {};
    $scope.detailSizeProduct = [];
    $scope.detailChatLieuProduct = [];
    $scope.detailKieuDeProduct = [];
    $scope.detailColorProduct = [];
    $scope.toggleSelection = function(attribute) {
      attribute.isSelected = !attribute.isSelected;
  };
    var name = $routeParams.name;

    $scope.listSanPhamGiamGia = function () {
      $http
        .get("http://localhost:8080/api/v1/san-pham-giam-gia/show")
        .then(function (response) {
          $scope.listSpGiamGia = response.data;
        });
    };
    $scope.listSanPhamGiamGia();

    $scope.getlistThuongHieu = function () {
      $http
        .get("http://localhost:8080/api/v1/thuong-hieu/show")
        .then(function (response) {
          $scope.listThuongHieu = response.data;
        });
    };
    $scope.getlistThuongHieu();

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
        });
    };

    $scope.getDetailSizeProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail-size/" + name)
        .then(function (response) {
          $scope.detailSizeProduct = response.data;
        });
    };

    $scope.getDetailChatLieuProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail-chat-lieu/" + name)
        .then(function (response) {
          $scope.detailChatLieuProduct = response.data;
        });
    };

    $scope.getDetailKieuDeProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail-kieu-de/" + name)
        .then(function (response) {
          $scope.detailKieuDeProduct = response.data;
        });
    };

    $scope.getDetailColorProduct = function (name) {
      $http
        .get("http://localhost:8080/api/v1/product/detail-color/" + name)
        .then(function (response) {
          $scope.detailColorProduct = response.data;
        });
    };

    $scope.selectSize = function(size) {
      // Set a property on the selected size object to indicate it is selected
      size.isSelected = !size.isSelected;
    };

    $scope.selectChatLieu = function(chatLieu) {
      // Set a property on the selected size object to indicate it is selected
      chatLieu.isSelected = !chatLieu.isSelected;
    };

    $scope.selectColor = function(color) {
      // Set a property on the selected size object to indicate it is selected
      color.isSelected = !color.isSelected;
    };

    $scope.selectKieuDe = function(kieuDe) {
      // Set a property on the selected size object to indicate it is selected
      kieuDe.isSelected = !kieuDe.isSelected;
    };

    $scope.$watch('detailSizeProduct', function() {
      if ($scope.detailSizeProduct.length > 0) {
        $scope.selectSize($scope.detailSizeProduct[0]);
      }
    });

    $scope.$watch('detailColorProduct', function() {
      if ($scope.detailColorProduct.length > 0) {
        $scope.selectColor($scope.detailColorProduct[0]);
      }
    });

    $scope.$watch('detailChatLieuProduct', function() {
      if ($scope.detailChatLieuProduct.length > 0) {
        $scope.selectChatLieu($scope.detailChatLieuProduct[0]);
      }
    });

    $scope.$watch('detailKieuDeProduct', function() {
      if ($scope.detailKieuDeProduct.length > 0) {
        $scope.selectKieuDe($scope.detailKieuDeProduct[0]);
      }
    });

    $scope.getDetailProduct(name);
    $scope.getDetailSizeProduct(name);
    $scope.getDetailChatLieuProduct(name);
    $scope.getDetailKieuDeProduct(name);
    $scope.getDetailColorProduct(name);
  }
);
