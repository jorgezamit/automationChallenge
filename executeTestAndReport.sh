echo Step 1/3 - Runing tests
./node_modules/.bin/wdio;
echo
echo Test finished
echo -----------------------------
echo
echo Step 2/3 - Generating reports
allure generate --clean;
echo
echo -----------------------------
echo
echo Step 3/3 - Open reports
allure open;
echo 
echo All done
