#include <stdlib.h>
#include <vector>
#include <emscripten.h>
// #include <emscripten/bind.h>

using namespace std;
// using namespace emscripten;

extern "C" {
struct vert {
 int x;
 int y;
};

  int getLength(){ return 6; }

  vert* getVector() {
    vert* v = new vert[3];
    v[0].x=2;
    v[0].y=22;
    v[1].x=4;
    v[1].y=44;
    v[2].x=6;
    v[2].y=66;
    return v;
  }
}

 


