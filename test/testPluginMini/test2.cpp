#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "common.h"

using namespace std;
using namespace emscripten;


class Foo2 {

public:  

Foo2(){}
  int foote(){
    printf("generate");
      return 2;
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Foo2) {
  class_<Foo2>("Foo2")
    .constructor<>()
    .function("foote", &Foo2::foote)
    ;
}