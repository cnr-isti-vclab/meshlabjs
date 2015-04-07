#include <emscripten.h>
#include <emscripten/bind.h>

using namespace emscripten;

class Common
{
    public:
    int pippo;
    std::string str;
    Common(){}
    void init() { str="pippo";}
};

// EMSCRIPTEN_BINDINGS(Common) {
//   class_<Common>("Common")
//     .constructor<>()
//     .function("init", &Common::init)
//     ;
// }