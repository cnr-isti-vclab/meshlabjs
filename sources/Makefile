###############################################################
## 															###
##				        									###
##						MeshLabJs							###
##				             								###
##															###
###############################################################

COMPILER = emcc

VCGPATH = ../../vcglib/	  

INCLUDES = $(VCGPATH)	

PLYFILE = ../../vcglib/wrap/ply/plylib.cpp

FLAGS = --bind -s DEMANGLE_SUPPORT=1 -s TOTAL_MEMORY=268435456 -O3

OUTPUT = MeshlabJs.js

SOURCES = MeshlabJs.cpp Opener.cpp Refine.cpp Smooth.cpp Saver.cpp $(PLYFILE) 

$(OUTPUT) : $(SOURCES)
	$(COMPILER) $(INCLUDES) $(FLAGS) -o $@

