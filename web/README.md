<!-- AccessToken Only Use admin for request PlaceAPIServer-->
09f76ee031ad59a5ff9f43f06427b799

<!-- INCLUDE CDN -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css" integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js" integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg=" crossorigin=""></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css" />
<script src="https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js"></script>

<!-- PLUGIN COOL REFERENCE -->
Leaflet.Geodesic => tính toán khoảng cách giữa các marker
Leaflet.GeotagPhoto => Plugin để gắn thẻ địa lý ảnh, với hai chế độ: máy ảnh và hình chữ thập.
Leaflet.CoordinatedImagePreview =>Hiển thị hình ảnh phối hợp trong giới hạn bản đồ.
Leaftlet.Legend => Hiển thị chú giải
https://www.liedman.net/leaflet-routing-machine/api/ => API chỉ đường: Build server của riêng mình || OSRM

<!-- DATA MAP -->
https://data.opendevelopmentmekong.net/vi/organization/vietnam-organization?taxonomy=Education+and+training&q=&sort=score+desc%2C+metadata_modified+desc
https://docs.google.com/spreadsheets/d/1T8g4WHfoEYh0u3vPEwh8VbBdfew0W8ZMurTslWfuwd8/edit#gid=0
https://data.maptiler.com/downloads/asia/vietnam/
http://osmlab.github.io/osm-qa-tiles/

<!-- REFERENCE -->
https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
https://www.sqlitetutorial.net/sqlite-nodejs/connect/
https://www.w3schools.com/jquery/jquery_ref_ajax.asp
https://www.geeksforgeeks.org/javascript-custom-events/
https://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript
https://leafletjs.com/reference.html#map-setview
https://viblo.asia/p/su-khac-nhau-giua-deep-copy-va-shallow-copy-trong-javascript-4dbZN3qylYM

<!-- API -->
localhost:9000/notify_trash?ip=1.1.1.1&status=FULL

<!-- IDEA -->
- Nếu phát triển thêm thì
+, Thêm 1 server cloud để lưu trữ và trao đổi thông tin.
+, Server sẽ có nhiệm vụ lưu trữ thông tin của thùng rác(1) và những box server nào đã thêm thùng rác này vào(2):
    Ví dụ có 2 box server cùng thêm => Khi trạng thái thay đổi thì cả 2 server này đều phải được request đến để thông báo cho box server
+, Về phía thùng rác thì cần request đến cloud này để GET được 1 mảng (2) sau khi thay đổi trạng thái request đến tất cả địa chỉ có trong mảng này.
+, Về phía box server thì cũng cần request đến cloud này để nhận trạng thái (1). Hoặc cũng có thể phát triển thêm GET những thùng rác nào đã được thêm....
=> Phát triển cloud sẽ giúp bảo mật code phía cloud, không cần phải NAT quá nhiều client hoặc box server.
=> Các box server và client cần đăng ký MAC vào trong cloud nhằm tính chính xác và bảo mật hệ thống.

<!-- TO DO : p <=> process, d <=> done x <=> not handel-->
- [d] Fix không cho focus vào khung map => ấn tab để tái hiện.
- [p] Xử lý vấn đề data race trên mảng arraymarker và gửi dữ liệu xuống database
- [d] Hoàn thiện tính năng xóa thùng rác trong database
- [p] Đóng mở các database liên quan đến add remove edit get marker form database khi request xong => Vì ít khi sử dụng tới
- [d] Thêm cảnh báo thành công khi thao tác delete, xóa, sửa thùng rác
- [d] Thêm xử lý khi id không có hoặc bị trùng.
- [d] Xử lý update_status_trash.
- [x] Xử lý tooltip các thùng rác chưa có trạng thái khi mới vào web hoặc mới thêm là (unspecified state)
- [d] Xử lý không kéo khi Route bật
- [d] Xử lý đóng mở hành trình
- [d] Xử lý khi đang mở hành trình, status trash thay đổi => chạy lại route
- [d] Thông báo thùng rác nào đầy
- [d] Xử lý update api placeconfig
- [d] Xử lý cấu hình api placeconfig với webui
- [d] Sau khi thêm thùng rác mới hoặc khi mới vào webui get status trash thì cần request đến địa chỉ này để lấy trạng thái thùng rác (sẽ request đến server 9000 và để server này request đến thùng rác rồi response về webui => webui sẽ dựa vào response để điều chỉnh icon và trạng thái)
- [d] Sau khi edit nếu thay đổi địa chỉ ip thì cập nhật lại icon là undefine và request lại đến địa chỉ client đó để lấy trạng thái