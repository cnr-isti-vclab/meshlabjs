#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include "common.h"

using namespace std;
using namespace emscripten;


class Test1 {

public:  

Test1(){}
  int generate1(){
    printf("generate");
      return 1;
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test1) {
  class_<Test1>("Test1")
    .constructor<>()
    .function("generate1", &Test1::generate1)
    ;
}