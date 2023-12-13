myApp.controller("loginController", function ($scope, $http, $window, $location) {
  // Tạo một biến mới để lưu tên người dùng
  var token = $window.localStorage.getItem("token");
  if (token) {
    $scope.isLoggedIn = true;
  } else {
    $scope.isLoggedIn = false;
  }

  $scope.login = function () {
    var data = {
      username: $scope.username,
      password: $scope.password,
    };

    $http
      .post("http://localhost:8080/api/v1/auth/login", data)
      .then(function (response) {
        $window.localStorage.setItem("token", response.data.accessToken);
        $window.localStorage.setItem("role", response.data.role);

        if(response.data.role === "admin"){
          window.location.href = "http://127.0.0.1:5505/src/admin/index-admin.html#/dashboard";
        }else{
          window.location.href = "http://127.0.0.1:5505/src/admin/index-admin.html#/order";
        }
        // Cập nhật biến loggedInUsername khi đăng nhập thành công
        $window.location.reload();
      })
      .catch(function (error) {
        $scope.errorUsername = error.data.username;
        $scope.errorPassword = error.data.password;
      });
  };

  $scope.logout = function () {
    // Xóa token khỏi localStorage
    window.location.href = "http://127.0.0.1:5505/src/admin/index-admin.html#/admin/login";
    $window.localStorage.removeItem("token");
    $window.localStorage.removeItem("role");
    $scope.isLoggedIn = false;
  };
});