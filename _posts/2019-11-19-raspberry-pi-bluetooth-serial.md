---
layout: post
title:  "Rapsberry Pi Serial Bluetooth"
date:   2019-11-19 10:00:00 +0100
categories: blog
tags: raspberry-pi bluetooth
---

<span class="firstcharacter">I</span> like Serial Communications, TTL UART, whatever you like to call it. I like the simplicity of using simple serial communication to send data to environments like MaxMSP and Processing. For the life of me I could not find a setup guide for starting a Serial Port Profile from the Raspberry Pi that also covered using Max or Processing. So, look no further, here is a quick setup guide and associated script and troubleshooting to help you get going.

## Setup

### Setup script

Run the script below:

```bash
# -------------------------------------------------------------------------
# Setup Bluetooth SPP
# -------------------------------------------------------------------------
sudo apt-get update
sudo apt-get install -y \
                    sed \
                  bluez \
           python-bluez
# -------------------------------------------------------------------------
sudo rfkill unblock all
# -------------------------------------------------------------------------
# 2. Enable SPP on Raspberry Pi
read -p 'Bluetooth Name: (one word, no special characters): ' bluetooth_id
sudo sh -c "printf 'PRETTY_HOSTNAME=%s' $bluetooth_id >> /etc/machine-info"
sudo sed -i 's/^ExecStart=.*/& -C/' /etc/systemd/system/dbus-org.bluez.service
sudo sed -i "/^ExecStart=.*/aExecStartPost=/usr/bin/sdptool add SP" /etc/systemd/system/dbus-org.bluez.service
sudo sed -i: 's|^Exec.*toothd$| \
ExecStart=/usr/lib/bluetooth/bluetoothd -C \
ExecStartPost=/usr/bin/sdptool add SP \
ExecStartPost=/bin/hciconfig hci0 piscan \
|g' /lib/systemd/system/bluetooth.service
sudo systemctl daemon-reload # Reload the configuration file.
sudo systemctl restart bluetooth.service # Restart the service.
sudo systemctl daemon-reload # Reload the configuration file.
sudo systemctl restart bluetooth.service # Restart the service.
# -------------------------------------------------------------------------
```

**OR**

Simply curl the script from here

{% highlight bash %}
bash <(curl -s https://raw.githubusercontent.com/mhamilt/shell-scripts/master/RaspberryPi/serial-bluetooth.sh)
{% endhighlight %}

### Pairing

Start a bluetooth REPL

```bash
bluetoothctl
```

and then enter

```bash
discoverable on
```

Pair your device with the Raspberry Pi. The pi may ask for permission so it is useful to VNC access to accept the dialog.

### Begin Serial

Begin listening for an incoming connection

```
sudo rfcomm watch hci0
```

After running `sudo rfcomm watch hci0 ` and your device has connected, using `screen` or maxMSP, Processing & c..., there should now be a new serial port available for communication

`/dev/rfcomm0`

In Max send a `print` message to the [serial object](https://docs.cycling74.com/max8/refpages/serial?q=serial). In Processing, import the [serial library](https://processing.org/reference/libraries/serial/index.html) and simply put `printArray(Serial.list())` in your `void setup()`

Open it up that port and start sending some serial data!


#### Bonus: bluetooth shell

In the terminal of your Raspberry Pi, enter

```bash
sudo rfcomm watch hci0 1 getty rfcomm0 115200 vt100 -a pi
```

Open the terminal on your own machine and enter

```
screen /dev/cu.BLUETOOTH_ID-SerialPort 115200
```
***

## Troubleshooting

### Bluetooth Serial Port not appearing

Restart the bluetooth service

```bash
sudo systemctl restart bluetooth.service # Restart the service.
sudo systemctl daemon-reload # Reload the configuration file.
```

and reconnect to the service

### A Bluetooth serial failure has occurred


if you get the message:

**A Bluetooth serial failure has occurred**<br>
_Failed to open an RFCOMM serial channel.
Check if authentication needs to be enabled in your device._

![](/images/RfcommError.png)

This means the bluetooth service is busy or actually isn't accepting incoming connections. Make sure you are actually listening on the Pi side for bluetooth.

Make sure that the service is listening by running the command

```bash
sudo rfcomm watch hci0
```

**Bluetooth not connected after pairing**

After pairing with the Pi the bluetooth will drop out. This is normal and connection will only be live when there is when the serial port is opened.

![](/images/bluetooth-pair.png)

***

## Python Bluetooth Serial

```python
from bluetooth import *

server_sock=BluetoothSocket( RFCOMM )
server_sock.bind(("",PORT_ANY))
server_sock.listen(1)

port = server_sock.getsockname()[1]

print("Waiting for connection on RFCOMM channel %d" % port)

client_sock, client_info = server_sock.accept()
print("Accepted connection from ", client_info)


try:
    while True:
        data = client_sock.recv(1024)
        if len(data) == 0:
          break
        print("received [%s]" % data)
except IOError:
    pass

print("disconnected")

client_sock.close()
server_sock.close()
print("all done")
```

Send and receive with the `client_sock` object with the [`.send`](https://pybluez.readthedocs.io/en/latest/api/bluetooth_socket.html#bluetooth.BluetoothSocket.send) and [`.recv`](https://pybluez.readthedocs.io/en/latest/api/bluetooth_socket.html#bluetooth.BluetoothSocket.recv) methods.

## References

- [Bluetooth Shell](https://hacks.mozilla.org/2017/02/headless-raspberry-pi-configuration-over-bluetooth/)
- [Pybluez server script](https://github.com/pybluez/pybluez/blob/master/examples/simple/rfcomm-server.py)
- [MIT - An Introduction to Bluetooth Programming by Albert Huang ](https://people.csail.mit.edu/albert/bluez-intro/)
- [Setting Up Bluetooth Serial Port Profile on Raspberry Pi using sdptool](https://scribles.net/setting-up-bluetooth-serial-port-profile-on-raspberry-pi/)
