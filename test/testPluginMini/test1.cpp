#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
//#include "common.h"

using namespace std;
using namespace emscripten;


class Test1 {

public:  
    int ppp;
Test1(){}
  int generate(){
    printf("generate");
      return 0;
  }
  
};

//Binding code
EMSCRIPTEN_BINDINGS(Test1) {
  class_<Test1>("Test1")
    .constructor<>()
    .function("generate", &Test1::generate)
    ;
}