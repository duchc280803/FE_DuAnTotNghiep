myApp.controller("thongKeController", function ($scope) {
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
          data: [10, 20, 30, 40, 50, 60],
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
          label: function(tooltipItem, data) {
            return 'Số đơn: ' + tooltipItem.yLabel;
          }
        }
      }
    },
  });
});
