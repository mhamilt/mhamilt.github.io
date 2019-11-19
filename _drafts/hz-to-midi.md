---
layout: post
title:  "hz-to-midi gist"
date:   2019-11-6 10:00:00 +0100
categories: blog
tags: music
---


## Hz to Midi

`12 * log2(hz / 440) + 69`

$$M_{idi} = 12log_{2}(\frac{H_{z}}{440}) + 69$$


## Midi to Hz

`2^((midi - 69)/12) * 440`

$$H_{z} = 2^{\frac{M_{idi} - 69}{12}} (440)$$
