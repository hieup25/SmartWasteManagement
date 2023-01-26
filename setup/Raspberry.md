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
ssid="Mi 11"
psk="12345678"
key_mgmt=WPA-PSK
}

<!-- Taọ deamon nodejs -->
https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service

[Unit]
Description=swm
After=network-online.target

[Service]
ExecStart=/usr/bin/nodejs /home/pi/app/swm/server.js                 
Restart=always
User=pi    
WorkingDirectory=/home/pi/app/swm/

[Install]
WantedBy=multi-user.target

<!-- Cài đặt dịch vụ -->
sudo chmod +x name_service.service
sudo mv name_service.service /etc/systemd/system
- Thực hiện các thao tác chạy dịch vụ như bình thường.
journalctl -u swm.service // đọc log