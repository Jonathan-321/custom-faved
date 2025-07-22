<h2 class="mb-4">Bookmarklet</h2>

<div>
    <p>Faved bookmarklet* lets you quickly save any page you visit to the catalog of your bookmarks in Faved.</p>
    <div class="d-flex justify-content-start align-items-center gap-3 mb-4">
        <a class="btn btn-outline-secondary text-nowrap"
           href='javascript:(function(){ var meta_description = document.querySelector("meta[name=\"description\"]"); if (meta_description) { meta_description = meta_description.getAttribute("content"); } var rspW=700, rspH=700, rspL=parseInt((screen.width/2)-(rspW/2)), rspT=parseInt((screen.height/2)-(rspH/2)); window.open("<?php use function Framework\getHTTPProtocol;

		   echo sprintf("%s%s%s", getHTTPProtocol(), $_SERVER['HTTP_HOST'], $_SERVER['SCRIPT_NAME']); ?>?route=/item&url="+encodeURIComponent(window.location.href)+"&title="+encodeURIComponent(document.title)+"&description="+((meta_description) ? encodeURIComponent(meta_description) : ""),"add-to-faved","width="+rspW+",height="+rspH+",resizable=yes,scrollbars=yes,status=false,location=false,toolbar=false,left="+rspL+",top="+rspT) })();'>
            Add to Faved
        </a>
        <p class="m-0"><i class="bi bi-arrow-left"></i> Drag this button to your browser bookmarks bar to save the Faved
            bookmarklet.</p>
    </div>
    <p>* A bookmarklet is a bookmark stored in a web browser that contains JavaScript commands that add new features to
        the browser. Unlike browser extensions, they are lightweight and don't have access to your viewed page until you
        intentionally click to use them.</p>
</div>