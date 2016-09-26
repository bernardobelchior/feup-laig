  function MySceneGraph(filename, scene) {
      this.loadedOk = null;

      // Establish bidirectional references between scene and graph
      this.scene = scene;
      scene.graph = this;

      // File reading
      this.reader = new CGFXMLreader();

      /*
       * Read the contents of the xml file, and refer to this class for loading and error handlers.
       * After the file is read, the reader calls onXMLReady on this object.
       * If any error occurs, the reader calls onXMLError on this object, with an error message
       */

      this.reader.open('scenes/' + filename, this);
  }

  /*
   * Callback to be executed after successful reading
   */
  MySceneGraph.prototype.onXMLReady = function() {
      console.log("XML Loading finished.");
      var rootElement = this.reader.xmlDoc.documentElement;

      // Here should go the calls for different functions to parse the various blocks
      //var error = this.parseGlobalsExample(rootElement);

      var error = this.parseTransformations(rootElement);
      if (error != null) {
          this.onXMLError(error);
          return;
      }

      this.loadedOk = true;

      // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
      this.scene.onGraphLoaded();
  };

  MySceneGraph.prototype.parseVec3 = function(tag) {
    var x = this.reader.getFloat(tag, 'x', true);
    var y = this.reader.getFloat(tag, 'y', true);
    var z = this.reader.getFloat(tag, 'z', true);

    return [x, y, z];
  }

  /*
   * Parses transformation element of DSX
   */
  MySceneGraph.prototype.parseTransformations = function(rootElement){

      var transformations = rootElement.getElementsByTagName('transformations');
      if(transformations == null)
          return "transformations element is missing";

      if(transformations.length != 1) 
          return "invalid number of transformations elements"

      if(transformations.children.length < 1)
          return 'there should be one or more "transformation" blocks';

      var idVec = [];

      for(let transf of transformations[0].children){

        this.transfID = this.reader.getString(transf, 'id', true);
        if(this.transfID == null)
            return "missing transformation ID";

        for(id of idVec){
          if (id == this.transfID)
              return 'transformation id "' + this.transfID +'" already in use';
        }

        idVec.push(this.transfID);

        

      }
  }

  /*
   * Example of method that parses elements of one block and stores information in a specific data structure
   */
  MySceneGraph.prototype.parseGlobalsExample = function(rootElement) {

      var elems = rootElement.getElementsByTagName('globals');
      if (elems == null) {
          return "globals element is missing.";
      }

      if (elems.length != 1) {
          return "either zero or more than one 'globals' element found.";
      }

      // various examples of different types of access
      var globals = elems[0];
      this.background = this.reader.getRGBA(globals, 'background');
      this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill", "line", "point"]);
      this.cullface = this.reader.getItem(globals, 'cullface', ["back", "front", "none", "frontandback"]);
      this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw", "cw"]);

      console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

      var tempList = rootElement.getElementsByTagName('list');

      if (tempList == null || tempList.length == 0) {
          return "list element is missing.";
      }

      this.list = [];
      // iterate over every element
      var nnodes = tempList[0].children.length;
      for (var i = 0; i < nnodes; i++) {
          var e = tempList[0].children[i];

          // process each element and store its information
          this.list[e.id] = e.attributes.getNamedItem("coords").value;
          console.log("Read list item id " + e.id + " with value " + this.list[e.id]);
      };

  };

  /*
   * Callback to be executed on any read error
   */

  MySceneGraph.prototype.onXMLError = function(message) {
      console.error("XML Loading Error: " + message);
      this.loadedOk = false;
  };
