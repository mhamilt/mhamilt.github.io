---
layout: post
title:  "10 Ways to Blink an LED on an Arduino UNO"
date:   2019-02-07 10:00:00 +0100
categories: blog
tags: arduino
---
***
<br />
<p><span class="firstcharacter">T</span></p>here is more than one way to skin a cat, it's just that some methods are messier than other. So, inspired code from students and developers alike, I wanted to collect together the myriad of weird and wonderful ways that have been found to tackle the simple task of blinking an LED on Arduino. By no means is this comprehensive, I have left out using the UNO's [3 Timers] (https://playground.arduino.cc/Main/TimerPWMCheatsheet) for instance. However, if you are reading this and are infuriated that your favourite method has been left out, get in touch.

***

### Lets Blink a light

{% highlight C++ %}
/*
  101 Ways to Blink an LED
*/
#define blink digitalWrite(LED_BUILTIN, HIGH);delay(1000);digitalWrite(LED_BUILTIN, LOW);delay(1000);

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);

  //  // Blink with Timer
  cli();        //Disable global interrupts
  TCCR1A = 0;   //Reset Timer 1 Counter Control Register A
  TCCR1B = 0;   //Reset Timer 1 Counter Control Register B
  TCCR1B |= _BV(WGM12) | _BV(CS12) | _BV(CS10); // WGM12 turn on CTC mode (clear timer on compare match) | CS10 and CS12 bits for 1024 prescaler
  uint8_t blinksPerSecond = 1;
  OCR1A = (16e6 / 1024) / blinksPerSecond;
  TIMSK1 = 0; // enable timer interrupt
  sei(); //enable interrupts
}

void loop()
{
  digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000);

  blink

  do
  {
    PORTB |= 0x20;
    _delay_ms(1000);
    PORTB &= ~0x20;
    _delay_ms(1000);
  } while (false);

  PORTB |= (1 << PB5); delay(1000);
  PORTB &= ~(1 << PB5); delay(1000);

  PORTB |= _BV(PB5);
  unsigned long then = millis();
  while ((millis() - then) < 1000) {}
  PORTB &= ~_BV(PB5);
  then = millis();
  while ((millis() - then) < 1000) {}

  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN)); delay(1000);
  ((digitalRead(LED_BUILTIN)) ?  digitalWrite(LED_BUILTIN, LOW) : digitalWrite(LED_BUILTIN, HIGH)); delay(1000);

  PORTB ^= 0x20; delay(1000);
  PORTB ^= 32; delay(1000);
  PORTB ^= 0b100000; delay(1000);

  then = millis();
  TIMSK1 |= (1 << OCIE1A); // enable timer interrupt
  while ((millis() - then) < 2000) {}
  TIMSK1 = 0; // disable timer interrupt
}

ISR(TIMER1_COMPA_vect)
{
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}
{% endhighlight %}
