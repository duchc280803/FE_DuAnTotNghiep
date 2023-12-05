myApp.controller("thongKeController", function ($scope, $http) {
  $scope.loadData = function () {
    $http
      .get("http://localhost:8080/api/thong-ke/count-one")
      .then(function (response) {
        $scope.choXacNhan = response.data;
        return $http.get("http://localhost:8080/api/thong-ke/count-two");
      })
      .then(function (response) {
        $scope.xacNhan = response.data;
        return $http.get("http://localhost:8080/api/thong-ke/count-three");
      })
      .then(function (response) {
        $scope.choGiaoHang = response.data;
        return $http.get("http://localhost:8080/api/thong-ke/count-four");
      })
      .then(function (response) {
        $scope.dangGiao = response.data;
        return $http.get("http://localhost:8080/api/thong-ke/count-five");
      })
      .then(function (response) {
        $scope.thanhCong = response.data;
        return $http.get("http://localhost:8080/api/thong-ke/count-six");
      })
      .then(function (response) {
        $scope.daHuy = response.data;
        updateChartData(
          $scope.choXacNhan,
          $scope.xacNhan,
          $scope.choGiaoHang,
          $scope.dangGiao,
          $scope.thanhCong,
          $scope.daHuy
        );
      })
      .catch(function (error) {
        // Handle error here
        console.error("Error fetching data:", error);
      });
  };

  $scope.loadData();

  function updateChartData(
    choXacNhan,
    xacNhan,
    choGiaoHang,
    dangGiao,
    thanhCong,
    daHuy
  ) {
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [
          "Chờ xác nhận",
          "Xác nhận",
          "Chờ giao hàng",
          "Giao hàng",
          "Thành công",
          "Đã hủy",
        ],
        datasets: [
          {
            data: [
              choXacNhan,
              xacNhan,
              choGiaoHang,
              dangGiao,
              thanhCong,
              daHuy,
            ],
            backgroundColor: [
              "#03c6fc",
              "#1ff2cb",
              "#bdae4f",
              "#f21fdd",
              "#4efc03",
              "#f21f1f",
            ],
          },
        ],
      },
      options: {
        legend: {
          display: true,
          position: "bottom",
        },
      },
    });
  }
  $scope.tongtienhomnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtienhomnay")
    .then(function (response) {
      $scope.tongtienhomnay = response.data;
    });

  $scope.tongtientuannay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtientuannay")
    .then(function (response) {
      $scope.tongtientuannay = response.data;
    });

  $scope.tongtiendonthangnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtiendonthangnay")
    .then(function (response) {
      $scope.tongtiendonthangnay = response.data;
    });

  $scope.tongtiennamnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/tongtiennamnay")
    .then(function (response) {
      $scope.tongtiennamnay = response.data;
    });

  $scope.tongSoDonHnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-hom-nay")
    .then(function (response) {
      $scope.tongSoDonHnay = response.data;
    });

  $scope.tongSoDonTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-tuan-nay")
    .then(function (response) {
      $scope.tongSoDonTuanNay = response.data;
    });

  $scope.tongSoDonThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-thang-nay")
    .then(function (response) {
      $scope.tongSoDonThangNay = response.data;
    });

  $scope.tongSoDonNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-nam-nay")
    .then(function (response) {
      $scope.tongSoDonNamNay = response.data;
    });

  $scope.soDonHuyHnay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-hom-nay")
    .then(function (response) {
      $scope.soDonHuyHnay = response.data;
    });

  $scope.soDonHuyTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-tuan-nay")
    .then(function (response) {
      $scope.soDonHuyTuanNay = response.data;
    });

  $scope.soDonHuyThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-thang-nay")
    .then(function (response) {
      $scope.soDonHuyThangNay = response.data;
    });

  $scope.soDonHuyNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/so-don-huy-nam-nay")
    .then(function (response) {
      $scope.soDonHuyNamNay = response.data;
    });

  $scope.soSanPhamBanRaHomNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-day-number-product")
    .then(function (response) {
      $scope.soSanPhamBanRaHomNay = response.data;
    });

  $scope.soSanPhamBanRaTuanNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-week-number-product")
    .then(function (response) {
      $scope.soSanPhamBanRaTuanNay = response.data;
    });

  $scope.soSanPhamBanRaThangNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-month-number-product")
    .then(function (response) {
      $scope.soSanPhamBanRaThangNay = response.data;
    });

  $scope.soSanPhamBanRaNamNay = 0;
  $http
    .get("http://localhost:8080/api/thong-ke/sum-year-number-product")
    .then(function (response) {
      $scope.soSanPhamBanRaNamNay = response.data;
    });

  $scope.getListSanPhamBanChay = function () {
    $http
      .get("http://localhost:8080/api/thong-ke/san-pham-ban-chay")
      .then(function (response) {
        $scope.listSanPhamBanChay = response.data;
        $scope.listSanPhamBanChay.sort(function (a, b) {
          return b.doanhSo - a.doanhSo;
        });
        $scope.listSanPhamBanChay = $scope.listSanPhamBanChay.slice(0, 10);
      });
  };
  $scope.getListSanPhamBanChay();

  var currentDate = new Date();
  var firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  // Gán giá trị mặc định cho ngày bắt đầu và ngày kết thúc
  $scope.startDate = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth(),
    1
  );
  $scope.endDate = new Date(Date.parse(currentDate.toISOString().slice(0, 10)));

  var ctxBar = document.getElementById("myBarChart").getContext("2d");

  // Khởi tạo biểu đồ
  var ctxBar = document.getElementById("myBarChart").getContext("2d");
  var myBarChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: [], // Sẽ cập nhật labels sau
      datasets: [
        {
          label: "Doanh số",
          data: [], // Sẽ cập nhật data sau
          backgroundColor: "#36a2eb",
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
  $scope.updateChart = function () {
    var startDate = new Date($scope.startDate);
    var endDate = new Date($scope.endDate);

    // Dữ liệu doanh số giả định (ví dụ)
    var salesData = [];
    var currentDate = new Date(startDate);

    // Tạo dữ liệu doanh số giả định cho mỗi ngày từ ngày bắt đầu đến ngày kết thúc
    while (currentDate <= endDate) {
      // Tính toán dữ liệu doanh số cho mỗi ngày ở đây (ví dụ: dùng Math.random() để tạo số ngẫu nhiên)
      var randomSales = Math.floor(Math.random() * 1000) + 1; // Doanh số ngẫu nhiên từ 1 đến 1000
      salesData.push(randomSales);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Tạo mảng labels từ ngày bắt đầu đến ngày kết thúc
    var labels = [];
    currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      labels.push(
        `${currentDate.getDate()}/${
          currentDate.getMonth() + 1
        }/${currentDate.getFullYear()}`
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Update labels và data cho biểu đồ
    myBarChart.data.labels = labels;
    myBarChart.data.datasets[0].data = salesData; // Dữ liệu doanh số
    myBarChart.update();
  };
  $scope.updateChart();
});
