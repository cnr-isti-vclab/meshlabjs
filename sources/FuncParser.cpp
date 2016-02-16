#include "mesh_def.h"
#include <muParser.h>

using namespace vcg;
using namespace std;


void QualityFunction(uintptr_t _baseM, std::string funcStr)
{
  MyMesh &m = *((MyMesh*) _baseM);
  
  printf("Applied Quality Function %s\n",funcStr.c_str());
}


void FuncParserPluginTEST()
{

}


#ifdef __EMSCRIPTEN__
//Binding code
EMSCRIPTEN_BINDINGS(MLFuncParserPlugin) {
    emscripten::function("QualityFunction", &QualityFunction);
}
#endif
