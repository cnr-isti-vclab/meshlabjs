To compile this file

    emcc zlibtest.cpp -s USE_ZLIB=1 -o test.html

The first time you compile emcc should *automatically* retrieve/unpack/build the needed zlib.bc

In my case it wrote something like:

    MacCignoni:zlibtest cignoni$ emcc zlibtest.cpp -s USE_ZLIB=1 -o test.html
    WARNING:root:retrieving port: zlib from https://github.com/emscripten-ports/zlib/archive/version_1.zip
    WARNING:root:unpacking port: zlib
    WARNING:root:generating port: zlib.bc...
    WARNING:root:                           ok

