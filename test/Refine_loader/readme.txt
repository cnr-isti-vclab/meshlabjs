Per compilare:

em++ -o refine.js refine.cpp -I ../../../../../vcglib/ -s EXPORTED_FUNCTIONS="['_allocator', '_refine']"

Ovviamente il path alla vcglib lo dovete sistemare a seconda di dove la avete installata rispetto alla dir corrente. 

Notare il parametro:

-s EXPORTED_FUNCTIONS="['_allocator', '_refine']"

per dire esplicitamente quali funzioni esportare.
L'html e' stato fatto a mano per avere un input field per i file e per tenere la struttura complessiva minimale.


emscripten_wget necessario per l'esecuzione di loader.cpp, poiche' altrimenti 'importer_off' restituisce errore nel caricamento di una mesh. Problema risolvibile con la funzione 'allocator' (vedi Refine.cpp in Refine).

-s ASYNCIFY=1
flag necessario per 'emscripten_wget'

