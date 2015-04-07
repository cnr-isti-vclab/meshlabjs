#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "common.h"

using namespace std;
using namespace emscripten;


class Test2 {

public:  

Test2(){}
  int generate2(){
    printf("generate");
      return 2;
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test2) {
  class_<Test2>("Test2")
    .constructor<>()
    .function("generate2", &Test2::generate2)
    ;
}