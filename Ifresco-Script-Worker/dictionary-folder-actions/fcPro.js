<import resource="/Company Home/Data Dictionary/ifresco/actions/libConvert.js">

// ifresco action
// store at /Data Dictionary/ifresco/actions/fcPro.js

(function() {
  var profile = params["profile"];
  var multi = params["multi"];
  
  if (typeof profile == 'undefined' || profile == '')
	profile = 'default';
 
  if (typeof multi != 'undefined' && multi != "true" && multi != true)
	multi = false;
 
  logger.warn("FileConverter Action use profile: "+profile);
  if (!multi)
	return doConvert(profile,"fileconverter");
  else {
	out.html = "";
	for( var i = 0; i < items.length; i++) {
		var ref = items[i]; // noderef als string
		var doc = utils.getNodeFromString(ref);
		doMultiConvert(doc,profile,"fileconverter");
	}
	return true;
  }
})();
