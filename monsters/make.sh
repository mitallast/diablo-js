find . -name "map*.png" | xargs rm
a=0 && convert +append $a* map$a.png
a=1 && convert +append $a* map$a.png
a=2 && convert +append $a* map$a.png
a=3 && convert +append $a* map$a.png
a=4 && convert +append $a* map$a.png
a=5 && convert +append $a* map$a.png
a=6 && convert +append $a* map$a.png
a=7 && convert +append $a* map$a.png
convert -append map*.png map.png
find . -name "map[0-9].png" | xargs rm