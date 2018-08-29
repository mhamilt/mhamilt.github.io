---
layout: post
title:  "Connecting Raspberry Pi to Eduroam"
date:   2018-08-29 10:32:00 +0100
categories: raspberry pi, eduroam
---
***
<br />

<p><span class="firstcharacter">C</span>onnecting to eduroam with in Raspbian took a lot more effort than I initially expected. Here are all the changes required, bundled into a script for those, like me, who have shaky hands and a poor track record with typos. For the University of Edinburgh I have found the following to work consistently. Of course, your mileage may vary.</p>
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

***
### Configure Eduroam Script

{% highlight bash %}
#--------------------------------------------------------------
# Edit These
USERNAME='username@university_domain'
PASSWORD='your_password'
#--------------------------------------------------------------
sudo printf '
allow-hotplug wlan0
iface wlan0 inet manual
wpa-conf /etc/wpa_supplicant/wpa_supplicant.conf
' >> /etc/network/interfaces

sudo printf '
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
country=GB

network={
   ssid="eduroam"
   proto=RSN
   key_mgmt=WPA-EAP
   eap=PEAP
   identity="%s"
   password="%s"
   phase1="peaplabel=0"
   phase2="auth=MSCHAPV2"
}
' $USERNAME $PASSWORD > /etc/wpa_supplicant/wpa_supplicant.conf
#--------------------------------------------------------------
#EOF

{% endhighlight %}

***
<br />
### References

* [Raspberry Pi: Mit dem eduroam-WLAN verbinden](http://blog.emmatosch.com/2016/03/09/using-custom-javascript-in-jekyll-blogs.html)
