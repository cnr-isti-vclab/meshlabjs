DEPENDPATH += . ../../vcglib
INCLUDEPATH += . ../../vcglib ../../vcglib/eigenlib
CONFIG += console stl c++11

#CONFIG += POISSON 
#CONFIG += MUPARSER

TEMPLATE = app
# Mac specific Config required to avoid to make application bundles
CONFIG -= app_bundle

MUPARSERDIR = ./external/muparser-2.2.5
MUPARSERSRC = $$MUPARSERDIR/src/muParser.cpp $$MUPARSERDIR/src/muParserBase.cpp \
              $$MUPARSERDIR/src/muParserBytecode.cpp $$MUPARSERDIR/src/muParserCallback.cpp \
              $$MUPARSERDIR/src/muParserDLL.cpp      $$MUPARSERDIR/src/muParserError.cpp \
              $$MUPARSERDIR/src/muParserInt.cpp      $$MUPARSERDIR/src/muParserTest.cpp $$MUPARSERDIR/src/muParserTokenReader.cpp

POISSONDIR = ./external/PoissonRecon/Src
POISSONSRC = $$POISSONDIR/PlyFile.cpp $$POISSONDIR/Factor.cpp $$POISSONDIR/Geometry.cpp $$POISSONDIR/MarchingCubes.cpp

INCLUDEPATH += $$MUPARSERDIR/include $$POISSONDI

#TARGET = filtertest
SOURCES += FilterTest.cpp \
  CppMesh.cpp \ 
  Decorator.cpp \
  Color.cpp \
  Create.cpp \
  Measure.cpp \
  Meshing.cpp \
  Refine.cpp \
  Sampling.cpp \
  Selection.cpp \
  Transform.cpp \
  Quality.cpp \
  ../../vcglib/wrap/ply/plylib.cpp \
  external/miniz/miniz.c

if(POISSON) {
SOURCES += $$POISSONSRC Poisson.cpp 
DEFINES += _POISSON_TEST_
message("Including Poisson")
} else {
message("Not Including Poisson")
}
if(MUPARSER) {
SOURCES += $$MUPARSERSRC FuncParser.cpp 
DEFINES += _MUPARSER_TEST_
message("Including MUPARSER")
} else {
message("Not Including MUPARSER")
}


HEADERS += mesh_def.h \
    FilterTest.h \
    coarseisotropicremeshing.h \
    ColorHistogram.h


