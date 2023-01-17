String GetMethod(String request) {
  String _method;
  int split1 = request.charAt(' ');
  return  _method.substring(0, split1);
}
//  // Wait until the client sends some data
//  TRACE("new client ");
//  while(!client.available()){
//    delay(1);
//  }
//  // Read the first line of the request
//  String request = client.readStringUntil('r');
//  TRACE("request [%s]\n", request);
//  client.flush();
//  // Handle request
//  String method = GetMethod(request);
//  TRACE(method.c_str());
