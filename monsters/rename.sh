#!/bin/sh
find . -type f | while read file
do
    renamed=`echo $file|sed -e "s/([0-9][0-9])-D0//g"|sed -e "s/BMP.//g"|sed -e "s/F0//g"|sed -e "s/-0/-/g"`
    mv $file $renamed
done