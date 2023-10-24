myApp.controller("GiamGiaController", function ($http, $scope) {
  $scope.listGiamGia = [];
  $scope.listThuongHieu = [];
  function fetchGiamGiaList() {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/show")
      .then(function (response) {
        $scope.listGiamGia = response.data;
      });
  }
  function fetchlistThuongHieu() {
    $http
      .get("http://localhost:8080/api/v1/thuong-hieu/show")
      .then(function (response) {
        $scope.listThuongHieu = response.data;
      });
  }
  fetchlistThuongHieu();
  function fetchlistProduct() {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/showproduct")
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
  fetchlistProduct();
  function fetchlistChatLieu() {
    $http
      .get("http://localhost:8080/api/v1/chat-lieu/show")
      .then(function (response) {
        $scope.listChatLieu = response.data;
      });
  }
  fetchlistChatLieu();
  function fetchlistDanhMuc() {
    $http
      .get("http://localhost:8080/api/v1/danh-muc/show")
      .then(function (response) {
        $scope.listDanhMuc = response.data;
      });
  }
  fetchlistDanhMuc();
  function fetchlistMauSac() {
    $http
      .get("http://localhost:8080/api/v1/mau-sac/show")
      .then(function (response) {
        $scope.listMauSac = response.data;
      });
  }
  fetchlistMauSac();
  function fetchlistKieuDe() {
    $http
      .get("http://localhost:8080/api/v1/kieu-de/show")
      .then(function (response) {
        $scope.listKieuDe = response.data;
      });
  }
  fetchlistKieuDe();
  function fetchlistSize() {
    $http
      .get("http://localhost:8080/api/v1/size/show")
      .then(function (response) {
        $scope.listSize = response.data;
      });
  }
  fetchlistSize();
  function fetchlistXuatXu() {
    $http
      .get("http://localhost:8080/api/v1/xuat-xu/show")
      .then(function (response) {
        $scope.listXuatXu = response.data;
      });
  }
  fetchlistXuatXu();

  // Thêm hàm tìm kiếm
  $scope.searchGiamGia = function () {
    var key1 = $scope.startDate;
    var key2 = $scope.endDate;

    if (!key1 && !key2) {
      // Nếu cả hai giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchDatebykey", {
          params: { key1: key1, key2: key2 },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();

  $scope.searchKey = function () {
    var key = $scope.key;
    if (!key) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
          params: { key: key },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();
  $scope.searchbyMa = function () {
    var key2 = $scope.key2;
    if (!key2) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchString_bykey", {
          params: { key:key2 },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();

  ///
  $scope.searchProductKey = function () {
    var key = $scope.tenSanPham;

    if (!key) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchlistProduct();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchProduct_bykey", {
          params: { key: key },
        })
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    }
  };
//
// $scope.searchProductList= function () {
//   var id = $scope.list;

//   if (!id) {
//     // Nếu giá trị là null, gọi lại danh sách đầy đủ
//     fetchlistProduct();
//   } else {
//     $http
//       .get("http://localhost:8080/api/v1/giam-gia/detail", {
//         params: { id: id },
//       })
//       .then(function (response) {
//         $scope.listProduct = response.data;
//       });
//   }
// };



  ///
  $scope.searchProductList= function () {
    var id = $scope.Size;

    if (!id) {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchlistProduct();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/detail", {
          params: { id: id },
        })
        .then(function (response) {
          $scope.listProduct = response.data;
        });
    }
  };
//
$scope.searchProductDanhMuc= function () {
  var id = $scope.DanhMuc;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};
//
$scope.searchProductThuongHieu= function () {
  var id = $scope.ThuongHieu;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};
//
$scope.searchProductChatLieu= function () {
  var id = $scope.ChatLieu;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};
//
$scope.searchProductMauSac= function () {
  var id = $scope.MauSac;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};
//
$scope.searchProductKieuDe= function () {
  var id = $scope.KieuDe;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};
//
$scope.searchProductXuatXu= function () {
  var id = $scope.XuatXu;

  if (!id) {
    // Nếu giá trị là null, gọi lại danh sách đầy đủ
    fetchlistProduct();
  } else {
    $http
      .get("http://localhost:8080/api/v1/giam-gia/detail", {
        params: { id: id },
      })
      .then(function (response) {
        $scope.listProduct = response.data;
      });
  }
};


  $scope.searchStatus = function () {
    var key = $scope.status; // Lấy giá trị từ dropdown

    if (key === "") {
      // Nếu giá trị là null, gọi lại danh sách đầy đủ
      fetchGiamGiaList();
    } else {
      $http
        .get("http://localhost:8080/api/v1/giam-gia/searchStatus_bykey", {
          params: { key: key },
        })
        .then(function (response) {
          $scope.listGiamGia = response.data;
        });
    }
  };

  fetchGiamGiaList();
  // Thêm hàm làm mới
  $scope.refresh = function () {
    // Gọi lại danh sách đầy đủ khi làm mới
    fetchGiamGiaList();
    // Xóa giá trị trong các ô input

    $scope.tenGiamGia = "";
    $scope.startDate = null;
    $scope.endDate = null;
    $scope.status = "";
  };

  $scope.selectedIds = [];

  $scope.updateSelectedIds = function(id, idSize,idChatLieu,idMauSac,idKieuDe) {
    // Nếu checkbox được chọn, thêm id và idSize vào danh sách
    // Nếu checkbox bị bỏ chọn, loại bỏ id và idSize khỏi danh sách
    var existingIndex = $scope.selectedIds.findIndex(item => item.id === id);
    if (existingIndex === -1) {
      $scope.selectedIds.push({ id: id, idSize: idSize ,idChatLieu:idChatLieu,idMauSac:idMauSac,idKieuDe:idKieuDe });
    } else {
      $scope.selectedIds.splice(existingIndex, 1);
    }
  };
  
  // ... Các đoạn mã khác ...
  
  var selectedIds = $scope.selectedIds;
  fetchGiamGiaList();
  
  $scope.themKhuyenMai = function () {
    var maGiamGiaAutoGenerated = "GG_" + new Date().getTime();
  
    // Sử dụng $scope.selectedIds để lấy danh sách các idSanPham được chọn
    var selectedIds = $scope.selectedIds;
  
    // Thực hiện logic với danh sách selectedIds
    for (var i = 0; i < selectedIds.length; i++) {
      // Sử dụng hàm closure để đảm bảo giá trị của i được truyền vào bên trong callback
      (function(index) {
        var khuyenMaiData = {
          maGiamGia: maGiamGiaAutoGenerated,
          tenGiamGia: $scope.tenGiamGia,
          hinhThucGiam: 7,
          trangThai: 1,
          mucGiam: $scope.mucGiam,
          ngayBatDau: $scope.ngayBatDau,
          ngayKetThuc: $scope.ngayKetThuc,
          id: selectedIds[index].id ,
      idSize: selectedIds[index].idSize ,
      idKieuDe: selectedIds[index].idKieuDe ,
      idMauSac: selectedIds[index].idMauSac ,
      idChatLieu: selectedIds[index].idChatLieu 
        };
  
        // Gửi yêu cầu tạo khuyến mãi với dữ liệu tương ứng
        $http.post("http://localhost:8080/api/v1/giam-gia/create", khuyenMaiData)
          .then(function (response) {
            // Thêm thành công, có thể thực hiện các hành động khác nếu cần
          })
          .catch(function (error) {
            // Xử lý lỗi khi tạo khuyến mãi
            //  cho từng sản phẩm
            console.error("Error creating khuyen mai for product with id:", selectedIds[index].id, error);
            console.error("Error creating khuyen mai for product with id:", selectedIds[index].idSize, error);
            console.error("Error creating khuyen mai for product with id:", selectedIds[index].idKieuDe, error);
            console.error("Error creating khuyen mai for product with id:", selectedIds[index].idMauSac, error);
            console.error("Error creating khuyen mai for product with id:", selectedIds[index].idChatLieu, error);
          });
      })(i); // Truyền giá trị của i vào hàm closure
    }
  
    // Gọi lại danh sách để cập nhật
    fetchGiamGiaList();
  
    // Xóa giá trị trong các ô input
    $scope.maGiamGia = maGiamGiaAutoGenerated;
    $scope.tenGiamGia = "";
    $scope.hinhThucGiam = "";
    $scope.mucGiam = "";
    $scope.ngayBatDau = "";
    $scope.ngayKetThuc = "";
    $scope.trangThai = null;
    // $scope.selectedIds = []; // Đặt lại danh sách selectedIds
  };
  
});
