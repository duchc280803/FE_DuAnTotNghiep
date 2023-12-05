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

  var ctxBar = document.getElementById("myBarChart").getContext("2d");
  var myBarChart = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: [
        "Tháng 1",
        "Tháng 2",
        "Tháng 3",
        "Tháng 4",
        "Tháng 5",
        "Tháng 6",
        "Tháng 7",
        "Tháng 8",
        "Tháng 9",
        "Tháng 10",
        "Tháng 11",
        "Tháng 12",
      ],
      datasets: [
        {
          label: "Doanh số",
          data: [100, 200, 500, 200, 500, 600, 200, 800, 564, 1000, 600, 400],
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
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return "Số đơn: " + tooltipItem.yLabel;
          },
        },
      },
    },
  });

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
          $scope.listSanPhamBanChay.sort(function(a, b) {
            return b.doanhSo - a.doanhSo;
          });
        });
    };
    $scope.getListSanPhamBanChay();
});
