ifresco-tools-scripts
=====================

### ifresco Tools - Javascript Examples


#### Repo Worker

Copy XML File to:
`TOMCAT/shared/classes/afresco/extension/ifresco-repoworker-context.xml`

Copy all files of the dictionary-folder-actions to:
`Scripts under /Data Dictionary/ifresco/repoworker`


##### Config
in dictionary-folder-actions/autoOCRWorker.json

```
{
	"mimetypes": [
		"image/tiff",
		"application/pdf"
	],
	"types": [
		"{http://www.alfresco.org/model/content/1.0}content"
	],
	"profile": "AbbyyFR10",
	"converter": "AutoOCR",
	"server": {
		"endpoint" : "https://AUTOOCR-OR-FCPRO-ENDPOINT:8001/AutoOCRService",
		"username" : "user",
		"password" : "password",
		"apikey" : -1,
		"credentialsencoding" : "UTF-8",
		"urlencoding" : "UTF-8",
		"connectiontimeout" : 10000,
		"jobtimeout" : 60000,
		"sleeptime" : 1000
	}
}
```

`mimetypes` - mimetypes for query
`types`- content types for query
`profile` - AutoOCR or FileConverter profile
`converter` - Possible Values = `AutoOCR` or `FileConverter`
`server` - AutoOCR / FileConverter server settings
