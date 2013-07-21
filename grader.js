#!/usr/bin/env node
/* 
Automatically grade files for the presence of specified HTML tags/attributes

Uses commander.js and cheerio.  Teaches command line application development and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2

*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');


var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
// var URL_DEFAULT = "http://afternoon-shore-1049.herokuapp.com";

var assertURLExists = function(inURL) {
   console.log("in URL");
   var tmp =  '';
     rest.get(inURL).on('complete',  function(result) {
    if (result instanceof Error) {
       //report error to user
      console.log("in error"); }
    else {
       //process result
/*
      looks like this is kinda working, but needs some cleanup - actually no - why is the index json output still working?

      var checkJsonURL = checkHtmlFile(result, program.checks);
      var outJsonURL = JSON.stringify(checkJsonURL, null, 4);
   console.log(outJsonURL); */

      console.log("success"+result); }
//      console.log("success"+result); }
    })
};

var assertFileExists = function(infile) {
	var instr = infile.toString();
	if(!fs.existsSync(instr)) {
		console.log("%s does not exists. Exiting.", instr);
		process.exit(1); //http://nodejs.org/api/process.html#process_process_exit_code
	}
	return instr;
    };

var cheerioHtmlFile = function(htmlfile) {
	return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
	return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
	$ = cheerioHtmlFile(htmlfile);
	var checks = loadChecks(checksfile).sort();
	var out = {};
	for(var ii in checks) {
		var present = $(checks[ii]).length > 0;
		out[checks[ii]] = present;
	}
	return out;
};

var clone = function(fn) {
	//Workaround for commander.js issue.
	//http://stackoverflow.com/a/6772648
	return fn.bind({});
};

var processFileUrl = function(url, file, checks){

  console.log("url = " + url + " program= "  + file + " checks = "+ checks);
};

if(require.main == module) {
	program
		.option('-c, --checks <check_file>', 'Path to checks.json',clone(assertFileExists), CHECKSFILE_DEFAULT)
		.option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
		.option('-u, --url  <URL>', 'URL string')
	.parse(process.argv);

// Now we want to process either the file, or the url

   processFileUrl(program.url,program.file,program.checks);

var checkJson = checkHtmlFile(program.file, program.checks);
var outJson = JSON.stringify(checkJson, null, 4);
console.log(outJson);

} else {
	exports.checkHtmlFile = checkHtmlFile;
}
