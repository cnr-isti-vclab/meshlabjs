# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 
#
# vcglib repository should be checked out at the same level of the meshlabjs repository


em++ -I ../../../vcglib/ refine.cpp -s EXPORTED_FUNCTIONS="['_allocator','_LoadAndRefine']" -o refine.js