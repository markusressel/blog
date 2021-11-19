---
createdAt: 2021-11-19
updatedAt: 2021-11-19
title: Fixing bass heavy sound on the Nvidia Shield TV Pro
img: https://images.unsplash.com/photo-1524656856248-1ac698f88bb0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8
alt: Fixing bass heavy sound on the Nvidia Shield TV Pro
authors:
  - Markus Ressel
tags:
  - audio
  - sound
  - nvidia
---

After setting up a new AV receiver in my home entertainment system, I noticed a severe degradation in sound quality,
caused by the stereo upmix feature of the Nvidia Shield TV.

<!--more-->

## What happened

After owning my previous AV receiver of my home entertainment system for over 15 years and other technical reasons, I convinced myself that it was a good time to upgrade to a [Denon AVR-X1600H][1]. After the initial setup and testing sound using the [Nvidia Shield TV Pro][2] (the primary media source), I noticed a severe degradation in sound quality compared to the old system, namely an unacceptable boost of bass frequencies. Playing around with EQ Settings or even the "Volume Compression" features of the receiver only intensified the problem. After hours of trying to find a setup that was at least performing similarly to the previous setup, I was about to return the newly bought receiver, when I found this setting inside of the "Advanced Audio settings" category:

![Nvidia Shield TV Settings Audio Settings](/images/blog/nvidia-shield-tv-pro-surround-upsampling/nvidia_shield_stereo_upmix.webp 'Nvidia Shield TV Settings Audio Settings')

For some reason the **Stereo Upmix** setting was turned on. Turning it off immediately fixed all of the problems I had with the boomy bass and crappy sound quality overall, volume compression was now working as expected... well everything.

I can't quite explain why this hasn't been an issue with my previous receiver though. Maybe its age showed and the "boosted bass" was improving its sound rather than destroying it? I am not sure.
Either way I am quite happy with the setup now and I hope writing this down can help someone else figure this out faster than me.

[1]: https://www.denon.com/de-ch/shop/avreceiver/avrx1600h
[2]: https://www.nvidia.com/en-us/shield/shield-tv-pro/
