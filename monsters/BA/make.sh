git co -- .
rm map{0..15}.pmg
for a in {0..15}
do
    echo make shadow $a
    find . -name "$a-*.png" | xargs -I{} java -jar ../../../shadowmaker.jar {} {}
    echo append in row $a
    find . -name "$a-*.png" | sort -t "-" -n -k 2 | xargs -J{} convert +append {} map$a.png
    echo reset $a
    find . -name "$a-*.png" | xargs -J{} git co -- {}
done
convert -append map{0..15}.png map.png
rm map{0..15}.png