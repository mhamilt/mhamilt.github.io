---
layout: post
title:  "101 Ways to Blink an LED on an Arduino UNO"
date:   2019-02-07 10:00:00 +0100
categories: blog
tags: arduino
---
***
<br />
<p><span class="firstcharacter">T</span></p>here is more than one way to skin a cat, it's just that some methods are messier than other. So, inspired code from students and developers alike, I wanted to collect together the myriad of weird and wonderful ways that have been found to tackle the simple task of blinking an LED on Arduino. By no means is this comprehensive, however if you are reading this and are infuriated that your favourite method has been left out, get in touch.

***
<br>
## Lets Blink a Light

```c++
/*
 * 101 Methods to Blink an LED
 * Warning: May not include 101 methods
 */

#define blink digitalWrite(LED_BUILTIN, HIGH);delay(1000);digitalWrite(LED_BUILTIN, LOW);delay(1000);

void setTimer1(uint8_t blinksPerSecond)
{
  cli();        
  TCCR1A = 0;   
  TCCR1B = 0;   
  TCCR1B |= _BV(WGM12) | _BV(CS12) | _BV(CS10);
  OCR1A = (16e6 / 1024) / blinksPerSecond;
  TIMSK1 = 0;
  sei();
}

void ledBlink(int a, int b)
{
  for (int i = 0; i < a; ++i)
  {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(b);
    digitalWrite(LED_BUILTIN, LOW);
    delay(b);
  }
};

void setup()
{
  pinMode(LED_BUILTIN, OUTPUT);
  setTimer1 (1);
}

void loop()
{
  digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000);

  ledBlink(int a, int b)

  auto blinkLed = [](int a, int b){for(int i=0; i<a; ++i){digitalWrite(13,!digitalRead(13));delay(b);}};  
  blinkLed(2,1000);

  blink

  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN)); delay(1000);
  ((digitalRead(LED_BUILTIN)) ?  digitalWrite(LED_BUILTIN, LOW) : digitalWrite(LED_BUILTIN, HIGH)); delay(1000);

  PORTB |= 0x20;
  delay(1000);
  PORTB &= ~0x20;
  delay(1000);

  PORTB |= (1 << PB5); delay(1000);
  PORTB &= ~(1 << PB5); delay(1000);

  PORTB |= _BV(PB5);
  unsigned long then = millis();
  while ((millis() - then) < 1000) {}
  PORTB &= ~_BV(PB5);
  then = millis();
  while ((millis() - then) < 1000) {}

  PORTB ^= 0x20; delay(1000);
  PORTB ^= 32; delay(1000);
  PORTB ^= 0b100000; delay(1000);

  then = millis();
  TIMSK1 |= (1 << OCIE1A);
  while ((millis() - then) < 2000) {}
  TIMSK1 = 0;
}

ISR(TIMER1_COMPA_vect)
{
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}
```

***
<br>

## Explanations
The above approaches can be split into two groups, C++ solutions and Arduino solutions. C++ solutions are those that are based around code or pre-compiler trickery. Arduino solutions are those that implement specific aspects of the ATMEGA architecture, such as [port manipulation](https://www.arduino.cc/en/Reference/PortManipulation) and [timer interrupts](https://playground.arduino.cc/code/timer1).

***
<br>

## C++ Methods
By C++ methods, what I mean are any way of changing a pin's state on the Arduino that are based around the quirks of the C++ language. So, although `digitalWrite` is an Arduino function, using it in a for-loop, in another function, in a lambda function (& c...), I define that as still being grounded in C++.

#### Line 38: digitalWrite(LED_BUILTIN, HIGH); delay(1000); digitalWrite(LED_BUILTIN, LOW); delay(1000);

This method should require little explanation as it is the standard way to turn the built-in LED of an Arduino on. What was interesting about this one was the effort to format all instructions on one line, proving the lengths some will go to to make code look concise without writing any functions.

#### Line 19 - 28, 40: void ledBlink(int a, int b)
I always try and encourage students to make their code re-usable and create their own tools. So, it is no surprise that this is the least common way I have seen to LED blinking. When it is done, the author tends to sacrifice readability for brevity, in this case with the enigmatic function arguments `int a, int b`. The `a` argument dictates the number of blinks by setting the upper limit for a `for` loop. The `b` argument controls the value passed to the delay function. Functions are more utilitarian than in-line code but in this case, you just have to hope whoever is reading it already knows what the code does. It costs extra characters, but I would recommend going for the more explicit:
{% highlight c++ %}
void ledBlink(int numberOfBlinks, int msBlinkTime)
{
  for (int i = 0; i < numberOfBlinks; ++i)
  {
    digitalWrite(LED_BUILTIN, HIGH);
    delay(msBlinkTime);
    digitalWrite(LED_BUILTIN, LOW);
    delay(msBlinkTime);
  }
}
{% endhighlight %}
If you desperately need to write in-line, then you could alway use a lambda function...

#### Line 42: auto blinkLed = [](int a, int b)  {for(int i = 0; i < a; ++i){digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));delay(b);}};
Speaking of [lambda functions](https://en.cppreference.com/w/cpp/language/lambda), this approach has cropped up once or twice, mainly by seasoned c++ students who I think were looking to show off. The down side is that readability is greatly reduced. This is similar to the vanilla function declaration with the nuance that the `a` variable dictates the number of state switches (on to off or vice-versa) rather than whole blinks. So, it is more utilitarian than not writing a function. Lambda (or anonymous) functions I feel are more suited for the situations where you wan to disturb as little of the surrounding code as possible. Or, a situation where you need to use a function more than once in a contained space. For Arduino coding, most of the time it shouldn't come up, especially for beginners.

#### Line 6, 45: #define blink digitalWrite(LED_BUILTIN, HIGH);delay(1000);digitalWrite(LED_BUILTIN, LOW);delay(1000);

I feel someone was trying to mess with me when I saw this. I am not the biggest fan of pre-compiler macros at the best of times. So, what gains there are in only having to write `blink` to have the built-in LED turn on and off are lost in having to read `blink` and know what is going on. This is such a messy way of writing that it is kind of impressive.

#### Line 47, 48: digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN)); and ((digitalRead(LED_BUILTIN)) ?  digitalWrite(LED_BUILTIN, LOW) : digitalWrite(LED_BUILTIN, HIGH));
This is very hacky, but I appreciated the brevity of it. Even though the `LED_BUILTIN` has been set as `OUTPUT`, you can still read it's state. The `!digitalRead(LED_BUILTIN)` basically say, get me the state of the `LED_BUILTIN` pin (`digitalRead(LED_BUILTIN)`) then, return the opposite value by using `!`. This is the same logic for `((digitalRead(LED_BUILTIN)) ?  digitalWrite(LED_BUILTIN, LOW) : digitalWrite(LED_BUILTIN, HIGH));`, except this case uses the C++ [conditional (or ternary) operator](https://www.tutorialspoint.com/cplusplus/cpp_conditional_operator.htm). This basically evealutes the expression in brackets as boolean and then, if the result is `true` the first statement (left of `?`) executes and the second statement (right of `?`) executes if it is `false`.

***
<br>

## Arduino Methods
What I define as 'Arduino Methods' are ways to change the state of a pin that are based around quirks and the framework of interacting with the ATMega. For the most part this is a healthy dose of [Port Manipulation](https://www.arduino.cc/en/Reference/PortManipulation) and usage of the ATMega's in built [timers](https://playground.arduino.cc/code/timer1).

#### Line 50 - 53: PORTB |= and PORTB &=
This is one of the first methods that involve [Port Manipulation](https://www.arduino.cc/en/Reference/PortManipulation). In this case, PORTB is used, which refers to pins 8 to 13. So, PORTB can be considered an 6-bit number where each bit refers to the state of a pin.

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| value | 32 | 16 | 8  |  4 | 2 | 1 |

So, say for instance we wanted to turn pin 13 on. Well, then we can simply say `PORTB = 32`, which in binary is equivalent to `100000`. This is illustrated in the table below

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| value | 32 | 16 | 8  |  4 | 2 | 1 |
| 32    | 1  | 0  | 0  | 0  | 0 | 0 |

We can then use [bitwise operators](https://www.arduino.cc/reference/en/#structure) to easily flip all the bits on and off. Firstly we use the or operator which, when used with another number, will turn on any pins that are not already on.

{% highlight c++ %}
0  0  1  1    bits1
0  1  0  1    bits2
----------
0  1  1  1    (bits1 | bits2)
{% endhighlight %}

`PORTB |= 0x20` is equivalent to `PORTB = PORTB | 0x20`. This will turn on pin 13, if it is not already on, without altering the state of other pins.
Lets say pins 8 and 11 were already on, `PORTB |= 0x20` would result in the following:

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| PORTB | 0  | 0  | 1  | 0  | 0 | 1 |
| 0x20  | 1  | 0  | 0  | 0  | 0 | 0 |
| PORTB \| 0x20  | 1  | 0  | 1  | 0  | 0 | 1 |

In this case, to turn off the pins, two different operators are used, the `&` (AND) operator and the `~` (NOT) operator. The `&` only returns 1 if both number have a 1 in that bit.

The `~` operator returns the opposite bits to the number given
{% highlight c++ %}
1  0  1  0     bits
0  1  0  1    ~bits
{% endhighlight %}

So, `PORTB &= ~0x20` would result in the following, again assuming that pins 8, 11 and 13 are already on:

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| PORTB | 1  | 0  | 1  | 0  | 0 | 1 |
| ~0x20  | 0  | 1  | 1  | 1  | 1 | 1 |
| PORTB & ~0x20  | 0 | 0  | 1  | 0  | 0 | 1 |

#### Line 55 - 61: 1 << and \_BV()

We can use a number with bitwise operators or we can shift bits to the left or right. In this instance we take one and shit it the desired number of bits to the left. Pin 13 is 5 spaces to the left so if we shift that amount to left:

{% highlight c++ %}
1      = 00001
1 << 5 = 10000 = 32
{% endhighlight %}

This just another way to go about making a bit vector equal to 32. Perhaps a clearer version of this process is using the `_BV()` macro function. `_BV` is a common way of [manipulating the address registers](https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM) associated with certain modes or behaviour of the Arduino. The bit position of pin 13 is defined by its [ATMega assignment](https://components101.com/microcontrollers/atmega328p-pinout-features-datasheet) `PB5` which is equivalent to the number 5. So, writing `_BV(PB5)` will return a bit vector that relates to pin 13 for PORTB, `_BV(PB5) is 10000`

#### Line 65 - 67: PORTB ^=
Rather than switching between the `&` and `|` operators, this example uses the bitwise XOR. This returns 0 if both compared bits match
{% highlight c++ %}
0  0  1  1    operand1
0  1  0  1    operand2
----------
0  1  1  0    (operand1 ^ operand2)
{% endhighlight %}

`PORTB ^= 0x20` will flip pin 13 to it's opposite state. When the pin is not on, XOR does not match

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| PORTB | 0  | 0  | 1  | 0  | 0 | 1 |
| 0x20  | 1  | 0  | 0  | 0  | 0 | 0 |
| PORTB ^ 0x20  | 1 | 0  | 1  | 0  | 0 | 1 |

When the pin is on, both bits will match and the bit will be turned off.

| Pin   | 13 | 12 | 11 | 10 | 9 | 8 |
|:-----:| :-:| :-:| :-:| :-:|:-:|:-:|
| PORTB | 1  | 0  | 1  | 0  | 0 | 1 |
| 0x20  | 1  | 0  | 0  | 0  | 0 | 0 |
| PORTB ^ 0x20  | 0 | 0  | 1  | 0  | 0 | 1 |


#### Timer Interrupts
Lines 10 - 18, 80 - 83 and 63 - 65 are involved in using the [Arduino timers](https://playground.arduino.cc/code/timer1). The first step is in the setup, lines 10 -18:

  {% highlight c++ %}
  cli();        //Disable global interrupts
  TCCR1A = 0;   //Reset Timer 1 Counter Control Register A
  TCCR1B = 0;   //Reset Timer 1 Counter Control Register B
  TCCR1B |= _BV(WGM12) | _BV(CS12) | _BV(CS10); // WGM12 turn on CTC mode (clear timer on compare match) | CS10 and CS12 bits for 1024 prescaler
  uint8_t blinksPerSecond = 1;
  OCR1A = (16e6 / 1024) / blinksPerSecond;
  TIMSK1 = 0; // disable timer interrupt
  sei(); //enable interrupts
  {% endhighlight %}
[comment]: <> (_)

All that happens here is the Timer1 is set to overflow every second. The `uint8_t blinksPerSecond` variable is essentially a frequency in Hz of how often the timer will execute it's function.

The timer function is defined in line 75 - 78

{% highlight c++ %}
ISR(TIMER1_COMPA_vect)
{
  digitalWrite(LED_BUILTIN, !digitalRead(LED_BUILTIN));
}
{% endhighlight %}

All this does is switch the pin to be the opposite state at the pre-defined frequency.

`TIMSK1 |= (1 << OCIE1A);` or `TIMSK1 |= _BV(OCIE1A);` enables the timer (line 70) and `TIMSK1 = 0;` disables it again (line 72). The benefit of this method is that it will consistently execute while other functions can be written into the main `loop()`. Though, it is an overly convoluted way of performing something fairly trivial.
