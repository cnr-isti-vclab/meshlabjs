# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 
em++ -I ../../../../../../vcglib/ loader.cpp -s EXPORTED_FUNCTIONS="['_refine']" -o loader.js
