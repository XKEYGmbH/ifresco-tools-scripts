ifresco-tools-scripts
=====================

### ifresco Tools - Javascript Examples



#### Repo Worker

Full Documentation - www.xkey.at/d/file.php?file=MAYComp/Current/RO/ifrescoTools_RepoWorker_2014_06_26.pdf

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

`server` - AutoOCR / FileConverter server settings

#### Script Worker


Copy / Merge `share-config-custom.xml` to:
`TOMCAT/shared/classes/alfresco/web-extension/share-config-custom.xml`

Copy `ifresco-actions-context.xml` to:
`TOMCAT/shared/classes/alfresco/extension/ifresco-actions-context.xml`

Copy all files of the dictionary-folder-actions to:
`Scripts under /Data Dictionary/ifresco/actions`


##### Config
in dictionary-folder-actions/autoOCRWorker.json

```
{
	"autoOCR": {
		"endpoint" : "https://AUTOOCR-SERVER.may.co.at:8001/AutoOCRService",
		"username" : "admin",
		"password" : "password",
		"apikey" : -1,
		"credentialsencoding" : "UTF-8",
		"urlencoding" : "UTF-8",
		"connectiontimeout" : 10000,
		"jobtimeout" : 60000,
		"sleeptime" : 1000
	},
	"fcPro": {
		"endpoint" : "https://FILECONVERTER-SERVER:8007/FileConverterProREST",
		"username" : "admin",
		"password" : "password",
		"apikey" : 28935,
		"credentialsencoding" : "UTF-8",
		"urlencoding" : "UTF-8",
		"connectiontimeout" : 10000,
		"jobtimeout" : 60000,
		"sleeptime" : 1000
	}
}
```

`autoOCR` - AutoOCR Connection settings

`fcPro`- FileConverter Connection settings

