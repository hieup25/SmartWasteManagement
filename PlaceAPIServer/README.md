<!--Create 13/11/2022 
    Author: HieuPV
    Description:
-->
<!-- INSTALL MODULE -->
npm install express
npm install sqlite3
npm install cors

<!-- TO DO : p <=> process, d <=> done x <=> not handel-->
- [d] Cho phép truy cập tìm bằng tên và cả địa chỉ
- [d] Xử lý trường hợp không tìm thấy kết quả => trả về từ server?
- [d] Xử lý chỉ đưa ra kết quả với chữ cái đầu mỗi chuỗi ký tự bởi dấu cách, ví dụ Name = Trường => nhập g không được trả ra kết quả.
- [d] Xử lý khi list ra danh sách gợi ý điều khiển được bằng các phím mũi tên
- [d] Xử lý lướt qua (hover) item select đang chọn reset
- [d] Xử lý khi val trong text box tìm kiếm vẫn giữ giá trị cũ, khi đó ấn các phím khác gửi request => check listener input
- [d] Xử lý kích thước của box tìm kiếm và list
- [d] Xử lý khi click ra khỏi vùng tìm kiếm => list sẽ đóng, không xóa list cũ
- [p] Xử lý vấn đề, tìm kiếm địa chỉ thiếu các trường, trả về kết quả trước đó, ví dụ: 235 hoang quoc viet, co nhue, bac tu liem. Nhung nhap 235 hoang quoc viet bac tu liem cũng được
- [p] Sử dụng accessToken để truy cập => Giới hạn số lượng hạn ngạch request, không cho phép truy cập => Tạo 1 file text cho các access Token này
- [p] Định kỳ bảo trì server => Đóng các kết nối, đóng database => Khởi động lại
- [p] Test trường hợp nhiều client truy cập tìm kiếm thao tác với database => Từ đó chỉnh đối cách open và close database
- [d] Sau request api place thành công => trừ quota tronng database đi
- [d] Kiểm tra id truyền về có trong database không, nếu có mới xử lý tiếp không thì trả về fail

<!-- IDEAL -->
- Phát triển các GeoJson