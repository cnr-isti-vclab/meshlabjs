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
  ./filter_screened_poisson_ml/filter_screened_poisson.cpp \
   ../../vcglib/wrap/ply/plylib.cpp \
  $$MUPARSERSRC \
    filter_screened_poisson_ml/Src/CmdLineParser.cpp \
    filter_screened_poisson_ml/Src/Factor.cpp \
    filter_screened_poisson_ml/Src/Geometry.cpp \
    filter_screened_poisson_ml/Src/MarchingCubes.cpp \
    filter_screened_poisson_ml/Src/PlyFile.cpp \
    Quality.cpp \
    miniz/miniz.c

HEADERS += mesh_def.h \
    FilterTest.h \
    coarseisotropicremeshing.h \
    filter_screened_poisson_ml/Src/Allocator.h \
    filter_screened_poisson_ml/Src/Array.h \
    filter_screened_poisson_ml/Src/BinaryNode.h \
    filter_screened_poisson_ml/Src/BSplineData.h \
    filter_screened_poisson_ml/Src/CmdLineParser.h \
    filter_screened_poisson_ml/Src/Factor.h \
    filter_screened_poisson_ml/Src/FunctionData.h \
    filter_screened_poisson_ml/Src/Geometry.h \
    filter_screened_poisson_ml/Src/Hash.h \
    filter_screened_poisson_ml/Src/MarchingCubes.h \
    filter_screened_poisson_ml/Src/MAT.h \
    filter_screened_poisson_ml/Src/MemoryUsage.h \
    filter_screened_poisson_ml/Src/MultiGridOctreeData.h \
    filter_screened_poisson_ml/Src/MyTime.h \
    filter_screened_poisson_ml/Src/Octree.h \
    filter_screened_poisson_ml/Src/Ply.h \
    filter_screened_poisson_ml/Src/PlyFile.h \
    filter_screened_poisson_ml/Src/PointStream.h \
    filter_screened_poisson_ml/Src/Polynomial.h \
    filter_screened_poisson_ml/Src/PPolynomial.h \
    filter_screened_poisson_ml/Src/SparseMatrix.h \
    filter_screened_poisson_ml/Src/Vector.h \
    muparser-2.2.5/include/muParser.h \
    muparser-2.2.5/include/muParserBase.h \
    muparser-2.2.5/include/muParserBytecode.h \
    muparser-2.2.5/include/muParserCallback.h \
    muparser-2.2.5/include/muParserDef.h \
    muparser-2.2.5/include/muParserDLL.h \
    muparser-2.2.5/include/muParserError.h \
    muparser-2.2.5/include/muParserFixes.h \
    muparser-2.2.5/include/muParserInt.h \
    muparser-2.2.5/include/muParserStack.h \
    muparser-2.2.5/include/muParserTemplateMagic.h \
    muparser-2.2.5/include/muParserTest.h \
    muparser-2.2.5/include/muParserToken.h \
    muparser-2.2.5/include/muParserTokenReader.h \
    ColorHistogram.h


