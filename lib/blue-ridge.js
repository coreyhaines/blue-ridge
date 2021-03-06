var BlueRidge = BlueRidge || {};
BlueRidge.Browser = {
  require: function(url, options){
    options = options || {};

    var system   = options["system"] || false;
    var callback = options["onload"] || null;

    url = (system) ? BlueRidge.Browser.treatUrlAsRelativeToCurrentFile(url) : BlueRidge.Browser.treatUrlAsRelativeToSpecFile(url);
    BlueRidge.Browser.createScriptTag(url, callback);
  },

  treatUrlAsRelativeToSpecFile: function(url){
    var depth, offset;
    depth = this.calculateDepth();
    offset = (depth-1)*"../".length;
    url = url.substr(offset);

    return this.urlCorrection(depth) + url;
  },
  
  treatUrlAsRelativeToCurrentFile: function(url){
    return this.urlCorrection(this.calculateDepth()) + url;
  },
  
  createScriptTag: function(url, onload){
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");

    script.src = url;
    if(onload) { script.onload = script.onreadystatechange = onload; }

    head.appendChild(script);
  },
  
  urlCorrection: function(depth){
                   
  return new Array(depth+1).join("../");
                   // return "../".times(depth);
    // return (depth > 0) ? "../".times(depth) : "";
  },
  
  debug: function(message){
    document.writeln(message + " <br/>");
  },

  currentFile: function(){
    return window.location.toString();
  },
  
  deriveSpecNameFromCurrentFile: function(){
    return this.currentFile().match(/^.*fixtures\/(.*?)\.html/)[1] + "_spec.js";
  },
  
  calculateDepth: function(){
    var subDirs = this.currentFile().match(/^.*fixtures\/((.*?\/)*)(.*?)\.html/)[1];
    return subDirs.split("/").length;
  }
};

if(BlueRidge.loaded != true) {
  var require = BlueRidge.Browser.require;
  var debug = BlueRidge.Browser.debug;

  var BLUE_RIDGE_PREFIX = BLUE_RIDGE_PREFIX || "../../vendor/plugins/blue-ridge/";

  var requireVendor = function(file) {
    BlueRidge.Browser.require(BLUE_RIDGE_PREFIX + "/vendor/" + file,    {system: true});
  };

  requireVendor("jquery-1.4.2.js");
  requireVendor("jquery.fn.js");
  requireVendor("jquery.print.js");
  requireVendor("screw.builder.js");
  requireVendor("screw.matchers.js");
  requireVendor("screw.events.js");
  requireVendor("screw.behaviors.js");
  requireVendor("smoke.core.js");
  requireVendor("smoke.mock.js");
  requireVendor("smoke.stub.js");
  requireVendor("screw.mocking.js");

  BlueRidge.loaded = true;
  require(BlueRidge.Browser.deriveSpecNameFromCurrentFile());
}
