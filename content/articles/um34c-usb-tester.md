---
title: Checking out the UM34C USB Tester
description: Description
img: https://images.freeimages.com/images/large-previews/2b6/free-banner-background-1639360.jpg
#alt: my second blog post
authors:
  - Markus Ressel
tags:
  - electronics
  - powerbank
  - um34c
---

The UM34C is an all-in-one power meter for USB devices. It can measure f.ex. power draw, wire resistance and capacity and expose measuring data via a bluetooth connection. In this article I will check out the little device by measuring the capacity of the RealPower PB-30k PD powerbank.

<!--more-->

# Introduction

To be able to more comfortably bridge the gap between less optimally placed power outlets in my home and mobile devices which charge over USB, I recently aquired a powerbank. Since I had planned to use it as a stationary charging point, weight and size wasn't that big of a concern. After a bit of research on [idealo.de](https://idealo.de) I purchased the [RealPower PB-30k PD](https://www.realpower.de/details.php?artnr=306950) due to its very high stated capacity and low price. After about two days of use I was starting to have doubts whether the powerbanks' capacity was even close to the 30.000 mAh claimed by the seller. A bit of research on the web revealed that it seems to be pretty much known and accepted that no powerbank can actually deliver its rated capacity to connected devices before reaching 0% charge. So to figure out the _usable_ capacity of my specific powerbank I needed some kind of easy to use measuring device.

# UM34C USB Tester

Without drifting into an advertisement here, the UM34C (like other variants of it) is a pretty neat little device. With its big, full color display it is very easy to take realtime measurements with it. Its built in bluetooth connectivity also makes it possible to extract the measurement data wirelessly for further, more sophisticated processing and analytics.

Using the device on its own is straight forward: plug it into the power source, attach a load and start measuring things. Setting up the bluetooth connection is similarly easy, but the official documentation only supports an Android application. The app has to be downloaded from outside of the Play Store as an `.apk` file, which isn't the most safe thing to do, so I looked on Github to see if someone already developed a different solution. And since the open source community is freakin awesome, I immediately found what I was looking for:

- [rdserialtool](https://github.com/rfinnie/rdserialtool) - A CLI tool for interfacing with RDTech UM/DPS/RD series devices
- [rd-usb](https://github.com/kolinger/rd-usb) - A Web GUI for RuiDeng/Riden USB testers (UM34C, UM24C, UM25C, TC66C)

# Setting up Bluetooth data logging

## RD-USB

Setting up `RD-USB` was super simple, thanks to their [documentation](https://github.com/kolinger/rd-usb#installation):

```shell
git clone https://github.com/kolinger/rd-usb.git
cd rd-usb
python3 -m venv ./venv
source ./venv/bin/activate
pip3 install -r requirements_linux.txt

python3 web.py
```

## Connecting via Bluetooth

Setting up the bluetooth connection was a little bit more tricky. First I had to get bluetooth up and running on my laptop. Since I use Arch Linux, this was as simple as following the [official documentation](https://wiki.archlinux.org/index.php/Bluetooth#Installation). However, due to [a bug](https://bugzilla.kernel.org/show_bug.cgi?id=210681) in kernel releases `5.10` my bluetooth device wasn't picked up correctly. Thanks to the [btusb-210681-fix](https://github.com/BrandomRobor/btusb-210681-fix) repository, I was able to get it up and running simply by installing the provided package:

```shell
git clone https://github.com/BrandomRobor/btusb-210681-fix.git
cd btusb-210681-fix
makepkg -i
```

After that, connecting to the UM34C was easy by following the instructions within the [README of rdserialtool](https://github.com/rfinnie/rdserialtool):

```shell
bluetoothctl
scan on
# wait for the device to show up and copy the MAC
pair <um34c-mac-address>
1234 # <- this is the pin for connecting
trust <um34c-mac-address>
exit
```

Now that the UM34C is paired with your computer, we need to setup a COM port binding to communicate with it:

```shell
sudo rfcomm bind <PORT> <um34c-mac-address>
```

Note that `rfcomm` (alongside other tools) was deprecated and is not part of the `bluez-utils` package anymore. To be able to use those you need to install the `bluez-utils-compat` instead.

## Reading data

Now that the serial connection is set up, open up the RD-USB web interface in your browser (at `http://127.0.0.1:5000`) and click on the little `setup` text in the middle of the top bar. Hitting `Refresh` should automatically present you with a list of usable serial device paths, including the one we just set up. Click on it to connect and graph data should be accumulating!

# Measuring the RealPower PB-30k PD

To get a first idea of how the setup works, I did some sample measurements for a couple of minutes for both charging and discharging the powerbank. Since everything was working as expected I continued with a more sophisticated test.

To be able to measure the total usable capacity of the powerbank, two measurements were done:

- full charge from 0 - 100 %
- full discharge from 100 - 0 %

## Charging from 0 to 100%

After fully discharging the powerbank to 0% and it refused to power up when pressing its power button, I plugged the UM34C into a QuickCharge 2.0 wall adapter, set up a new session within RD-USB and started charging it to 100%.

![Charging from 0 to 100%]()

## Discharging from 100 to 0%

After that I reversed the process, added a constant load to the powerbank and monitored the system until the powerbank was down to 0%.

20650mah
104.66Wh

![Discharging from 100 to 0%]()

## Moving Cables while charging

# Conclusion

## UM34C

The UM34C is a handy gadget and works pretty much as advertised. While downloading an `.apk` file from some random filehoster isn't the safest thing to do, there are open source alternatives available.

## Powerbanks

Don't expect any powerbank to provide the full capacity it is advertised with. While I certainly don't like this, it seems to be industry wide practice to do this kind of false advertisement. The ratio of usable to advertised capacity differs a lot between powerbank models though, so make sure to checkout in-depth reviews of a powerbank before buying.

## Power Supply

To be able to charge the powerbank as quickly as possible, some form of QuickCharge technology (that uses more than 5V) is helping big time. When using an alternative power supply which also had a rating of 3A but only at 5V, I was not able to get the same wattage while charging. While I can't say anything about the specifics as to why this is, finding an affordable charger that offers QuickCharge isn't that hard these days and can also be used for other devices you probably already own.

## USB Cable Quality

The first thing I discovered was that using a quality USB cable can have a substantial impact on power delivery.

Even small movements of the cable resulted in massive current drops, and while it did recover after a few seconds, this was less pronounced or even absent with thicker, higher quality cables.

TODO: Graph for disturbed current flow
