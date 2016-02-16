DEPENDPATH += . ../../vcglib
INCLUDEPATH += . ../../vcglib muparser-2.2.5/include
CONFIG += console stl c++11
TEMPLATE = app
# Mac specific Config required to avoid to make application bundles
CONFIG -= app_bundle

#TARGET = filtertest
SOURCES += FilterTest.cpp \
  Color.cpp \
  Create.cpp \
  FuncParser.cpp \
  Measure.cpp \
  Meshing.cpp \
  Refine.cpp \
  Sampling.cpp \
  Selection.cpp \
  Transform.cpp

HEADERS += mesh_def.h \
    FilterTest.h
