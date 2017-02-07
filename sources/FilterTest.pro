DEPENDPATH += . ../../vcglib
INCLUDEPATH += . ../../vcglib muparser-2.2.5/include
INCLUDEPATH += . ../../vcglib ../../vcglib/eigenlib
CONFIG += console stl c++11
TEMPLATE = app
# Mac specific Config required to avoid to make application bundles
CONFIG -= app_bundle
MUD = ./muparser-2.2.5/src
MUPARSERSRC = $$MUD/muParser.cpp $$MUD/muParserBase.cpp \
              $$MUD/muParserBytecode.cpp $$MUD/muParserCallback.cpp \
              $$MUD/muParserDLL.cpp $$MUD/muParserError.cpp $$MUD/muParserInt.cpp \
              $$MUD/muParserTest.cpp $$MUD/muParserTokenReader.cpp

#TARGET = filtertest
SOURCES += FilterTest.cpp \
  CppMesh.cpp \ 
  Decorator.cpp \
  Color.cpp \
  Create.cpp \
  FuncParser.cpp \
  Measure.cpp \
  Meshing.cpp \
  Refine.cpp \
  Sampling.cpp \
  Selection.cpp \
  Transform.cpp \
  $$MUPARSERSRC

HEADERS += mesh_def.h \
    FilterTest.h \
    CoarseIsotropicRemeshing.h
