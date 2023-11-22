myAppCustom.controller("DiaChiController", function ($scope, $window, $http) {

    // Tạo một hàm để gọi API lấy thông tin tài khoản
    $scope.loadProfile = function () {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var api = "http://localhost:8080/api/v1/account/profile";

        $http.get(api, config).then(function (response) {
            response.data.ngaySinh = new Date(response.data.ngaySinh);
            $scope.taiKhoan = response.data;
            // Load dữ liệu lên giao diện
            loadDiaChi();
        });

    };
    // Hàm để load thông tin địa chỉ
    function loadDiaChi() {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        var diaChiApi = "http://localhost:8080/api/v1/account/dia-chi";

        $http.get(diaChiApi, config).then(function (response) {
            $scope.diaChiList = response.data;
            console.log($scope.diaChiList);
            // Bạn có thể sử dụng $scope.diaChiList để hiển thị trên giao diện
        });
    }

    // Gọi hàm khi trang được tải
    $scope.loadProfile();
    $scope.submitAddress = function () {
        // Sử dụng hộp thoại xác nhận trước khi thực hiện thêm mới
        var isConfirmed = confirm("Bạn có chắc chắn muốn thêm địa chỉ mới không?");

        if (!isConfirmed) {
            // Người dùng đã hủy xác nhận, không thực hiện thêm mới
            return;
        }

        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var diaChiApi = "http://localhost:8080/api/v1/account/create-dia-chi";
        var requestData = {
            diaChi: $scope.newAddress.addressName
        };

        $http.post(diaChiApi, requestData, config).then(
            function (response) {
                // Xử lý phản hồi nếu cần
                console.log(response.data);

            },
            function (error) {
                // Xử lý lỗi nếu cần
                console.error(error);
            }
        );
        $window.location.reload();
        alert('Thêm địa chỉ thành công');
    };

    $scope.prepareUpdateAddress = function (diaChi) {
        console.log('Preparing to update address:', diaChi);
        $scope.updateAddressName = diaChi.diaChi;
        // Lưu ID của địa chỉ cần cập nhật để sử dụng trong submit
        $scope.updateAddressId = diaChi.id; // Đảm bảo rằng đây là ID của địa chỉ
    };

    // Trong controller Angular của bạn
    $scope.updateAddress = function () {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        var updatedData = {
            diaChi: $scope.updateAddressName
        };

        console.log(updatedData);
        // Gửi yêu cầu cập nhật địa chỉ
        $http.put('http://localhost:8080/api/v1/account/update-dia-chi/' + $scope.updateAddressId, updatedData, config)
            .then(function (response) {
            })
            .catch(function (error) {
            });
        $window.location.reload();
        alert('Update địa chỉ thành công');
    };

    //set default
    $scope.setAsDefault = function (diaChi) {
        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
        // Gọi API hoặc thực hiện các thay đổi cần thiết để đặt địa chỉ này làm mặc định
        // Dưới đây là một ví dụ sử dụng $http để gửi yêu cầu PUT đặt địa chỉ làm mặc định
        $http({
            method: 'PUT',
            url: 'http://localhost:8080/api/v1/account/set-default-dia-chi/' + diaChi.id,
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
            .then(function (response) {
                // Xử lý khi cập nhật thành công
                console.log(response.data);
            })
            .catch(function (error) {
                // Xử lý khi cập nhật thất bại
                console.error(error.data);
            });
        $window.location.reload();
        alert('Update địa chỉ thành công');
    };

     // Hàm để cập nhật thông tin tài khoản
    $scope.updateProfile = function () {
        // Gọi hộp thoại xác nhận trước khi thực hiện cập nhật
        var isConfirmed = confirm("Bạn có chắc chắn muốn cập nhật thông tin tài khoản không?");

        if (!isConfirmed) {
            // Người dùng đã hủy xác nhận, không thực hiện cập nhật
            return;
        }

        var token = $window.localStorage.getItem("token-customer");
        var config = {
            headers: {
                Authorization: "Bearer " + token,
            },
        };

        var updateProfileApi = "http://localhost:8080/api/v1/account/update-profile";

        // Tạo một đối tượng chứa thông tin cần cập nhật
        var updatedProfileData = {
            hoTen: $scope.taiKhoan.hoTen,
            soDienThoai: $scope.taiKhoan.soDienThoai,
            email: $scope.taiKhoan.email,
            ngaySinh: $scope.taiKhoan.ngaySinh,
            gioiTinh: $scope.taiKhoan.gioiTinh
        };

        $http.put(updateProfileApi, updatedProfileData, config)
            .then(function (response) {
                // Xử lý khi cập nhật thành công
                console.log(response.data);
                // Cập nhật lại thông tin tài khoản trên giao diện
                $scope.loadProfile();
                // Tắt chế độ chỉnh sửa
                $scope.editMode = false;
            })
            .catch(function (error) {
                // Xử lý khi cập nhật thất bại
                console.error(error.data);
            });
            $window.location.reload();
            alert('Update thành công');
    };

    // Hàm để hủy bỏ cập nhật và tắt chế độ chỉnh sửa
    $scope.cancelUpdate = function () {
        // Tắt chế độ chỉnh sửa
        $scope.editMode = false;
        // Load lại thông tin tài khoản để hiển thị dữ liệu gốc
        $scope.loadProfile();
    };
});
