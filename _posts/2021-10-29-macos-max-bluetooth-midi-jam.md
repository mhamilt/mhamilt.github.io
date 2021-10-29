---
layout: post
title: "macOS / Max MSP Bluetooth MIDI Jam"
date: 2021-10-29 10:00:00 +0000
categories: blog
tags: macos max ble midi
---

<p><span class="firstcharacter">O</span>ne criminally under documented feature of macOS is the ability to advertise as Bluetooth MIDI device. When combined with some like [Max MSP](https://cycling74.com) this is a great way to jam with your friend's patches without trailing wires. It also opens up some fun possibilities for installations and sound art.

Presented here are the steps required to get you and your collaborator setup. In this instance I am using a 2011 Mac Mini on High Sierra `BigglesServer` and a 2012 Macbook Pro Retina 15" `ProfTiggles` on Mojave. The interface changes a little for both devices, but I will call out the differences at each step.

***

## Step-by-Step

1. [Open Audio MIDI Setup](https://support.apple.com/guide/audio-midi-setup/set-up-midi-devices-ams875bae1e0/mac)
2. [Choose the MIDI Studio Window <kbd>⌘</kbd>  <kbd>2</kbd>](https://support.apple.com/en-gb/guide/audio-midi-setup/ams1001/3.5/mac/11.0)
3. Click Bluetooth Configuration: This step will change on a number of factors so either
  - Click the Bluetooth icon in the menu bar
  ![Audio MIDI Setup Bluetooth icon in the menu bar]({{ "/images/macos-ble-midi/bluetooth-icon-menu-bar.png" | absolute_url }})
  - Click the disclosure arrows and select `Configure Devices` -> `Open Bluetooth Configuration`
  ![Audio MIDI Setup Menu arrows]({{ "/images/macos-ble-midi/menu-bar-arrows.png" | absolute_url }})
  - Blick the Bluetooth icon w/ cog inthe main window pane
  ![Audio MIDI Setup Bluetooth icon in window]({{ "/images/macos-ble-midi/bluetooth-cog.png" | absolute_url }})
4. Click Advertise
![Audio MIDI Setup Bluetooth config advertise]({{ "/images/macos-ble-midi/advertise.png" | absolute_url }})
5. Click connect: You may be asked for permission and need to repeat te connection.
![Audio MIDI Setup Bluetooth config connect]({{ "/images/macos-ble-midi/connect.png" | absolute_url }})
6. In Max select the MIDI device input
![Max MIDI Input]({{ "/images/macos-ble-midi/max-midi-in.png" | absolute_url }})
7. In Max select the MIDI device output
![Max MIDI Output]({{ "/images/macos-ble-midi/max-midi-out.png" | absolute_url }})
