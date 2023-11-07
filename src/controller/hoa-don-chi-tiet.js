myApp.controller("hoaDonChiTietController", function ($http, $scope, $routeParams) {
  const breadcrumbSteps = document.querySelectorAll('.breadcrumb__step');
  // Xử lý sự kiện breadcrumb nếu cần
  for (let i = 0; i < breadcrumbSteps.length; i++) {
    const item = breadcrumbSteps[i];
    item.onclick = () => {
      // Loại bỏ lớp 'breadcrumb__step--active' khỏi tất cả các breadcrumb
      breadcrumbSteps.forEach((step) => {
        step.classList.remove('breadcrumb__step--active');
      });

      // Đánh dấu breadcrumb hiện tại và tất cả các breadcrumb trước nó
      for (let j = 0; j <= i; j++) {
        breadcrumbSteps[j].classList.add('breadcrumb__step--active');
      }
    };
  }










  
  function getHoaDonChiTiet(id) {
    const apiUrl = "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-don/" + id;
    $http.get(apiUrl).then(function (response) {
      $scope.hoaDonChiTiet = response.data;
    });
  }

  // Xác định `id` từ `$routeParams`
  var id = $routeParams.id;

  // Gọi hàm để lấy dữ liệu chi tiết hoá đơn dựa trên `id`
  getHoaDonChiTiet(id);

  // Hàm để tải sản phẩm từ API
  function getSanPham(id) {
    var apiUrl = "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-san-pham/" + id;

    $http.get(apiUrl).then(function (response) {
      // Gán dữ liệu sản phẩm vào biến $scope.hoaDonChiTiet.sanPham
      $scope.hoaDonChiTiet.sanPham = response.data;
    });
  }

  // Gọi hàm để lấy thông tin sản phẩm dựa trên `id`
  getSanPham(id);

  function getLichSu(id) {
    var apiUrl = "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-lich-su/" + id;

    $http.get(apiUrl).then(function (response) {
      $scope.lichSu = response.data;
    });
  }

  // Xác định `id` từ `$routeParams`
  var id = $routeParams.id;

  // Gọi hàm để lấy dữ liệu lịch sử dựa trên `id`
  getLichSu(id)

  function getLichSuThayDoi(id) {
    var apiUrl = "http://localhost:8080/api/v1/hoa-don-chi-tiet/hien-thi-trang-thai/" + id;

    $http.get(apiUrl).then(function (response) {
      $scope.lichSuThayDoi = response.data;
    });
  }

  // Xác định `id` từ `$routeParams`
  var id = $routeParams.id;

  // Gọi hàm để lấy dữ liệu lịch sử dựa trên `id`
  getLichSuThayDoi(id)
});
