// Process a node with AutoOCR / Fileconvert and replace it with the result.
// @author: Lutz Horn <lutz.horn@ecm4u.de>
// @modified: Dominik Danninger <ddanninger@xkey.at>

// implicit objects: autoocr, nodeRef, parentRef

// nur im Fall von Script-Actions:
// Map<String, String> params
// Map<String, Object> out

// collection of library functions
// store at /Data Dictionary/ifresco/actions/libConvert.js

if(typeof out == "undefined") {
	out = {};
}

if(typeof params == "undefined") {
	params = {};
}

function _doConvert(node,profile,converter) {
	
    logger.warn("processing " + node.name);

	if (converter != "fileconverter") {
		if (node.properties["ifrescoautoocr:ocr_success"] == true) {
			logger.warn("Already converted.");
			out["html"] = "<div>Already converted.</div>";
			return false;
		}
	}

    if (!autoocr) {
        out["html"] = "<div>ifresco AutoOCR Transformer is not available.</div>";
	    throw "autoocr root scoped object not defined";
    }

    // Variables to note the result of this processing.
    var success = false;
    var failureInfo = "";
	
	var configFile = companyhome.childByNamePath("/Data Dictionary/ifresco/actions/serverConfig.json");
	var parsedConfig = eval("("+configFile.content+")");
	

    if (converter == "fileconverter") {
		var config = parsedConfig.fcPro;
	}
	else {
		var config = parsedConfig.autoOCR;
	}

    // We can convert PDF and TIFF.
	if (converter == "fileconverter") {
		var autoocrext = node.name.substr((~-node.name.lastIndexOf(".") >>> 0) + 2).toUpperCase();
	}
	else {
		var autoocrext = "PDF";
		if (node.mimetype == "image/tiff") {
			autoocrext = "TIFF";
		}
	}

    var jobDesc = {
	    sourcenode : node,
	    sourcecontentproperty : 'cm:content', // optional, this is the default
	    autoocrext : autoocrext,
	    settingsname : profile,
	    additionaloutputs : [],
	    label : node.name // optional, this is the default
    };

    try {

        // upload file to AutoOCR
        var job = autoocr.upload(config, jobDesc);

        if (!job.guid) {
	        throw "no guid property on job";
        }

        var result = autoocr.waitForCompletion(config, job.guid);

        if (result == autoocr.STATUS_CONVERTED) {
            logger.log("conversion of " + node.name + " OK");
			
            // download AutoOCR result to existing node
            var dlDesc = {
	            guid : job.guid,
	            index : 0, // optional, defaults to 0
	            targetnode : node,
	            targetcontentproperty : 'cm:content' // optional, this is the default
            };
            autoocr.download(config, dlDesc);
            if (!node.properties["cm:content"]) {
	            throw "node content property is empty";
            }

			if (node.mimetype != "application/pdf") {
                node.mimetype = "application/pdf";    
                node.name = node.name + ".pdf";
                node.save();
            }

            success = true;
        } else {
            logger.log("conversion failed: " + job.status);
            failureInfo = "job " + job.guid + ", result " + job.status;
        }
    } catch(e) {
        success = false;
        failureInfo = "" + e;
    }

    // Set the ocr aspects.
	if (converter != "fileconverter") {
		node.addAspect("ifrescoautoocr:ocr");
		node.properties["ifrescoautoocr:ocr_success"] = success;
		node.properties["ifrescoautoocr:ocr_failureInfo"] = failureInfo;
		node.save();
	}
    
    logger.log("result converting to " + node.name + ": " + success + ", failureInfo=" + failureInfo);
	return success;
}

function doMultiConvert(node,profile,converter) {
	var success = _doConvert(node,profile,converter);
	if (success) {
        out["html"] += "<div>"+node.name+" - OK</div>";
    } else {
        out["html"] += "<div>"+node.name+" - failed</div>";
    }
	return success;
}

function doConvert(profile,converter) {
	var converterName = "AutoOCR";
	if (converter == "fileconverter")
		converterName = "FileConverter";
		
	var success = _doConvert(nodeRef,profile,converter);
	if (success) {
        out["html"] = "<div>"+converterName+" - OK</div>";
    } else {
        out["html"] = "<div>"+converterName+" - failed</div>";
    }
	return success;
}
