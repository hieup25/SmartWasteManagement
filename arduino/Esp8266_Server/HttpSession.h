#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include "HCSR04.h"
#define MAX_COUNT_SERVER 2
/*Define URL*/
#define UNKNOWN_URL  ""
/*Define Query*/
#define UNKNOWN_QUERY   ""
#define URL_SERVER_QUERY "urlserver"

const String GET_STATE_TRASH = "GET /get-state";
const String GET_DELETE_SERVER = "GET /delete-server";

// Array of servers registered to receive notifications

String g_arrayServer[MAX_COUNT_SERVER];
int g_count_server = 0;
struct HttpSession {
  String content; // content request
  WiFiClient client;
};

struct {
  HCSR04 *hcsr;
} ModuleData;

/*---*/
String GetURL(const String& request) {
  int second_space = request.indexOf(' ', request.indexOf(' ') + 1);
  return (second_space != -1) ? request.substring(0, second_space) : UNKNOWN_URL;
}
bool AddServer(const String& server, String& msg_error) {
  if (g_count_server < MAX_COUNT_SERVER) {
    for (int i = 0; i < MAX_COUNT_SERVER; i++) {
      if (g_arrayServer[i].equals(server)) {
        Serial.println("Has server config");
        return true;
      }
    }
    Serial.println("Add server " + server + " success");
    g_arrayServer[g_count_server] = server;
    g_count_server++;
    return true;
  } else {
    msg_error = "Max Count Server";
  }
  return false;
}
bool DelServer(const String& server) {
  String temp[MAX_COUNT_SERVER];
  int count = 0;
  for (int i = 0; i < MAX_COUNT_SERVER; i++) {
    if (g_arrayServer[i].equals(server)) {
      g_arrayServer[i] = "";
      Serial.println("Delete server" + server + "config success");
    }
    if (g_arrayServer[i].length() != 0) {
      temp[count] = g_arrayServer[i];
      count++;
    }
  }
  g_count_server = 0;
  for (int i = 0; i < MAX_COUNT_SERVER; i++) {
    if (temp[i].length() != 0) {
      g_arrayServer[i] = temp[i];
      g_count_server++;
    }
  }
  return true;
}
bool GetQuery(const String& url, String& val, const String query) {
  int _find_start = url.indexOf('?');
  if (_find_start == -1)
    return false;
  String temp = query + "=";
  int find_query = url.indexOf(temp, _find_start + 1);
  if (find_query != -1) { // found
    int leng_start = find_query + temp.length();
    int find_end = url.indexOf("&", leng_start);
    if (find_end != -1) { //found
      val = url.substring(leng_start, find_end);
    } else {
      val = url.substring(leng_start);
    }
    return true;
  }
  return false;
}
void SendResponse(WiFiClient& client, int status, String msg, String response = "") {
  Serial.println(msg);
  client.println("HTTP/1.1 " + String(status) + " " + msg);
  client.println("Content-type:application/json");
  client.println("Connection: close");
  client.println();
  if (response.length()) {
    client.println(response);
    client.println();
  }
}
void GETRequest(String data) {
  // Notification
  for (int i = 0; i < g_count_server; i++) {
    if (g_arrayServer[i].length() == 0) {
      return;
    }
    WiFiClient _client;
    HTTPClient http;
    String serverPath = g_arrayServer[i] + data;
    Serial.println(serverPath);
    http.begin(_client, serverPath.c_str());
    // Send HTTP GET request
    int httpResponseCode = http.GET();
    if (httpResponseCode > 0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      Serial.println(payload);
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
      Serial.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }
    http.end();
  }
}
void HandleRequest(HttpSession& http) {
  String _url = GetURL(http.content);
  if (!_url) return;
  Serial.println("URL: " + _url);
  if (_url.indexOf(GET_STATE_TRASH) != -1) { // Request Once
    String get_server;
    if (GetQuery(_url, get_server, URL_SERVER_QUERY)) {
      String msg_error;
      if (!AddServer(get_server, msg_error)) {
        SendResponse(http.client, 400, msg_error);
        return;
      }
      SendResponse(http.client, 200, "OK", "{\"state\":\"" + ModuleData.hcsr->getState() + "\"}");
    } else {
      SendResponse(http.client, 400, "Not Found Query Server");
    }
  } else if (_url.indexOf(GET_DELETE_SERVER) != -1) {
    String get_server;
    if (GetQuery(_url, get_server, URL_SERVER_QUERY)) {
      String msg_error;
      if (!DelServer(get_server)) {
        SendResponse(http.client, 400, "Error when Del server");
        return;
      }
      SendResponse(http.client, 200, "OK");
    } else {
      SendResponse(http.client, 400, "Not Found Query Server");
    }
  } else {
    SendResponse(http.client, 400, "Bad Request");
  }
}
