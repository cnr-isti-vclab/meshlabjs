/****************************************************************************
* VCGLib                                                            o o     *
* Visual and Computer Graphics Library                            o     o   *
*                                                                _   O  _   *
* Copyright(C) 2004-2012                                           \/)\/    *
* Visual Computing Lab                                            /\/|      *
* ISTI - Italian National Research Council                           |      *
*                                                                    \      *
* All rights reserved.                                                      *
*                                                                           *
* This program is free software; you can redistribute it and/or modify      *
* it under the terms of the GNU General Public License as published by      *
* the Free Software Foundation; either version 2 of the License, or         *
* (at your option) any later version.                                       *
*                                                                           *
* This program is distributed in the hope that it will be useful,           *
* but WITHOUT ANY WARRANTY; without even the implied warranty of            *
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the             *
* GNU General Public License (http://www.gnu.org/licenses/gpl.txt)          *
* for more details.                                                         *
*                                                                           *
****************************************************************************/
#include <stdlib.h>
#include <emscripten.h>
#include <emscripten/bind.h>
#include <vcg/complex/complex.h>
#include <wrap/io_trimesh/import_off.h>
#include <wrap/io_trimesh/export_off.h>

#include <vcg/complex/algorithms/refine.h>
using namespace vcg;
using namespace std;
using namespace emscripten;


class MyEdge;
class MyFace;
class MyVertex;
struct MyUsedTypes : public vcg::UsedTypes<	vcg::Use<MyVertex>   ::AsVertexType,
                                        vcg::Use<MyEdge>     ::AsEdgeType,
                                        vcg::Use<MyFace>     ::AsFaceType>{};

class MyVertex  : public vcg::Vertex<MyUsedTypes, vcg::vertex::Coord3f, vcg::vertex::Normal3f, vcg::vertex::Color4b, vcg::vertex::Qualityf, vcg::vertex::BitFlags  >{};
class MyFace    : public vcg::Face< MyUsedTypes,  vcg::face::Normal3f, vcg::face::VertexRef, vcg::face::FFAdj,  vcg::face::BitFlags > {};
class MyEdge    : public vcg::Edge<MyUsedTypes>{};
class MyMesh    : public vcg::tri::TriMesh< std::vector<MyVertex>, std::vector<MyFace> , std::vector<MyEdge>  > {};

char *buf=0;
int size;

extern "C"
{
  char * allocator(size_t _size)
  {
     size = _size;
     buf = (char *) malloc(size);
     return buf;
  }
}

  vector<int> refine(int num)
  {
    vector<int> v;
    // v[0]=3;
    // v[1]=2;
    // v[2]=4;
    v.push_back(2);
    v.push_back(4);
    v.push_back(3);
    return v;
  }


  // EMSCRIPTEN_BINDINGS(foo){
  //   register_vector<int>("v");
  //   emscripten::function("refine",&refine);
  // }




