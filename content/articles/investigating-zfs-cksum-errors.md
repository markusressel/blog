---
dummy: true
createdAt: 2021-04-20
updatedAt: 2021-04-20
title: Investigating ZFS cksum errors
# TODO:
img: https://images.unsplash.com/photo-1577605260126-fe10d76fe088?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80
alt: Investigating ZFS cksum errors
authors:
  - Markus Ressel
tags:
  - zfs
---

My home NAS was giving READ and CKSUM errors on two distinct HDDs in different mirrors of the same pool. Let's investigate.

<!--more-->

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

A small amount of errors can happen due to a variety of reasons, like bad cabling, software hickups, etc. [CITATION_NEEDED] These are in no way problematic for ZFS (or other file systems for that matter). While the numbers I saw were not alarming, they were enough for me to investigate further if there was more going on behind the scenes. So I initiated a `zpool scrub vol1` to let ZFS check every single block and verify it.

Looking at `zpool status -v` after the finished scrub revealed an alarming amount of CKSUM errors:

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

While some amount of errors in each category is probably nothing to worry about, having millions of checksum blocks corrupted really isn't the outcome I was hoping for. Reconstructing the original cause of this is still not possible. Sure, both disks aren't exactly factory new, but since their age is years apart, they have different capacities, and they weren't even used in the same system for the same amount of time, I found it very unlikely that both disks failed on a hardware level. While researching on the internet about this I found suggestions about replacing the cabling and/or possibly even the drive controller. Since I wasn't able to do either without waiting for a package delivery, I wanted to let ZFS handle issues that it found using the available parity data and investigate wether this was a one-off thing or possibly an ongoing, slow corruption mess.

So I went ahead and did what `zpool status` suggested and cleared the error counts using `zpool clear vol1`. This took a couple seconds and automatically started a resilver of the pool right after it finished, which also took a considerable amount of time (about 12 hours) and greeted me with the following:

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
Of course running a resilver doesn't mean that there were no errors during the process. To verify that the errors were gone for real I ran another `zpool scrub vol1`... which resulted in yet another (heartrate increasing) error message from `zed`:

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
