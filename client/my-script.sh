#If the folder exists, remove it first, then copy the files
if [ -d "./../server/public/" ]; then

    rm -rv ./../server/public/*
    mv -v build/* ./../server/public/

#Else make a new folder and then move the files.
else
    mkdir -p ./../server/public/
    mv -v build/* ./../server/public/
fi