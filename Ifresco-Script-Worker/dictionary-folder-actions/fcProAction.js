// implizite Objekte:

// nodeRef: ScriptNode des ausgewaehlten Dokuments
// scriptRef: ScriptNode dieses Scripts
// out.html: Rueckgabewerte fuer die Anzeige
// out.hideOKButton: true/false um den Ok Button des Bestätigungsdialogs zu verstecken
// params: Paramter-Map der Action Konfiguration aus Share

// implizite Object in <script>-Tags (auf dem Client Browser dann)
// ifrescoAction({...}): Diese Funktion ruft eine iFresco Action auf. Es muss ein ein JavaScript Object übergeben mit den parametern
//            { scriptname: "mycustom.js", // Name des Repo-Scripts unter /Data Dictionary/ifresco/actions/mycustom.js
//              param1 : "value1",
//              param2 : "value2" }  // weitere parameter

// store at /Data Dictionary/ifresco/actions/fcProAction.js

(function() {
  // Es wird für text Dateien der Inhalt zurückgegeben
  var configFile = companyhome.childByNamePath("/Data Dictionary/ifresco/actions/serverConfig.json");
  var parsedConfig = eval("("+configFile.content+")");
  var config = parsedConfig.fcPro;
  
  var multi = params["multi"];
  if (typeof multi != 'undefined' && multi != "true" && multi != true)
	multi = false;
		
  var h = '';

  h += '<select id="profiles">';
  
  var settings = autoocr.getSettingsCollection(config);
  for(var i = 0; i < settings.length; i++) {
	var setting = settings[i];
	h += '<option value="'+setting.settingsname+'">'+setting.settingsname+'</option>';
  }
  
  h += '</select>';
  h += '<button id="startButton">Start converting</button>';
  h += '<script>';
  h += '  var button = document.getElementById("startButton");';
  h += '  button.onclick = function() {';
  h += '    var dropdown = document.getElementById("profiles");';
  h += '    var profile = dropdown.options[dropdown.selectedIndex].value;';  
  h += '    ifrescoAction({scriptname: "fcPro.js", profile: profile, multi: '+multi+'});'; 
  h += '  };';
  h += '</script>';
  out.html = h;
  out.hideOKButton = true;

  return true;
})();