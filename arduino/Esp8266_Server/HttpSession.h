#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
/*Define URL*/
#define UNKNOWN_URL  ""
/*Define Query*/
#define UNKNOWN_QUERY   ""

const String GET_STATE_TRASH = "GET /get-state";

struct HttpSession {
  String content; // content request
  WiFiClient client;
};

/*---*/
String GetURL(const String& request) {
  int second_space = request.indexOf(' ', request.indexOf(' ') + 1);
  return (second_space != -1) ? request.substring(0, second_space) : UNKNOWN_URL;
}
void SendResponse(WiFiClient& client, int status, String msg, String response = "") {
  client.println("HTTP/1.1 " + String(status) + " " + msg);
  client.println("Content-type:application/json");
  client.println("Connection: close");
  client.println();
  if (response.length()) {
    client.println(response);
    client.println();
  }
}
void HandleRequest(HttpSession& http) {
  String _url = GetURL(http.content);
  if (!_url) return;
  Serial.println("URL: " + _url);
  if (_url.indexOf(GET_STATE_TRASH) != -1) {
    SendResponse(http.client, 200, "OK", "{\"state\":\"FULL\"}");
  } else {
    SendResponse(http.client, 400, "Bad Request");
  }
}
