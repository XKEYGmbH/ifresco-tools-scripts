// Provide an array of nodes to be processed with AutoOCR.
// @author: Lutz Horn <lutz.horn@ecm4u.de>

// implicit objects: Map<String, Object> providerState

(function() {
	var configFile = companyhome.childByNamePath("/Data Dictionary/ifresco/repoworker/autoOCRWorker.json");
	var parsedConfig = eval("("+configFile.content+")");
	
    // Paging: skip in page.
    var skip = providerState["skip"];
    logger.warn("skip=" + skip);

    // Query for all PDF or TIFF content nodes that don't have the ocr aspect.
	var query = '-ASPECT:"{http://ifresco.at/model/autoocr/1.0}ocr"';
			//'TYPE:"{http://www.alfresco.org/model/content/1.0}content"';

	if (parsedConfig.types.length > 0) {
		query += ' AND (';
		for( var i = 0; i < parsedConfig.types.length; i++) {
			var type = parsedConfig.types[i];
			if (i != 0)
				query += " OR ";
			
			query += 'TYPE:"'+type+'"';
		}
		query += ')';
	}
	
	if (parsedConfig.mimetypes.length > 0) {
		query += ' AND (';
		for( var i = 0; i < parsedConfig.mimetypes.length; i++) {
			var mime = parsedConfig.mimetypes[i];
			if (i != 0)
				query += " OR ";
			
			query += '@cm\\:content.mimetype:"'+mime+'"';
		}
		query += ')';
	}

    logger.warn("query: " + query);
    var sort1 = {
       column: "@{http://www.alfresco.org/model/content/1.0}modified",
       ascending: false
    };
    var sort2 = {
       column: "@{http://www.alfresco.org/model/content/1.0}created",
       ascending: false
    };
    var def = {
       query: query,
       sort: [sort1, sort2],
       page: {skipCount: skip}
    };
    var result = search.query(def);

    logger.warn(result.length + " nodes found");

    // Collect nodes to return.
    var nodes = new Array();
    for (var i = 0; i < result.length; i++) {
        var node = result[i];

        logger.warn(node.name + " (" + node.mimetype + ")");

    	// Check if this is a false positive.
	    if (node.properties["ifrescoautoocr:ocr_success"] == true) {
            logger.warn("already converted");
            continue;
        }

        nodes.push(node);
    }

    // Update paging state.
    providerState["skip"] = skip + result.length;

    logger.warn("returning " + nodes.length + " nodes");
    return nodes;
})();
