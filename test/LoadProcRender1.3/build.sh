# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 

emcc --bind -s DEMANGLE_SUPPORT=1 -I ../../../vcglib/ open.cpp -s EXPORTED_FUNCTIONS="['_allocator','_openMesh','_getVertexNumber','_getVertexVector','_getFaceNumber','_getFaceVector']" -o open.js
