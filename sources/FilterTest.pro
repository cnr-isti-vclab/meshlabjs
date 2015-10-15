DEPENDPATH += . ../../..
INCLUDEPATH += . ../../vcglib
CONFIG += console stl c++11
TEMPLATE = app
# Mac specific Config required to avoid to make application bundles
CONFIG -= app_bundle

#TARGET = filtertest
SOURCES += Refine.cpp Smooth.cpp FilterTest.cpp Create.cpp Sampling.cpp \
    Meshing.cpp \
    Selection.cpp

HEADERS += mesh_def.h \
    FilterTest.h
