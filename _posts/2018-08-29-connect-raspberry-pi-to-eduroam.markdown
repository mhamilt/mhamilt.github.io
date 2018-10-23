---
layout: post
title:  "Connecting a Raspberry Pi to Eduroam"
date:   2018-08-29 10:32:00 +0100
categories: blog
tags: raspberry-pi
---
***
<br />
<p><span class="firstcharacter">C</span>onnecting to eduroam within Raspbian took a lot more effort than I initially expected. Here are all the changes required, bundled into a script for those, like me, who have shaky hands and a poor track record with typos. For the University of Edinburgh I have found the following to work consistently. Of course, your mileage may vary.</p><br>

***
### Configure Eduroam Script

{% highlight bash %}
#!/bin/bash
#----------------------------------------------------------
read -p 'Username: (.e.g. username@university_domain)' USERNAME
read -sp 'Password: ' PASSWORD
#----------------------------------------------------------
sudo sh -c "printf '
allow-hotplug wlan0
iface wlan0 inet manual
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
' >> /etc/network/interfaces"

sudo sh -c "printf 'ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
ap_scan=1
update_config=1
country=GB

network={
   ssid=\"eduroam\"
   proto=RSN
   key_mgmt=WPA-EAP
   eap=PEAP
   identity=\"%s\"
   password=\"%s\"
   phase1=\"peaplabel=0\"
   phase2=\"auth=MSCHAPV2\"
}
' $USERNAME $PASSWORD > /etc/wpa_supplicant/wpa_supplicant.conf"
#----------------------------------------------------------
#EOF

{% endhighlight %}

***
### Notes

The script is intended for a fresh install of Raspbian as it will overwrite the file: `/etc/wpa_supplicant/wpa_supplicant.conf`

Remove the lines:

{% highlight bash %}
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=GB
{% endhighlight %}

then, change the overwrite operator `>` to the append operator `>>`

`' $USERNAME $PASSWORD >> /etc/wpa_supplicant/wpa_supplicant.conf`

Thanks to elektronik-kompendium.de whose article was the one that finally explained how to do this. It is linked below, though you may need to polish up your German
<br><br>

***
<br />
### References

* [Raspberry Pi: Mit dem eduroam-WLAN verbinden](https://www.elektronik-kompendium.de/sites/raspberry-pi/2205191.htm)
