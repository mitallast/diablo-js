# reset to original
git co -- .
# rm tmp files
find . -name "map*.png" | xargs rm
# for each angle
for a in {0..7}
do
# make shadow
    find . -name "$a-*.png" | xargs -I{} java -jar ../../../shadowmaker.jar {} {}
# append all steps
    find . -name "$a-*.png" | sort -t "-" -n -k 2 | xargs -J{} convert +append {} map$a.png
# reset to original
    find . -name "$a-*.png" | xargs -J{} git co -- {}
done
# append all angles
find . -name "map[0-9].png" | xargs -J{} convert -append {} map.png
# rm tmp files
find . -name "map[0-9].png" | xargs rm