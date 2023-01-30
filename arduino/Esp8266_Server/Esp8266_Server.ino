#include "HttpSession.h"

#define BAUDRATE_TRACE 115200
#define SERVER_PORT 80
#define TRIG  7
#define ECHO  8
#define TRACE(...) Serial.printf(__VA_ARGS__);

/* Set your Static IP address */
IPAddress local_IP(192, 168, 1, 111);
// Set your Gateway IP address
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional
/* */

const char* WIFI_NAME     = "TP-Link_0D5E"; // Tên wifi muốn kết nối đến.
const char* WIFI_PASSWORD = "93853767";     // Mật khẩu wifi này.
// Variable to store the HTTP request
String header;
// Current time
unsigned long currentTime = millis();
// Previous time
unsigned long previousTime = 0; 
// Define timeout time in milliseconds (example: 2000ms = 2s)
const long timeoutTime = 2000;
const long intervalCheckTrash = 5000;
unsigned long previousTimeCheckTrash = 0;
WiFiServer server(SERVER_PORT);
HCSR04 hcsr(TRIG, ECHO);

void setup() {
  Serial.begin(BAUDRATE_TRACE);
  delay(10);
  // Config WIFI
  if (!WiFi.config(local_IP, gateway, subnet, primaryDNS, secondaryDNS)) {
    TRACE("STA Failed to configure\n");
  }
  // Connect to WiFi network
  TRACE("\n\n");
  TRACE("Connecting to: %s", WIFI_NAME);
  WiFi.begin(WIFI_NAME, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    TRACE(".");
  }
  TRACE("\n WiFi Connected\n");
  // Start server
  server.begin();
  TRACE("Server listening at http://");
  Serial.print(WiFi.localIP());
  TRACE(":%d\n", SERVER_PORT);
  ModuleData.hcsr = &hcsr;
}

void loop() {
  // Check if a client has request
  WiFiClient client = server.available();
  if (!client) {
    delay(200);
    return;
  }
  String currentLine = "";                // make a String to hold incoming data from the client
  currentTime = millis();
  previousTime = currentTime;
  if (currentTime - previousTimeCheckTrash <= intervalCheckTrash) {
      previousTimeCheckTrash = currentTime;
      hcsr.checkState();
      TRACE("CHECK STATE");
  }
  while (client.connected() && currentTime - previousTime <= timeoutTime) { // loop while the client's connected
    currentTime = millis();         
    if (client.available()) {             // if there's bytes to read from the client,
      char c = client.read();             // read a byte, then
      header += c;
      if (c == '\n') {
        if (currentLine.length() == 0) {
            HttpSession session;
            session.content = header;
            session.client = client;
            HandleRequest(session);
            break;
        } else {
          currentLine = "";
        }
      } else if (c != '\r') {
        currentLine += c;
      }
    }
  }
  // Clear the header variable
  header = "";
  // Close the connection
  client.stop();
  Serial.println("Client disconnected.");
  Serial.println("");
}
