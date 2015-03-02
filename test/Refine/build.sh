# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh

em++ -I ../../../vcglib/ refine.cpp -s EXPORTED_FUNCTIONS="['_allocator','_refine']" -o refine.js
