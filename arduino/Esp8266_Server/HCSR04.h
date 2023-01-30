#define LIMIT_FULL 10 //cm

class HCSR04 {
  private:
  int trig;
  int echo;
  String StateCurrent = "UNDEFINE";
  int getDistance() {
    unsigned long duration; // biến đo thời gian
    int distance;           // biến lưu khoảng cách
    
    /* Phát xung từ chân trig */
    digitalWrite(trig,0);   // tắt chân trig
    delayMicroseconds(2);
    digitalWrite(trig,1);   // phát xung từ chân trig
    delayMicroseconds(5);   // xung có độ dài 5 microSeconds
    digitalWrite(trig,0);   // tắt chân trig
    
    /* Tính toán thời gian */
    // Đo độ rộng xung HIGH ở chân echo. 
    duration = pulseIn(echo,HIGH);  
    // Tính khoảng cách đến vật.
    distance = int(duration/2/29.412);
    return distance;
  }
  public:
  HCSR04(int trig, int echo) {
    this->trig = trig;
    this->echo = echo;
    pinMode(trig, OUTPUT);   // chân trig sẽ phát tín hiệu
    pinMode(echo, INPUT);    // chân echo sẽ nhận tín hiệu
  }
  String getState() {
    return StateCurrent;
  }
  void checkState() {
    if (getDistance() <= LIMIT_FULL) {
      this->StateCurrent = "FULL";
    } else {
      this->StateCurrent = "EMPTY";
    }
    delay(100);
  }
};
