myApp.service("StatusService", function ($http) {
  this.statusOrder = null;

  this.setStatusOrder = function (data) {
    this.statusOrder = data;
  };

  this.fetchStatusOrder = function (id) {
    return $http.get("http://localhost:8080/api/v1/hoa-don-chi-tiet/status-order/" + id)
      .then(function (response) {
        this.setStatusOrder(response.data);
        return response.data;
      }.bind(this));
  };

  this.getStatusOrder = function () {
    return this.statusOrder;
  };
});
