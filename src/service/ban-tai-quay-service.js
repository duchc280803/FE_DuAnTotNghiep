myApp.service("CartService", function ($http) {
  this.idCartChiTiet = {};
  this.idKhachHangByIdHoaDon = {};

  this.setIdCart = function (id) {
    return $http
      .get("http://localhost:8080/api/v1/don-hang/id_cart?id=" + id)
      .then(
        function (response) {
          this.idCartChiTiet = response.data;
          return this.idCartChiTiet.id;
        }.bind(this)
      );
  };

  this.getIdCart = function () {
    return this.idCartChiTiet.id;
  };

  this.setIdKhach = function (id) {
    return $http
      .get("http://localhost:8080/api/v1/don-hang/order-counter/" + id)
      .then(
        function (response) {
          this.idKhachHangByIdHoaDon = response.data;
          return this.idKhachHangByIdHoaDon.idKhach;
        }.bind(this)
      );
  };

  this.getIdKhach = function () {
    return this.idKhachHangByIdHoaDon.idKhach;
  };
});
