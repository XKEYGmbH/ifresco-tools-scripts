// Process a node with AutoOCR and replace it with the result.
// @author: Lutz Horn <lutz.horn@ecm4u.de>
// @modified: Dominik Danninger <ddanninger@xkey.at>

// implicit objects: autoocr, nodeRef, parentRef

// nur im Fall von Script-Actions:
// Map<String, String> params
// Map<String, Object> out

// collection of library functions
// store at /Data Dictionary/ifresco/repoworker/libAutoOCR.js

if(typeof out == "undefined") {
	out = {};
}

if(typeof params == "undefined") {
	params = {};
}

function doAutoOCR() {
	var configFile = companyhome.childByNamePath("/Data Dictionary/ifresco/repoworker/autoOCRWorker.json");
	var parsedConfig = eval("("+configFile.content+")");
    logger.warn("processing " + nodeRef.name);

    if (nodeRef.properties["ifrescoautoocr:ocr_success"] == true) {
        logger.warn("Already converted.");
        out["html"] = "<div>Already converted.</div>";
        return false;
    }

    if (!autoocr) {
        out["html"] = "<div>AutoOCR is not available.</div>";
	    throw "autoocr root scoped object not defined";
    }

    // Variables to note the result of this processing.
    var success = false;
    var failureInfo = "";

    // configure AutoOCR job
    var config = parsedConfig.server;

    // We can convert PDF and TIFF.
	if (parsedConfig.converter.toLowerCase() == "fileconverter") {
		var autoocrext = node.name.substr((~-node.name.lastIndexOf(".") >>> 0) + 2).toUpperCase();
	}
	else {
		var autoocrext =  "PDF";
		if (nodeRef.mimetype == "image/tiff") {
			autoocrext = "TIFF";
		}
	}

    var jobDesc = {
	    sourcenode : nodeRef,
	    sourcecontentproperty : 'cm:content', // optional, this is the default
	    autoocrext : autoocrext,
	    settingsname : parsedConfig.profile,
	    additionaloutputs : [],
	    label : "this is alf from melmac!"    // optional, this is the default
    };

    try {

        // upload file to AutoOCR
        var job = autoocr.upload(config, jobDesc);

        if (!job.guid) {
	        throw "no guid property on job";
        }

        var result = autoocr.waitForCompletion(config, job.guid);

        if (result == autoocr.STATUS_CONVERTED) {
            logger.log("conversion of " + nodeRef.name + " OK");

            // download AutoOCR result to existing node
            var dlDesc = {
	            guid : job.guid,
	            index : 0, // optional, defaults to 0
	            targetnode : nodeRef,
	            targetcontentproperty : 'cm:content' // optional, this is the default
            };
            autoocr.download(config, dlDesc);
            if (!nodeRef.properties["cm:content"]) {
	            throw "node content property is empty";
            }

            if (nodeRef.mimetype != "application/pdf") {
                nodeRef.mimetype = "application/pdf";    
                nodeRef.name = nodeRef.name + ".pdf";
                nodeRef.save();
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
    nodeRef.addAspect("ifrescoautoocr:ocr");
    nodeRef.properties["ifrescoautoocr:ocr_success"] = success;
    nodeRef.properties["ifrescoautoocr:ocr_failureInfo"] = failureInfo;
    nodeRef.save();
    
    logger.log("result converting to " + nodeRef.name + ": " + success + ", failureInfo=" + failureInfo);
    if (success) {
        out["html"] = "<div>AutoOCR OK</div>";
    } else {
        out["html"] = "<div>AutoOCR failed: " + failureInfo + "</div>";
    }
    return success;
}

