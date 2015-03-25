# Remember to set up the environment before invoking this build. 
# source emsdk_set_env.sh 

emcc --bind  open.cpp  -s TOTAL_MEMORY=268435456  -o open.js
#-s EXPORTED_FUNCTIONS="['_getFileName','_openMesh','_getVertexNumber','_getVertexVector','_getFaceNumber','_getFaceVector']"