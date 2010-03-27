var BlueRidge = BlueRidge || {};
String.prototype.times = function(times) {
  if(times == 1) {
    return this;
  }
  return new Array(times).join(this);
};

BlueRidge.Browser = {
  require: function(url, options){
    options = options || {};

    var system   = options["system"] || false;
    var callback = options["onload"] || null;

    url = (system) ? this.treatUrlAsRelativeToCurrentFile(url) : this.treatUrlAsRelativeToSpecFile(url);
    this.createScriptTag(url, callback);
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
    return (depth > 0) ? "../".times(depth + 1) : "";
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
  var require = function(url, options){ return BlueRidge.Browser.require(url, options) };
  var debug   = function(message)     { return BlueRidge.Browser.debug(message) };

  var BLUE_RIDGE_PREFIX = BLUE_RIDGE_PREFIX || "../../vendor/plugins/blue-ridge/";
  var BLUE_RIDGE_VENDOR_PREFIX = BLUE_RIDGE_PREFIX + "/vendor/";

  require(BLUE_RIDGE_VENDOR_PREFIX + "jquery-1.4.2.js",    {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "jquery.fn.js",       {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "jquery.print.js",    {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "screw.builder.js",   {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "screw.matchers.js",  {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "screw.events.js",    {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "screw.behaviors.js", {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "smoke.core.js",      {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "smoke.mock.js",      {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "smoke.stub.js",      {system: true});
  require(BLUE_RIDGE_VENDOR_PREFIX + "screw.mocking.js",   {system: true});

  BlueRidge.loaded = true;
  require(BlueRidge.Browser.deriveSpecNameFromCurrentFile());
}
