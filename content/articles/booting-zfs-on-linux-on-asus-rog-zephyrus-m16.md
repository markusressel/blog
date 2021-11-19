---
createdAt: 2021-11-19
updatedAt: 2021-11-19
title: Booting ZFS on Linux on Asus ROG Zephyrus M16 (2021)
img: https://images.unsplash.com/photo-1615293889204-6db03c596147?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8
alt: Booting ZFS on Linux on Asus ROG Zephyrus M16 (2021)
authors:
  - Markus Ressel
tags:
  - zfs
  - linux
---

Booting Linux with ZFS on Root on my Asus ROG Zephyrus M16 requires a kernel module in initramfs.

<!--more-->

## What happened

I recently bought an [Asus ROG Zephyrus M16][1], which (among other reasons) I specifically bought because of its two fullsize NVMe m.2 slots, which allows me to run a ZFS on Root in a _mirror_ configuration on it.
Using a script for this exact configuration based on [this guide][2], which I had created previously, the installation itself was quite easy and straight forward.
However, despite the script doing what it was supposed to do without any alarming error messages, ZFS was not able to import the root pool after selecting the boot option in GRUB, giving me the following error:

```
no pools available to import
```

Although I needed three days to find the solution, it is quite simple:

Add the `vmd` kernel module to the `MODULES` variable of your initramfs (`/etc/mkinitcpio.conf`):

```
MODULES=(vmd zfs)
HOOKS=(base udev autodetect modconf block keyboard zfs filesystems)
```

## Why

I didn't do much research after the fact, but from what I can tell the issues is the UEFI configuration of this and other laptops from Asus and also Dell, maybe more.
In most UEFIs you can configure the _mode_ of your drives, f.ex. **AHCI** or **RAID**. This setting is not available on my laptop. The [Intel Volume Management Device (vmd) Driver][3]
adds some magic to the kernel, which allows it to speak to the drive.

[1]: https://rog.asus.com/laptops/rog-zephyrus/2021-rog-zephyrus-m16-series/
[2]: https://openzfs.github.io/openzfs-docs/Getting%20Started/Arch%20Linux/Arch%20Linux%20Root%20on%20ZFS.html
[3]: https://cateee.net/lkddb/web-lkddb/VMD.html
