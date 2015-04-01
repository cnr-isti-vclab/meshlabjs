# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 


emcc --bind -s DEMANGLE_SUPPORT=1 test1.cpp -s TOTAL_MEMORY=268435456  -o test1.js
emcc --bind -s DEMANGLE_SUPPORT=1 test2.cpp -s TOTAL_MEMORY=268435456  -o test2.js