<!-- Hiển thị màn hình khác -->
sudo apt-get install xrdp
<!-- Cài phím ảo -->
https://pimylifeup.com/raspberry-pi-on-screen-keyboard/

<!-- INSTALL MODULE -->
sudo apt install nodejs
sudo apt install npm
npm install express
npm install sqlite3
npm install cors

<!-- Cấu hình ssh không màn hình -->
- Cắm thẻ nhớ vào máy tính
- Gõ touch /Volumes/boot/ssh
- Cắm thẻ nhớ vào Pi và scan ip

<!-- Cấu hình wifi -->
- Tạo file wpa_supplicant.conf trong /Volumes/boot/ với nội dung
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
network={
ssid="YOUR_NETWORK_NAME"
psk="YOUR_PASSWORD"
key_mgmt=WPA-PSK
}
