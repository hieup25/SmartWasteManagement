#include <ESP8266WiFi.h>
#include "HttpSession.h"

#define BAUDRATE_TRACE 115200
#define SERVER_PORT 80
#define TRACE(...) Serial.printf(__VA_ARGS__);

/* Set your Static IP address */
IPAddress local_IP(192, 168, 1, 111);
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

WiFiServer server(SERVER_PORT);
// Set your Gateway IP address
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 0, 0);
IPAddress primaryDNS(8, 8, 8, 8);   //optional
IPAddress secondaryDNS(8, 8, 4, 4); //optional

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
  while (client.connected() && currentTime - previousTime <= timeoutTime) { // loop while the client's connected
    currentTime = millis();         
    if (client.available()) {             // if there's bytes to read from the client,
      char c = client.read();             // read a byte, then
//      Serial.write(c);
      header += c;
      if (c == '\n') {                    // if the byte is a newline character
        // if the current line is blank, you got two newline characters in a row.
        // that's the end of the client HTTP request, so send a response:
        if (currentLine.length() == 0) {
          // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
          // and a content-type so the client knows what's coming, then a blank line:
          client.println("HTTP/1.1 200 OK");
          client.println("Content-type:text/html");
          client.println("Connection: close");
          client.println();
          
          // Display the HTML web page
          client.println("<!DOCTYPE html><html>");
          client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
          client.println("<body><p>HAHAHAHA</p>");
          client.println("</body></html>");
          
          // The HTTP response ends with another blank line
          client.println();
          // Break out of the while loop
          break;
        } else { // if you got a newline, then clear currentLine
          currentLine = "";
        }
      } else if (c != '\r') {  // if you got anything else but a carriage return character,
        currentLine += c;      // add it to the end of the currentLine
      }
    }
  }
  Serial.println("HEAD:" + header);
  // Clear the header variable
  header = "";
  // Close the connection
  client.stop();
  Serial.println("Client disconnected.");
  Serial.println("");
}
