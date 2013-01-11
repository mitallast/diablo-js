#!/bin/sh
w=160
h=79
th=1
tw=1
dh=92
dw=161

for row in {0..10}
do
    for column in {0..54}
    do
        oy=`expr $dh \\* $row + $th`
        ox=`expr $dw \\* $column + $tw`
        echo $row $column $ox $oy 
        convert ./map.png -crop $w"x"$h+$ox+$oy $row-$column.png
    done
done