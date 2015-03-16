# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 

#my local path
em++ --bind --closure 0 -I /Users/maurizio/Desktop/Universita/F3D/vcg-code/vcglib/ refine.cpp -s EXPORTED_FUNCTIONS="['_allocator','_refine']" -o refine.js
#em++ -I ../../../vcglib/ refine.cpp -s EXPORTED_FUNCTIONS="['_allocator','_refine']" -o refine.js