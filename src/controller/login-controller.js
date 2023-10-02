myApp.controller("loginController", function ($scope, $http, $window) {
    var token = $window.localStorage.getItem('token');

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
    
    $http.post("http://localhost:8080/api/v1/auth/login", data).then(
      function (response) {
        // Lưu token và tên người dùng vào localStorage
        $window.localStorage.setItem("token", response.data.accessToken);

        // Lấy thông tin chi tiết về người dùng
        $http
          .get("http://localhost:8080/api/nhan-vien/all/" + $scope.username)
          .then(function (userResponse) {
            // Kiểm tra vai trò của người dùng
            if (userResponse.data.role === "MANAGER") {
              // Nếu người dùng là admin, mở trang admin
              $window.location.assign("/src/home-admin.html");
            } else {
              // Nếu người dùng không phải là admin, mở trang user
              $window.location.assign("/src/home-user.html");
            }
          });
      },
      function (error) {
        $scope.errorUsername = error.data.username;
        $scope.errorPassword = error.data.password;
      }
    );
  };
  $scope.logout = function () {
    // Xóa token khỏi localStorage
    $window.localStorage.removeItem("token");
    $scope.isLoggedIn = false;
    // Chuyển hướng người dùng về trang đăng nhập
    window.location.href = "/src/pages/authentication-login.html";
  };
});
