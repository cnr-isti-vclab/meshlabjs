# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 


emcc --bind -s MODULARIZE=1 test2.cpp -o test2.js
emcc --bind  -s MODULARIZE=1 test1.cpp -o test1.js