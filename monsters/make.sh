find . -name "map*.png" | xargs rm
for a in {0..7}
do
    find . -name "$a-*.png" | sort -t "-" -n -k 2 | xargs -J{} convert +append {} map$a.png
done
find . -name "map[0-9].png" | xargs -J{} convert -append {} map.png
find . -name "map[0-9].png" | xargs rm