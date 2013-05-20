@echo off
java -jar yuicompressor-2.4.7.jar --nomunge --disable-optimizations --type js ../js/all.js -o ../js/all-min.js
pause