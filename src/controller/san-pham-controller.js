myApp.controller("sanPhamController", function ($http, $scope) {
    $scope.filterSanPham = function () {
        var trangThai = ...; // Lấy giá trị của trangThai từ request
        var idDanhMuc = ...; // Lấy giá trị của idDanhMuc từ request
        var idThuongHieu = ...; // Lấy giá trị của idThuongHieu từ request
        var idKieuDe = ...; // Lấy giá trị của idKieuDe từ request
        var idXuatXu = ...; // Lấy giá trị của idXuatXu từ request
        var maSanPham = ...; // Lấy giá trị của maSanPham từ request
        var tenSanPham = ...; // Lấy giá trị của tenSanPham từ request
        var pageNumber = ...; // Lấy giá trị của pageNumber từ request
        var pageSize = ...; // Lấy giá trị của pageSize từ request

        $http.get("/hien-thi", {
            params: {
                trangThai: trangThai,
                idDanhMuc: idDanhMuc,
                idThuongHieu: idThuongHieu,
                idKieuDe: idKieuDe,
                idXuatXu: idXuatXu,
                maSanPham: maSanPham,
                tenSanPham: tenSanPham,
                pageNumber: pageNumber,
                pageSize: pageSize
            }
        }).then(function (response) {
            // Xử lý dữ liệu trả về từ server
            var data = response.data;
            // ...
        }).catch(function (error) {
            // Xử lý lỗi nếu có
            // ...
        });
    };
});