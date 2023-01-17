#include <ESP8266WiFi.h>
#include "HttpSession.h"

#define BAUDRATE_TRACE 115200
#define SERVER_PORT 80
#define TRACE(...) Serial.printf(__VA_ARGS__);

/* Set your Static IP address */
IPAddress local_IP(192, 168, 1, 100);
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
      Serial.write(c);                    // print it out the serial monitor
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
          
          // turns the GPIOs on and off
          if (header.indexOf("GET /5/on") >= 0) {
            Serial.println("GPIO 5 on");
            output5State = "on";
            digitalWrite(output5, HIGH);
          } else if (header.indexOf("GET /5/off") >= 0) {
            Serial.println("GPIO 5 off");
            output5State = "off";
            digitalWrite(output5, LOW);
          } else if (header.indexOf("GET /4/on") >= 0) {
            Serial.println("GPIO 4 on");
            output4State = "on";
            digitalWrite(output4, HIGH);
          } else if (header.indexOf("GET /4/off") >= 0) {
            Serial.println("GPIO 4 off");
            output4State = "off";
            digitalWrite(output4, LOW);
          }
          
          // Display the HTML web page
          client.println("<!DOCTYPE html><html>");
          client.println("<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">");
          client.println("<link rel=\"icon\" href=\"data:,\">");
          // CSS to style the on/off buttons 
          // Feel free to change the background-color and font-size attributes to fit your preferences
          client.println("<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}");
          client.println(".button { background-color: #195B6A; border: none; color: white; padding: 16px 40px;");
          client.println("text-decoration: none; font-size: 30px; margin: 2px; cursor: pointer;}");
          client.println(".button2 {background-color: #77878A;}</style></head>");
          
          // Web Page Heading
          client.println("<body><h1>ESP8266 Web Server</h1>");
          
          // Display current state, and ON/OFF buttons for GPIO 5  
          client.println("<p>GPIO 5 - State " + output5State + "</p>");
          // If the output5State is off, it displays the ON button       
          if (output5State=="off") {
            client.println("<p><a href=\"/5/on\"><button class=\"button\">ON</button></a></p>");
          } else {
            client.println("<p><a href=\"/5/off\"><button class=\"button button2\">OFF</button></a></p>");
          } 
             
          // Display current state, and ON/OFF buttons for GPIO 4  
          client.println("<p>GPIO 4 - State " + output4State + "</p>");
          // If the output4State is off, it displays the ON button       
          if (output4State=="off") {
            client.println("<p><a href=\"/4/on\"><button class=\"button\">ON</button></a></p>");
          } else {
            client.println("<p><a href=\"/4/off\"><button class=\"button button2\">OFF</button></a></p>");
          }
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
  // Clear the header variable
  header = "";
  // Close the connection
  client.stop();
  Serial.println("Client disconnected.");
  Serial.println("");
}
