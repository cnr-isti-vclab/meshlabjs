#issue: cannot compile many sources with an header..... 
#with -O3 8.6 MB -> 1.1 MB
emcc --bind -s DEMANGLE_SUPPORT=1 -I ../../../vcglib/ MeshLabJs.cpp Opener.cpp Refine.cpp ../../../vcglib/wrap/ply/plylib.cpp  -s TOTAL_MEMORY=268435456 -O3 -o MeshlabJs.js


#with split
# EMCC_FAST_COMPILER=0 emcc --bind --split 1024000 -s DEMANGLE_SUPPORT=1 -I ../../../vcglib/ open.cpp ../../../vcglib/wrap/ply/plylib.cpp -s TOTAL_MEMORY=268435456  -o open.js

