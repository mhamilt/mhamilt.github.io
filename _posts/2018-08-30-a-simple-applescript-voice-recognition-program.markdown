---
layout: post
title:  "a Simple Applescript Voice Recognition Program"
date:   2018-08-30 13:18:00 +0100
categories: blog
tags: applescript
---
***
<br />
<p><span class="firstcharacter">R</span>ecently, I wanted to write an application that would allow for checking off a list handsfree. When messing around creating some tools in applescript I stumbled across the Speech Recognition Server library. It is quite constrained in the number methods it has at its disposal, but it is a fun way to start creating some voice activate commands.</p><br>

***
### Workflow

There is not much setup required, though the first time you try and compile the script you will need to select where the voice recognition server is. Select the  Speech Recognition Server found at `/System/Library/PrivateFrameworks/SpeechRecognitionCore.framework`
![Where is Speech Recognition Server]({{ "/images/SpeechRecognitionChoices.png" | absolute_url }})

The script will fail after this and you will probably need to download the speech recognition feature from Apple which may take a bit of time.
![Speech Recog Download]({{ "/images/macos_voice_download.png" | absolute_url }})

After that you should be able to compile the script again and get started.

The main method of the Speech Recognition Server library is `listen for` followed by a list of strings. The method will output a string from that list when it hears it. You can assign the output to a variable with the `set VARIABLE to` format. You are then just a switch/case statement away from a voice command toolkit.

***
### Speech Recognition Applescript

{% highlight applescript %}
set name_list to {"matthew"}
tell application "SpeechRecognitionServer"
	set your_name to listen for name_list with prompt "say your name"
	say "hello " & your_name
end tell
{% endhighlight %}

***
<br />
### Helpful References

* [AppleScript for Python Programmers](http://aurelio.net/articles/applescript-vs-python.html)
