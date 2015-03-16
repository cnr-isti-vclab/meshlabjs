# test 
This folder contains minimal code samples for testing the basic mechanisms for **client side only** javascript mesh processing application that is based on emscripten for the core processing part. 

The high level objective is to set up in the most efficient way a framework that allows 
1. loading a mesh from local storage
2. visualising it using either three.js or spidergl or even direct webgl. 
3. applying some mesh processing algorithm on it using the c++ code compiled in asm.js
4. saving back the result

There are a number of pitfalls here and there. 
Each sample aims to to be the smallest example for each tech. 

* `LoadProc` implement the minimal load-process pipeline using the HTML5 file api. Issue:
    * It require ascii file formats. The basic mechanism passing is done using allocation inside ems, and filling this mem with a string loaded from a file using html5 file api. Reading is done inside VCG by parsing the large string.
* `LoadProcSave1` implement a basic load-process-save pipeline using the HTML5 file api. Issue:
 *  the download attribute is not implemented on safari and the model to be saved is simply opened in a different tab
* `LoadProcSave2` implement a basic load-process-save pipeline using a flash based trick. Issue:
	* Require a image button and the non standard, doomed to die, deprecated *flash*.
* `LoadRender1` implement a basic load-render pipeline using three.js. It takes a file from the local file system, parse it using the three.js loaders and render it. 
* `LoadProcRender1` implement a direct pass of the mesh data as kept by the emscripten compiled code to the rendering engine. The file is parsed into a mesh using the vcg parsing code and passed back to three.js
* `LoadProcRender2` alternative approach. The mesh is loaded using three.js parsers and then the mesh data are passed in some compact way to the emscripten that trasform it back into a vcg mesh.


Update test:
* `LoadProc` OK
* `LoadProcSave1` OK
* `LoadProcSave2` OK  

* `LoadRender1` 

	* test PLY presente nella cartella `LoadRender1 (PLY)`: 
	Il loader ply (file PLYloader.js nella cartella js) era presente nella versione 63 della libreria three.js, e oggi, nella versione 70, non esiste più. Io l’ho trovato in un’altra repository (https://github.com/josdirksen/learning-threejs), assieme al file three.js (che ho caricato nella cartella js della nostra repository). Così come con json, non funziona con tutte le mesh, ma solo con alcune: test.ply, che è una mesh di esempio trovata nella repository di cui sopra, viene mostrata, mentre density.ply (che è una mesh che proviene dagli esempi delle sue lezioni) no. Inoltre, il loader ply è incompatibile con le api del FileReader di html5, poiché la funzione fa una get con l’argomento passato al loader, e la get va a cercare il file all’interno del server che ospita la nostra pagina, non trovando niente. 
	
	* test con JSON
	ad oggi Three.js, nella documentazione ufficiale, mette a disposizione diversi loader, fra cui quelli per file json. Seguendo gli esempi della documentazione ho provato a caricare delle mesh in json (una trovata in una repository, l’altra creata attraverso meshlab) ma ritorna errore. Non carica nessun file. 

	*parser presente nella cartella 'LoadRender2': 
	egge i file codificati OFF e COFF (ignorando per ora i colori)
	Problema: centrare e scalare il rendering della mesh automaticamente

* `PassArrayCppToEmScripten` 
	test passaggio vettore da cpp a js. Poichè non sappiamo la lunghezza del vettore a runtime, si ha bisogno di chiamare il metodo getLength che restituisce la lunghezza del vettore. In js il metodo getVector ritorna il puntatore al primo indirizzo di memoria del vettore e, sapendo la lunghezza del vettore ed il tipo contenuto, possiamo iterare per ogni elemento del vettore, richiamandolo attraverso 
				Module.getValue(pointer,'type')
	dove type può essere anche solo '*'
	NBB: nel compilare specificare il flag --bind

* `LoadProcRender1` 

	*test con passaggio di vettore:
	risolto il problema di EMSCRIPTEN_BINDINGS
	test in corso...

