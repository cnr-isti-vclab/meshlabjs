# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 


emcc --bind test1.cpp test2.cpp -O3 -o test1.js
# emcc --bind test2.cpp -o test2.js