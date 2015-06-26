DEPENDPATH += . ../../..
INCLUDEPATH += . ../../vcglib
CONFIG += console stl
TEMPLATE = app
# Mac specific Config required to avoid to make application bundles
CONFIG -= app_bundle

#TARGET = filtertest
SOURCES += Refine.cpp Smooth.cpp FilterTest.cpp Random.cpp Create.cpp Sampling.cpp \
    Meshing.cpp

HEADERS += mesh_def.h
