myApp.service("CartService", function($http) {
  this.idCartChiTiet = {};

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
});