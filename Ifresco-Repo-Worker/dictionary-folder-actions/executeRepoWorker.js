/*
 * Execute a RepoWorker identified by its Spring bean ID.
 *
 * If the object 'document' is available, the RepoWorker is executed only on this document.
 * Else, the RepoWorker is executed on all documents.
 *
 * The object 'ifresco' is available to execute the two methods of a RepoWorker:
 * - processAllNodes()
 * - processNode(NodeRef nodeRef)
 * Both methods are available via script binding:
 * - ifresco.repoworker.processAllNodes(beanId)
 * - ifresco.repoworker.processNode(beanId, nodeRef)
 *
 * @author Lutz Horn <lutz.horn@ecm4u.de>
 */

(function() {
    // the ID of the Spring bean implementing the Java interface ifresco.tools.repoworker.RepoWorker
    var beanId = "myWorker1";

    var result;
    if (typeof document === "undefined") {
        // process all documents
        logger.log("executing RepoWorker " + beanId + " for all documents");
        result = ifresco.repoworker.processAllNodes(beanId);
    } else {
        // process only the given document
        logger.log("executing RepoWorker " + beanId + " for document " + document.name);
        result = ifresco.repoworker.processNode(beanId, document.nodeRef);
    }
    logger.log("result: " + result);

    return result;
})();
