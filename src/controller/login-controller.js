myApp.controller(
  "loginController",
  function ($scope, $http, $window) {
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
          if (response.data.role === "ADMIN") {
            $window.location.assign("http://127.0.0.1:5503/src/index.html#/dashboard");
          }
          if (response.data.role === "STAFF") {
            $window.location.assign("http://127.0.0.1:5503/src/index.html#/dashboard");
          }
          if (response.data.role === "USER") {
            $window.location.assign("http://127.0.0.1:5503/src/index.html#/home");
          }
        })
        .catch(function (error) {
          $scope.errorUsername = error.data.username;
          $scope.errorPassword = error.data.password;
        });
    };

    var role = $window.localStorage.getItem("role");
    $scope.logout = function () {
      // Xóa token khỏi localStorage
      $window.localStorage.removeItem("token");
      $window.localStorage.removeItem("role");
      $scope.isLoggedIn = false;
      // Chuyển hướng người dùng về trang đăng nhập
      if (role === "USER") {
        $window.location.assign("http://127.0.0.1:5503/src/index.html#/login");
      }
      if (role === "ADMIN") {
        $window.location.assign("http://127.0.0.1:5503/src/index.html#/admin/login");
      }
      if (role === "STAFF") {
        $window.location.assign("http://127.0.0.1:5503/src/index.html#/admin/login");
      }
    };
  }
);
