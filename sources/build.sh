emcc --bind -s DEMANGLE_SUPPORT=1 -I ../../vcglib/ MeshLabJs.cpp CppMesh.cpp Meshing.cpp Sampling.cpp Create.cpp Refine.cpp Smooth.cpp Saver.cpp Random.cpp ../../vcglib/wrap/ply/plylib.cpp  -s TOTAL_MEMORY=536870912 -O3 -o ../js/generated/MeshLabCppCore.js

#with split
# EMCC_FAST_COMPILER=0 emcc --bind --split 1024000 -s DEMANGLE_SUPPORT=1 -I ../../../vcglib/ open.cpp ../../../vcglib/wrap/ply/plylib.cpp -s TOTAL_MEMORY=268435456  -o open.js

