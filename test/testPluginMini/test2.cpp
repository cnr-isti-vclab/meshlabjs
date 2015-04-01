#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "common.h"

using namespace std;
using namespace emscripten;


class Test2 {

public:  
Test2(){}
    
  void use(uintptr_t ptr){
    printf("Use");
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test2) {
  class_<Test2>("Test2")
    .constructor<>()
    .function("use", &Test2::use)
    ;
}