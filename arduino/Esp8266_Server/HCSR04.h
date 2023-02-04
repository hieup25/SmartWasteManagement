#define LIMIT_FULL 20 //cm
#define D5 14 // trig
#define D6 12 // echo

class HCSR04 {
  private:
  int trig;
  int echo;
  String ip;
  String StateCurrent = "UNDEFINE";
  void (*TriggerState)(String);
  int getDistance() {
     long duration;  
     int distance;
     // Clears the trigPin
     digitalWrite(trig, LOW);  
     delayMicroseconds(2);  
     // Sets the trigPin on HIGH state for 10 micro seconds  
     digitalWrite(trig, HIGH);  
     delayMicroseconds(10);  
     digitalWrite(trig, LOW);  
     // Reads the echoPin, returns the sound wave travel time in microseconds  
     duration = pulseIn(echo, HIGH);
     // Calculating the distance  
     distance = duration*0.034/2;
//     Serial.println("distance: "+ String(distance));
     return distance;
  }
  public:
  HCSR04(int trig, int echo, String ip) {
    this->trig = trig;
    this->echo = echo;
    this->ip = ip;
    pinMode(trig, OUTPUT);   // chân trig sẽ phát tín hiệu
    pinMode(echo, INPUT);    // chân echo sẽ nhận tín hiệu
  }
  void setFunctionTrigger(void (*fun)(String)) {
    this->TriggerState = fun;
    checkState();
  }
  String getState() {
    return StateCurrent;
  }
  void checkState() {
    if (getDistance() <= LIMIT_FULL) {
      if (this->StateCurrent != "FULL") {
        TriggerState("?status=FULL&ip=" + ip);
        this->StateCurrent = "FULL";
      }
    } else {
      if (this->StateCurrent != "EMPTY") {
        TriggerState("?status=EMPTY&ip=" + ip);
        this->StateCurrent = "EMPTY"; 
      }
    }
    delay(50);
  }
};
