---
layout: post
title:  "Connecting a Raspberry Pi to Eduroam"
date:   2018-08-29 10:32:00 +0100
categories: blog
tags: raspberry-pi
---
<p><span class="firstcharacter">C</span>onnecting to eduroam within Raspbian took a lot more effort than I initially expected. Here are all the changes required, bundled into a script for those, like me, who have shaky hands and a poor track record with typos. For the University of Edinburgh I have found the following to work consistently. Of course, your mileage may vary.</p>

***

### Update

A previous version of this post suggested editing the `/etc/networks/interfaces` file, but [this appears to be deprecated from Raspbian Jessie](https://raspberrypi.stackexchange.com/a/41187) onwards. Instead, you should be using DHCPCD configured at `/etc/dhcpcd.conf`

***

### Configure Eduroam

To configure a Raspberry pi to use eduroam, simply type the following into `/etc/wpa_supplicant/wpa_supplicant.conf`

{% highlight bash %}
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
ap_scan=1
update_config=1
country=GB

network={
   ssid="eduroam"
   proto=RSN
   key_mgmt=WPA-EAP
   eap=PEAP
   identity="UUN@DOMAIN"
   password="PASSWORD"
   phase1="peaplabel=0"
   phase2="auth=MSCHAPV2"
}
{% endhighlight %}

- `UUN` is your username for eduroam or your institute
- `DOMAIN` is the domain of your institute e.g. `ed.ac.uk`
- `PASSWORD` is the password used to sign-in to eduroam.

After that restart dhcpcd

{% highlight bash %}
sudo systemctl restart dhcpcd
{% endhighlight %}

If the wifi doesn't connect, then there are likely one of two reasons.

1. A typo in `UUN`, `DOMAIN` or `PASSWORD`
2. Another service or configuration interrupting.

In the second case, set all of the network settings back to default. If you have been doing a lot of editing and can't get anything to work, it may just be easier to re-install Raspbian.

### Configure Eduroam Script

To make life easy, you can copy and paste the following script:

{% highlight bash %}
#!/bin/bash
#----------------------------------------------------------
read -p 'Username: (.e.g. username@university_domain)' USERNAME
read -sp 'Password: ' PASSWORD
#----------------------------------------------------------
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
sudo systemctl restart dhcpcd
#----------------------------------------------------------
#EOF

{% endhighlight %}

If you connect your Raspberry Pi to your phone, you can also curl this script straight from GitHub with:

{% highlight bash %}
bash <(curl -s https://raw.githubusercontent.com/mhamilt/shell-scripts/master/RaspberryPi/configure_eduroam.sh)
{% endhighlight %}

**Note**

The script will overwrite the file: `/etc/wpa_supplicant/wpa_supplicant.conf`. Make a backup is necessary.

***


Thanks to elektronik-kompendium.de whose article was the one that finally explained how to do this. It is linked below, though you may need to polish up your German


***
<br />
### References

* [Raspberry Pi: Mit dem eduroam-WLAN verbinden](https://www.elektronik-kompendium.de/sites/raspberry-pi/2205191.htm)
