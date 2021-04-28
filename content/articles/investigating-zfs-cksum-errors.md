---
dummy: true
createdAt: 2021-04-20
updatedAt: 2021-04-20
title: Investigating inconspicuous ZFS CKSUM Errors
# TODO:
img: https://images.unsplash.com/photo-1484662020986-75935d2ebc66?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80
alt: Investigating inconspicuous ZFS CKSUM errors
authors:
  - Markus Ressel
tags:
  - zfs
---

My home NAS was giving READ and CKSUM errors on two distinct HDDs in different mirrors of the same pool, which turned out to be a much bigger issue than anticipated. Let's investigate.

<!--more-->

## What happened

After using a FreeNAS managed ZFS pool for many years, in January 2021 I switched to an Arch Linux / OpenZFS based system for my personal NAS solution at home. Moving the 4x 4TB disks between "BSD-ZFS" and OpenZFS and importing the pool _just worked_, so a couple months later I went ahead and added two much older 2TB disks as a third mirror to the pool. While this has been working fine so far, a recent scrub revealed some READ and CKSUM errors on two drives in the pool:

```
  pool: vol1
 state: DEGRADED
status: One or more devices are faulted in response to persistent errors.
        Sufficient replicas exist for the pool to continue functioning in a
        degraded state.
action: Replace the faulted device, or use 'zpool clear' to mark the device
        repaired.
  scan: resilvered 72.4G in 00:28:58 with 0 errors on Thu Apr 15 22:07:17 2021
config:

        NAME                                                STATE     READ WRITE CKSUM
        vol1                                                DEGRADED     0     0     0
          mirror-0                                          DEGRADED     0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450        FAULTED     22     0     0  too many errors
            ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
          mirror-1                                          ONLINE       0     0     0
            ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
          mirror-2                                          DEGRADED     0     0     0
            ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  FAULTED     10     0    35  too many errors
            ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

A small amount of errors can happen due to a variety of reasons, like bad cabling, software hickups, etc. and can be unproblematic. And even though [you don't really need ECC memory for ZFS][2], this particular server has 32G of ECC memory in it. While the numbers I saw were not alarming, they were enough for me to investigate further if there was more going on behind the scenes.

## Investigating ZFS errors

First of all I initiated a `zpool scrub vol1` to let ZFS check every single block of all disks and verify it.
Looking at `zpool status -v` after the finished scrub revealed an _alarming_ amount of CKSUM errors:

```
ZFS has finished a scrub:

   eid: 3587
 class: scrub_finish
  host: Frittenbude
  time: 2021-04-20 01:22:37+0200
  pool: vol1
 state: DEGRADED
status: One or more devices are faulted in response to persistent errors.
 Sufficient replicas exist for the pool to continue functioning in a
 degraded state.
action: Replace the faulted device, or use 'zpool clear' to mark the device
 repaired.
  scan: scrub repaired 0B in 08:47:03 with 0 errors on Tue Apr 20 01:22:37 2021
config:

 NAME                                                STATE     READ WRITE CKSUM
 vol1                                                DEGRADED     0     0     0
   mirror-0                                          DEGRADED     0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450        FAULTED     22     0 1.86M  too many errors
     ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
   mirror-1                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
   mirror-2                                          DEGRADED     0     0     0
     ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  FAULTED     10     0 1.27M  too many errors
     ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

As mentioned before, some amount of errors in each category is probably nothing to worry about, but having millions of checksum blocks corrupted really wasn't the outcome I was hoping for. Sure, both disks aren't exactly factory new, but since their age is years apart, they have different capacities, and they weren't even used in the same system for the same amount of time, I found it very unlikely that both disks failed on a hardware level. Still, I had to do _something_ about it.

## Trying to resolve the reported ZFS errors

While researching online about small amounts of errors, I found suggestions about replacing the cabling and/or possibly even the drive controller. Since I wasn't able to do either without waiting for a package delivery, I wanted to give ZFS a shot at handling the errors that it detected using the available parity data and investigate wether this was a one-off thing or possibly an ongoing, slow corruption mess lateron. So I went ahead and did what `zpool status` suggested and cleared the error counts using `zpool clear vol1`. This took a couple seconds and automatically started a resilver of the pool right after, which also took a considerable amount of time (about 12 hours) and greeted me with the following:

```
ZFS has finished a resilver:

   eid: 3932
 class: resilver_finish
  host: Frittenbude
  time: 2021-04-20 13:46:56+0200
  pool: vol1
 state: ONLINE
  scan: resilvered 4.64T in 11:43:38 with 0 errors on Tue Apr 20 13:46:56 2021
config:

 NAME                                                STATE     READ WRITE CKSUM
 vol1                                                ONLINE       0     0     0
   mirror-0                                          ONLINE       0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450        ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
   mirror-1                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
   mirror-2                                          ONLINE       0     0     0
     ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
     ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

Alright, so everything is fine again... or is it? _vsaucemusic_

## Setback

To verify that the errors were gone for real I ran another `zpool scrub vol1`... which resulted in yet another (heartrate increasing) error message from `zed`:

```
The number of checksum errors associated with a ZFS device
exceeded acceptable levels. ZFS has marked the device as
degraded.

 impact: Fault tolerance of the pool may be compromised.
    eid: 4009
  class: statechange
  state: DEGRADED
   host: Frittenbude
   time: 2021-04-20 14:38:52+0200
  vpath: /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450-part2
  vphys: id1,enc@n3061686369656d30/type@0/slot@7/elmdesc@Slot_06/p2
  vguid: 0x0107D2E37F936AEF
   pool: 0x3746073E539CB11B
```

Additionally, the scrub seemed to slow down more and more. Even after almost 20 hours, progress was only at 36.89% with the estimated time remaining growing bigger and bigger:

```
  pool: vol1
 state: DEGRADED
status: One or more devices has experienced an unrecoverable error.  An
        attempt was made to correct the error.  Applications are unaffected.
action: Determine if the device needs to be replaced, and clear the errors
        using 'zpool clear' or replace the device with 'zpool replace'.
   see: https://openzfs.github.io/openzfs-docs/msg/ZFS-8000-9P
  scan: scrub in progress since Tue Apr 20 13:49:30 2021
        3.20T scanned at 46.9M/s, 2.76T issued at 40.4M/s, 7.47T total
        3.27G repaired, 36.89% done, 1 days 09:57:14 to go
config:

        NAME                                                STATE     READ WRITE CKSUM
        vol1                                                DEGRADED     0     0     0
          mirror-0                                          DEGRADED     0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450        DEGRADED 12.2K    18 17.4K  too many errors  (repairing)
            ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
          mirror-1                                          ONLINE       0     0     0
            ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
          mirror-2                                          ONLINE       0     0     0
            ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
            ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

Looking at the server monitoring, the disk wasn't moving any meaningful data despite trying to:

![Grafana dashboard showing 24 hours disk activity](/images/blog/investigating-zfs-cksum-errors/zfs_failed_drive_grafana.png 'Grafana dashboard showing 24 hours disk activity')

Although the old _WDC_WD20EARX_ 2TB disk from `mirror-2` was seemingly successfully corrected, the much newer _WDC_WD40EFRX_ was, again, running into problems. Issuing `smartctl -A /dev/sdg` revealed that the disk had an abnormally high `Raw_Read_Error_Rate`, strongly indicating a hardware level fault of the disk:

```
=== START OF READ SMART DATA SECTION ===
SMART Attributes Data Structure revision number: 16
Vendor Specific SMART Attributes with Thresholds:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  1 Raw_Read_Error_Rate     0x002f   001   001   051    Pre-fail  Always   FAILING_NOW 23484
  3 Spin_Up_Time            0x0027   178   164   021    Pre-fail  Always       -       6066
  4 Start_Stop_Count        0x0032   100   100   000    Old_age   Always       -       84
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0
  7 Seek_Error_Rate         0x002e   200   200   000    Old_age   Always       -       0
  9 Power_On_Hours          0x0032   054   054   000    Old_age   Always       -       33897
 10 Spin_Retry_Count        0x0032   100   253   000    Old_age   Always       -       0
 11 Calibration_Retry_Count 0x0032   100   253   000    Old_age   Always       -       0
 12 Power_Cycle_Count       0x0032   100   100   000    Old_age   Always       -       84
192 Power-Off_Retract_Count 0x0032   200   200   000    Old_age   Always       -       56
193 Load_Cycle_Count        0x0032   200   200   000    Old_age   Always       -       298
194 Temperature_Celsius     0x0022   113   098   000    Old_age   Always       -       37
196 Reallocated_Event_Count 0x0032   200   200   000    Old_age   Always       -       0
197 Current_Pending_Sector  0x0032   200   200   000    Old_age   Always       -       0
198 Offline_Uncorrectable   0x0030   100   253   000    Old_age   Offline      -       0
199 UDMA_CRC_Error_Count    0x0032   200   200   000    Old_age   Always       -       0
200 Multi_Zone_Error_Rate   0x0008   100   253   000    Old_age   Offline      -       0
```

There was no reason to continue with the scrub, since it probably wouldn't have finished in a timely matter, and even if it did there would still be errors on the disk itself. So I aborted the scrub with `zpool scrub -s vol1`. As a last effort to revive the disk without replacing it, I shutdown the server completely, allowing all disks to also fully shutdown and reinitialize on the next boot. This didn't help though, in fact importing the pool took minutes instead of seconds, probably due to the failing disk having problems to read data.

## Acceptance

So I went online to buy a new disk. Yeah I know, having a spare handy (or even a hot-spare) would have been much better, but I didn't have the money to do that. Since the failing disk was a Western Digital model, I wanted to replace it with a similar disk from the same manufacturer. This was easier said than done though, since WD changed their marketing due to the whole [CMR/SMR scandal][1]. Reviews on Amazon were all over the place, with users receiving hardware with different model numbers than advertised, even on WD RED Plus product pages. This made me reconsider purchasing Western Digital again, as well as using Amazon as a shop. I ended up purchasing the Seagate Ironwolf 4TB (ST4000VN008) from another shop instead.

After 5 days of painful nervousness (actually it wasn't that bad) the new disk finally arrived since, of course, there was a weekend in between. So I opened the package, shut down the server, removed the old disk and inserted the new one in the same spot and restarted the server. A `zpool status vol1` made me aware of the fact that the disk was now completely unavailable:

```
  pool: vol1
 state: DEGRADED
status: One or more devices is currently being resilvered.  The pool will
        continue to function, possibly in a degraded state.
action: Determine if the device needs to be replaced, and clear the errors
        using 'zpool clear' or replace the device with 'zpool replace'.
   see: https://openzfs.github.io/openzfs-docs/msg/ZFS-8000-9P
config:

        NAME                                                STATE     READ WRITE CKSUM
        vol1                                                DEGRADED     0     0     0
          mirror-0                                          DEGRADED     0     0     0
            74259793414679279                               UNAVAIL      0     0     0  was /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450-part2
            ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
          mirror-1                                          ONLINE       0     0     0
            ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
          mirror-2                                          ONLINE       0     0     0
            ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
            ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

With the new disk installed, I had to figure out its name to be able to tell ZFS to use it as a replacement. To do that I used the following command, which outputs both the short and long device name/path:

```
> lsblk -r|awk 'NR==1{print $0" DEVICE-ID(S)"}NR>1{dev=$1;printf $0"
";system("find /dev/disk/by-id -lname \"*"dev"\" -printf \" %p\"");print "";}'
```

To make sure I had the right disk, I compared the drive name to the ones already inside of the pool and made sure it wasn't already part of another mirror. Then I went ahead and let ZFS use the new disk using `zpool replace vol1 /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450-part2 /dev/disk/by-id/ata-ST4000VN008-2DR166_ZDH9KMBQ`. The command took a couple of seconds and then finished without an error. Looking at `zpool status vol1` once again revealed that ZFS was already resilvering the new disk:

```
  pool: vol1
 state: DEGRADED
status: One or more devices is currently being resilvered.  The pool will
        continue to function, possibly in a degraded state.
action: Wait for the resilver to complete.
  scan: resilver in progress since Mon Apr 26 18:35:04 2021
        3.99T scanned at 10.9G/s, 2.50T issued at 6.86G/s, 7.40T total
        706M resilvered, 33.78% done, 00:12:11 to go
config:

        NAME                                                STATE     READ WRITE CKSUM
        vol1                                                DEGRADED     0     0     0
          mirror-0                                          DEGRADED     0     0     0
            replacing-0                                     DEGRADED     0     0     0
              74259793414679279                             UNAVAIL      0     0     0  was /dev/disk/by-id/ata-WDC_WD40EFRX-68N32N0_WD-WCC7K3RUX450-part2
              ata-ST4000VN008-2DR166_ZDH9KMBQ               ONLINE       0     0     0  (resilvering)
            ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
          mirror-1                                          ONLINE       0     0     0
            ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
            ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
          mirror-2                                          ONLINE       0     0     0
            ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
            ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

After about 9 hours I was greeted with a promising result:

```
ZFS has finished a resilver:

   eid: 994
 class: resilver_finish
  host: Frittenbude
  time: 2021-04-27 03:38:44+0200
  pool: vol1
 state: ONLINE
  scan: resilvered 2.89T in 09:03:40 with 0 errors on Tue Apr 27 03:38:44 2021
config:

 NAME                                                STATE     READ WRITE CKSUM
 vol1                                                ONLINE       0     0     0
   mirror-0                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZDH9KMBQ                 ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
   mirror-1                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
   mirror-2                                          ONLINE       0     0     0
     ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
     ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

The resilver was finished and there were no errors reported. To make sure everything was working as expected, I once again ran a scrub using `zpool scrub vol1`, which took an additional 8 hours - and found no issues:

```
ZFS has finished a scrub:

   eid: 1648
 class: scrub_finish
  host: Frittenbude
  time: 2021-04-28 03:35:08+0200
  pool: vol1
 state: ONLINE
  scan: scrub repaired 0B in 08:09:13 with 0 errors on Wed Apr 28 03:35:08 2021
config:

 NAME                                                STATE     READ WRITE CKSUM
 vol1                                                ONLINE       0     0     0
   mirror-0                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZDH9KMBQ                 ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414J8T-part2           ONLINE       0     0     0
   mirror-1                                          ONLINE       0     0     0
     ata-ST4000VN008-2DR166_ZM414FPG-part2           ONLINE       0     0     0
     ata-WDC_WD40EFRX-68N32N0_WD-WCC7K6TEHZD2-part2  ONLINE       0     0     0
   mirror-2                                          ONLINE       0     0     0
     ata-WDC_WD20EARX-00PASB0_WD-WMAZA5058866-part2  ONLINE       0     0     0
     ata-ST2000DM001-1CH164_Z1E532WY-part2           ONLINE       0     0     0

errors: No known data errors
```

## Verifying the defective disk

To be sure that the old disk was indeed defective, I attached it to my desktop and ran `sudo badblocks -v /dev/sdc > badsectors.txt` for about 24 hours on it. While `badblocks` itself didn't report anything, the fact that it wasn't done after such a long time was telling. Aborting the command also revealed that it wasn't able to achieve even 1% of progress in all that time:

```
Checking blocks 0 to 3907018583
Checking for bad blocks (read-only test):
^C
Interrupted at block 32281728
```

I also checked the SMART values again and the `Raw_Read_Error_Rate` had increased even further:

```
SMART Attributes Data Structure revision number: 16
Vendor Specific SMART Attributes with Thresholds:
ID# ATTRIBUTE_NAME          FLAG     VALUE WORST THRESH TYPE      UPDATED  WHEN_FAILED RAW_VALUE
  1 Raw_Read_Error_Rate     0x002f   001   001   051    Pre-fail  Always   FAILING_NOW 24511
  3 Spin_Up_Time            0x0027   178   162   021    Pre-fail  Always       -       6066
  4 Start_Stop_Count        0x0032   100   100   000    Old_age   Always       -       88
  5 Reallocated_Sector_Ct   0x0033   200   200   140    Pre-fail  Always       -       0
  7 Seek_Error_Rate         0x002e   200   200   000    Old_age   Always       -       0
  9 Power_On_Hours          0x0032   054   054   000    Old_age   Always       -       33915
 10 Spin_Retry_Count        0x0032   100   253   000    Old_age   Always       -       0
 11 Calibration_Retry_Count 0x0032   100   253   000    Old_age   Always       -       0
 12 Power_Cycle_Count       0x0032   100   100   000    Old_age   Always       -       88
192 Power-Off_Retract_Count 0x0032   200   200   000    Old_age   Always       -       60
193 Load_Cycle_Count        0x0032   200   200   000    Old_age   Always       -       298
194 Temperature_Celsius     0x0022   111   098   000    Old_age   Always       -       39
196 Reallocated_Event_Count 0x0032   200   200   000    Old_age   Always       -       0
197 Current_Pending_Sector  0x0032   200   200   000    Old_age   Always       -       3
198 Offline_Uncorrectable   0x0030   100   253   000    Old_age   Offline      -       0
199 UDMA_CRC_Error_Count    0x0032   200   200   000    Old_age   Always       -       0
200 Multi_Zone_Error_Rate   0x0008   100   253   000    Old_age   Offline      -       0
```

## Conclusion

A defective disk is mostly a non-issue when using the right file system in the right configuration. When using a file system like ZFS, hardware errors are fully transparent to the system and everything on it. With ZFS I was able to detect and replace a faulty disk with only a couple of simple commands. However, this transparency comes with the responsibility to regularly check the status of the pool. Before writing this article my self-made Telegram notification bridge for ZED was broken. I was made aware of the errors by pure luck this time. Even though ZFS already indicated corrupted blocks even before the SMART values, I probably wouldn't have noticed it for quite some time. Since I only use mirrors in my pools, a second drive failure in the same mirror would be catastrophic and although I intenionally placed disks of different manufacturers and age in a given mirror, it can still happen. Especially if the system continues to run unsupervised for a long period of time.

The lesson I took from this experience is that my ZED (ZFS Event Daemon) notification system is cruicial to prevent bigger issues, and I need to setup a way to "monitor my monitoring". Currently I am thinking about a prometheus exporter on the host, that is then scraped by the prometheus instance that is already running on the host inside a k3s cluster, but this is a topic for another day.

Thank you for reading.

[1]: https://www.youtube.com/watch?v=aztTf2gI55k
[2]: https://jrs-s.net/2015/02/03/will-zfs-and-non-ecc-ram-kill-your-data/
