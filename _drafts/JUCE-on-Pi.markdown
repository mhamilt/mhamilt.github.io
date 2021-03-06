---
layout: post
title:  "JUCE on Raspberry Pi"
date:   2018-10-23 10:00:00 +0100
categories: blog
tags: raspberry-pi JUCE
---
***
<br />
<p><span class="firstcharacter">S</span></p>o, I wanted to look into how to have a simple development environment for those interested in hardware signal processing boxes. My first inclination was towards using a Raspberry Pi with its GPIO pins and ability to run an OS. It also has [some](https://uk.farnell.com/wolfson-microelectronics/wolfson-audio-card/audio-card-for-use-with-raspberry/dp/2347264) [audio](https://www.banggood.com/X350-USB-Audio-Board-Support-Microphone-Input-Audio-Input-Output-For-PCRaspberry-Pi-p-1357010.html?gmcCountry=GB&currency=GBP&createTmp=1&utm_source=googleshopping&utm_medium=cpc_elc&utm_content=zouzou&utm_campaign=pla-brand-elc2-uk&gclid=Cj0KCQjwjbveBRDVARIsAKxH7vnEkXMoDeyiy4xF1nRD3yQnfSglluKKdv9X3Ojw76FF2bE6AzYg7UkaAl78EALw_wcB&cur_warehouse=CN) [cards](https://shop.pimoroni.com/products/usb-soundcard) available as [HATs](https://shop.pimoroni.com/products/respeaker-4-mic-array-for-raspberry-pi?variant=49984944138&gclid=Cj0KCQjwjbveBRDVARIsAKxH7vkcvlp2XhQb0Mu6mv8TKSZjZPw0pnKS-JIuODE7A8Fui4a9uS8BSI4aAqISEALw_wcB), external ADC boards, USB hardware or even just an [IC to make your own](https://www.mouser.co.uk/Semiconductors/Audio-ICs/Audio-A-D-Converter-ICs/_/N-4gxil). If the Pi was easy to get up and running for this purpose, it would be a pretty nifty tool for teaching DSP. The ADC side of things is one problem, I wanted to see if I could get a development environment working. The first choice was obviously JUCE. Writing code for DSP chips will likely involve C based code, and working with low level language would serve students well when it comes to trying to find work. So, the first step is to actually get JUCE (and Projucer) to run.

Please find below a condensed version of the past week of my life below, which was spent bashing my head against the table and dabbling with things I do not quite understand. There will obviously be some differences between my experience and your own. Please do get in touch if you have any suggestions or helpful hints for others trying to do the same as I have done here.
---
layout: post
title:  "JUCE on Raspberry Pi"
date:   2018-10-23 10:00:00 +0100
categories: blog
tags: raspberry-pi JUCE
---
***
<br/>
<p><span class="firstcharacter">S</span></p>o, I wanted to look into how to have a simple development environment for those interested in hardware signal processing boxes. My first inclination was towards using a Raspberry Pi with its GPIO pins and ability to run an OS. It also has [some](https://uk.farnell.com/wolfson-microelectronics/wolfson-audio-card/audio-card-for-use-with-raspberry/dp/2347264) [audio](https://www.banggood.com/X350-USB-Audio-Board-Support-Microphone-Input-Audio-Input-Output-For-PCRaspberry-Pi-p-1357010.html?gmcCountry=GB&currency=GBP&createTmp=1&utm_source=googleshopping&utm_medium=cpc_elc&utm_content=zouzou&utm_campaign=pla-brand-elc2-uk&gclid=Cj0KCQjwjbveBRDVARIsAKxH7vnEkXMoDeyiy4xF1nRD3yQnfSglluKKdv9X3Ojw76FF2bE6AzYg7UkaAl78EALw_wcB&cur_warehouse=CN) [cards](https://shop.pimoroni.com/products/usb-soundcard) available as [HATs](https://shop.pimoroni.com/products/respeaker-4-mic-array-for-raspberry-pi?variant=49984944138&gclid=Cj0KCQjwjbveBRDVARIsAKxH7vkcvlp2XhQb0Mu6mv8TKSZjZPw0pnKS-JIuODE7A8Fui4a9uS8BSI4aAqISEALw_wcB), external ADC boards, USB hardware or even just an [IC to make your own](https://www.mouser.co.uk/Semiconductors/Audio-ICs/Audio-A-D-Converter-ICs/_/N-4gxil). If the Pi was easy to get up and running for this purpose, it would be a pretty nifty tool for teaching DSP. The ADC side of things is one problem, I wanted to see if I could get a development environment working. The first choice was obviously JUCE. Writing code for DSP chips will likely involve C based code, and working with low level language would serve students well when it comes to trying to find work. So, the first step is to actually get JUCE (and Projucer) to run.

Please find below a condensed version of the past week of my life below, which was spent bashing my head against the table and dabbling with things I do not quite understand. There will obviously be some differences between my experience and your own. Please do get in touch if you have any suggestions or helpful hints for others trying to do the same as I have done here.


***
<br/>
### Setting up JUCE

First off, download the JUCE framework from the [JUCE website](https://shop.juce.com/get-juce/download) and move it to your home folder. Your Pi will need an internet connection, and you can [connect it to eduroam if necessary](https://mhamilt.github.io/blog/2018/08/29/connect-raspberry-pi-to-eduroam.html). There are a few dependencies that we will need to install before trying to build any projects. It is wise to run `sudo apt-get update` before attempting to install any of the following packages. The JUCE dependencies were stolen from the JUCE forums [\[2\]](#helpful-references). The install command below is exactly the same as `sudo apt-get install clang freeglut3-dev g++ libasound2-dev libcurl4-openssl-dev libfreetype6-dev libjack-jackd2-dev libx11-dev libxcomposite-dev libxcursor-dev libxinerama-dev libxrandr-dev mesa-common-dev webkit2gtk-4.0 ladspa-sdk` the backslash '\\' should hopefully make the list easier to read.

{% highlight bash %}
sudo apt-get install \
               clang \
       freeglut3-dev \
                 g++ \
      libasound2-dev \
libcurl4-openssl-dev \
    libfreetype6-dev \
  libjack-jackd2-dev \
          libx11-dev \
   libxcomposite-dev \
      libxcursor-dev \
     libxinerama-dev \
       libxrandr-dev \
     mesa-common-dev \
      webkit2gtk-4.0 \
          ladspa-sdk
{% endhighlight %}

After that, make the Projucer app:
{% highlight bash %}
 cd ~/JUCE/extras/Projucer/Builds/LinuxMakefile
 make CXX=clang++ -j4
{% endhighlight %}

Alternatively, you could also use `make CXX=clang++ -j4`. You should now be able to start Projucer to create your first JUCE project. Others have had trouble building because of the architecture [\[1\]](#helpful-references) so it may be worth altering should you have a similar issue.

***
<br/>
### Development Workflow
For my pi, the build time for a simple JUCE audio application was approximately 30 minutes, your mileage may vary. Raspbian does not have a C++ environments that I find intuitive. You can try code::blocks `sudo apt-get install codeblocks codeblocks-contrib` or Geany `sudo apt-get install geany`. Personally, the Pi is slow enough just compiling let alone trying to develop on it as well. I find it easier just to code in Xcode and simply push my projects to a git repository that can then be pulled onto the Pi for compilation.

#### My Build Workflow
When developing a project I take the following approach, which is similar to that suggested by echomesh [\[2\]](#helpful-references).

- Create project on Projucer
- Develop project in Xcode
- `git commit` `git push` to project repository
- `git pull` repository on Pi
- `make` build on Pi

Check out the git tutorial by typing `git help tutorial` in terminal for more help with git or check out [the online GitHub guide](https://help.github.com/categories/setup/). You could also just copy files directly to your pi if it is in your network with scp with `scp -r pi@PI_IP_ADDRESS:/path/to/folder /path/to/target/folder`.

***

#### Installing MATE
If you like, you can do all of the following on Ubuntu MATE. Mate will not work on a Raspberry pi 3 B+ at time of writing. Benefits
MATE recommend using `ddrescue` instead of vanilla `dd` [\[4\]](#helpful-references). First off, in terminal `brew install ddrescue` ([make sure you have homebrew installed first](https://brew.sh)). Then simply call `sudo ddrescue -v --force $IMAGE_PATH $DISK_PATH` in terminal, where `$IMAGE_PATH` is the path to the MATE image. If the image is in `.xz` compressed format then simply `brew install xz` and `xz -d file-to-extract.xz`.

***
<br/>
### Helpful References

1. [Compiling Projucer on Raspberry Pi 3 (JUCE Forum)](https://forum.juce.com/t/using-projucer-compiling-for-raspberry-pi-3/17999)
2. [Juce running on Raspbian (JUCE Forum)](https://forum.juce.com/t/juce-running-on-raspbian-raspberry-pi/23321)
3. [Building Juce applications on the Raspberry Pi (echomesh repo)](https://github.com/rec/echomesh/blob/master/documentation/Building%20Juce%20applications%20on%20the%20Raspberry%20Pi.md)
4. [Ubuntu MATE for the Raspberry Pi 2 and Raspberry Pi 3](https://ubuntu-mate.org/raspberry-pi/)
