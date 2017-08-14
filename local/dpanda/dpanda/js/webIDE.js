var Base64 = {_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}};
var loading_text = "<p><img src='images/loading.gif'/><br /><br /><br /><strong>Loading, please wait...</strong></p>";
var transformationType = "GatewayScript";

var baseUrl = "";
var newXslUrl = "templates/new.xsl";
var newGatewayScriptUrl = "templates/new.js";
var loadXslUrl = "../dpanda.ide/transform.xsl";
var loadGatewayScriptUrl = "../dpanda.ide/transform.js";
var saveUrl = "api/filestore/file?filename=";
var runXslUrl = "ide/runXsl";
var runGatewayScriptUrl = "ide/runGws";
var getLogsUrl = "api/logs?tid="

window.moveTo(0,0);
window.resizeTo(screen.width,screen.height);

$(function() {

	$('#middle').enhsplitter({minSize: 50, invisible: true, height: "calc(100% - 30px)", position: $(document).width()*0.6});
	$('#tester').enhsplitter({minSize: 50, vertical: false, invisible: true, height: "100%"});
	$("#dialog").dialog({ closeOnEscape: false, autoOpen: false, create: function (event, ui) { $(".ui-widget-header").hide(); } });

	$(".tabs").tabs({
		// This is a bug fix for automatic refreshment of ace editor content on a hidden editors. you may find more details here: https://github.com/ajaxorg/ace/issues/1245
    activate: function( evt, ui ) {
				var selectedTab = ui.newTab[0].outerText;
				switch (selectedTab)
				{
					case "Request Body":
							requestEditor.resize(true);
						break;
					case "Response Body":
								responseEditor.resize(true);
							break;
					case "HTTP Headers":
								requestHeadersEditor.resize(true);
								responseHeadersEditor.resize(true);
							break;
				}
    }
	});

	var codeEditor = ace.edit("editor-area");
	codeEditor.setTheme("ace/theme/twilight");
	codeEditor.$blockScrolling = Infinity;
	codeEditor.session.setMode("ace/mode/javascript");
	codeEditor.renderer.setScrollMargin(10, 10);
	codeEditor.setOptions({ autoScrollEditorIntoView: true 	});

	var requestEditor = ace.edit("request-area");
	requestEditor.setTheme("ace/theme/twilight");
	requestEditor.$blockScrolling = Infinity;
	requestEditor.session.setMode("ace/mode/javascript");
	requestEditor.renderer.setScrollMargin(10, 10);
	requestEditor.setOptions({ autoScrollEditorIntoView: true });

	var requestHeadersEditor = ace.edit("request-headers");
	requestHeadersEditor.setTheme("ace/theme/twilight");
	requestHeadersEditor.$blockScrolling = Infinity;
	requestHeadersEditor.renderer.setScrollMargin(10, 10);

	var responseEditor = ace.edit("response-area");
	responseEditor.setTheme("ace/theme/twilight");
	responseEditor.$blockScrolling = Infinity;
	responseEditor.session.setMode("ace/mode/javasript");
	responseEditor.renderer.setScrollMargin(10, 10);
	responseEditor.setOptions({ autoScrollEditorIntoView: true });

	var responseHeadersEditor = ace.edit("response-headers");
	responseHeadersEditor.setTheme("ace/theme/twilight");
	responseHeadersEditor.$blockScrolling = Infinity;
	responseHeadersEditor.renderer.setScrollMargin(10, 10);

	$("#btn-new").button({icons: {secondary: "ui-icon-document"}}).click(function() {

		var url = "";
		if (transformationType == "XSL") url = baseUrl + newXslUrl;
		else if (transformationType == "GatewayScript") url = baseUrl + newGatewayScriptUrl;

		status("Generating " + transformationType + " transformation template...");
		$("#dialog").html(loading_text);
		$("#dialog").dialog("open");
		$.ajax({
			url: url,
			type: "get",
			dataType: "text",
			success: function(response){
				$("#dialog").dialog("close");
				codeEditor.setValue(response, 1);
				status("New " + transformationType + " transformation was generated succesfully.");
			},
			error:function() { $("#dialog").dialog("close"); status("Error generating " + transformationType + " transformation template."); }
		});
	});

	$("#btn-load").button({icons: {secondary: "ui-icon-script"}}).click(function() {

		var url = "";
		if (transformationType == "XSL") url = baseUrl + loadXslUrl;
		else if (transformationType == "GatewayScript") url = baseUrl + loadGatewayScriptUrl;

		status("Loading " + transformationType + " transformation...");
		$("#dialog").html(loading_text);
		$("#dialog").dialog("open");
		$.ajax({
			url: url,
			type: "get",
			success: function(response){
				codeEditor.setValue(response, 1);
				$("#dialog").dialog("close");
				status(transformationType + " transformation was loaded succesfully.");
			},
			error:function() { $("#dialog").dialog("close"); status("Error loading " + transformationType + " transformation."); }
		});
	});

	$("#btn-save").button({icons: {secondary: "ui-icon-disk"}}).click(function() {

		var url = baseUrl + saveUrl;
		var filename = 'local:///dpanda.ide/transform.';
		if (transformationType == "XSL") filename += 'xsl';
		else if (transformationType == "GatewayScript") filename += 'js';

		url = url + filename;

		status("Saving " + transformationType + " transformation...");
		$("#dialog").html(loading_text);
		$("#dialog").dialog("open");
		$.ajax({
			url: url,
			type: "post",
			contentType: "application/json",
			data: JSON.stringify({ "filename": filename, "content" : codeEditor.getValue() }),
			success: function(response){
				$("#dialog").dialog("close");
				if (response.status == "ok") status(transformationType + " transformation was saved succesfully.");
				else status("Saving " + transformationType + " transformation failed!");
			},
			error:function() { $("#dialog").dialog("close"); status("Saving " + transformationType + " transformation failed!"); }
		});
	});

	$("#btn-run").button({icons: {secondary: "ui-icon-circle-triangle-e"}}).click(function() {

		var url = "";
		if (transformationType == "XSL") url = baseUrl + runXslUrl;
		else if (transformationType == "GatewayScript") url = baseUrl + runGatewayScriptUrl;


		status("Running " + transformationType + " transformation...");
		$("#dialog").html(loading_text);
		$("#dialog").dialog("open");
		$.ajax({
			url: url,
			type: "post",
			beforeSend: function(xhr){
				var headers = requestHeadersEditor.getValue().split("\n");
				for (i = 0; i < headers.length; ++i)
				{
					var splitted = headers[i].split(":");
					if (splitted.length > 1)
					{
						var currHeaderValue = "";
						for (j = 1; j < splitted.length; ++j) currHeaderValue += splitted[j].trim() + ":";
						currHeaderValue = currHeaderValue.substring(0, currHeaderValue.length-1);
						xhr.setRequestHeader(splitted[0].trim(), currHeaderValue);
					}
				}
			},
			contentType: getRequestHeader("Content-Type"),
			dataType: "text",
			data: requestEditor.getValue(),
		}).always(function(response, stat, xhr){
				$("#dialog").dialog("close");

				var transactionId = "";
				if (stat == "error")
				{
					responseEditor.setValue(response.responseText, 1);
					responseHeadersEditor.setValue(response.getAllResponseHeaders(), 1);
					transactionId = response.getResponseHeader("TransactionID");
				}
				else
				{
					responseEditor.setValue(response, 1);
					responseHeadersEditor.setValue(xhr.getAllResponseHeaders(), 1);
					transactionId = xhr.getResponseHeader("TransactionID");
				}

				$("#response-logs").html("Waiting for logs...");
				setTimeout(function() { getLogs(transactionId); }, 1000);
				status(transformationType + " transformation has finished running.");
			});
	});

	$('#slct-transformation-type').on('change', function() {
		transformationType = this.value;
		if (transformationType == "XSL")
		{
			codeEditor.session.setMode("ace/mode/xml");
			requestEditor.session.setMode("ace/mode/xml");
			responseEditor.session.setMode("ace/mode/xml");
			setRequestHeader("Content-Type", "text/xml")
		}
		else if (transformationType == "GatewayScript")
		{
			codeEditor.session.setMode("ace/mode/javascript");
			requestEditor.session.setMode("ace/mode/javascript");
			responseEditor.session.setMode("ace/mode/javascript");
			setRequestHeader("Content-Type", "application/json")
		}
		$("#btn-new").click();
	});

	function getRequestHeader(name)
	{
		var headers = requestHeadersEditor.getValue().split("\n");
		for (i = 0; i < headers.length; ++i) if (headers[i].split(":")[0].trim() == name && headers[i].split(":").length > 1) return headers[i].split(":")[1].trim()

		return "";
	}

	function setRequestHeader(name, value)
	{
		var found = false;
		var headers = requestHeadersEditor.getValue().split("\n");
		for (i = 0; i < headers.length; ++i)
		{
			if (headers[i].split(":")[0].trim() == name)
			{
				found = true;
				headers[i] = name + ": " + value;
			}
		}

		var updatedHeaders = requestHeadersEditor.getValue() + "\n" + name + ": " + value;
		if (found)
		{
			var updatedHeaders = "";
			for (i = 0; i < headers.length; ++i) updatedHeaders += headers[i] + "\n";
		}
		updatedHeaders = updatedHeaders.trim();

		requestHeadersEditor.setValue(updatedHeaders, 1);
	}

	function getLogs(tid)
	{
		if (!$.isNumeric(tid)) { $("#response-logs").html("Logs retrieval failed."); return; }
		var url = baseUrl + getLogsUrl + tid;
		$.ajax({
			url: url,
			type: "get",
			contentType: "application/xml",
			success: function(response){
				var logsHtml = "<table id='tbl-response-logs'><tr><td>Date Time</td><td>Type</td><td>Class</td><td>Object</td><td>Level</td><td>Transaction Type</td><td>Transaction ID</td><td>GTID</td><td>Client</td><td>Code</td><td>File</td><td>Message</td></tr>";
				var logs = response.getElementsByTagName("logs")[0].childNodes;
				for (i = 0; i < logs.length; ++i)
				{
					var dateTime = logs[i].getElementsByTagName("date-time")[0].innerHTML;
					var type = logs[i].getElementsByTagName("type")[0].innerHTML;
					var cls = logs[i].getElementsByTagName("class")[0].innerHTML;
					var obj = logs[i].getElementsByTagName("object")[0].innerHTML;
					var level = logs[i].getElementsByTagName("level")[0].innerHTML;
					var transactionType = logs[i].getElementsByTagName("transaction-type")[0].innerHTML;
					var transactionId = logs[i].getElementsByTagName("transaction")[0].innerHTML;
					var gtid = logs[i].getElementsByTagName("gtid")[0].innerHTML;
					var client = logs[i].getElementsByTagName("client")[0].innerHTML;
					var code = logs[i].getElementsByTagName("code")[0].innerHTML;
					var file = logs[i].getElementsByTagName("file")[0].innerHTML;
					var message = logs[i].getElementsByTagName("message")[0].innerHTML;
					logsHtml += "<tr><td>" + dateTime + "</td><td>" + type + "</td><td>" + cls + "</td><td>" + obj + "</td><td>" + level + "</td><td>" + transactionType + "</td><td>" + transactionId + "</td><td>" + gtid + "</td><td>" + client + "</td><td>" + code + "</td><td>" + file + "</td><td>" + message + "</td></tr>";
				}
				logsHtml += "</table>";
				$("#response-logs").html(logsHtml);

			},
			error:function() { status("Transaction logs retrieval failed!"); }
		});
	}

	function status(value) { var dt = new Date(); var datetime = pad0(dt.getDate()) + "/" + (pad0(dt.getMonth()+1))  + "/" + dt.getFullYear() + " " + pad0(dt.getHours()) + ":" + pad0(dt.getMinutes()) + ":" + pad0(dt.getSeconds()); $("#status").html(datetime + " - " + value); }
	function pad0 (value) { if (value > 9) return value; return "0" + value; }

	$("#btn-base64-encode").button({icons: {secondary: "ui-icon-shuffle"}}).click(function() { $("#txt-base64").val(Base64.encode($("#txt-base64").val())); status("Base64 string was encoded.");	});
	$("#btn-base64-decode").button({icons: {secondary: "ui-icon-refresh"}}).click(function() { $("#txt-base64").val(Base64.decode($("#txt-base64").val())); status("Base64 string was decoded.");	});
	$("#btn-basic-auth-header").button({icons: {secondary: "ui-icon-plus"}}).click(function() { setRequestHeader("Authorication", "Basic " + Base64.encode($("#txt-basic-auth-username").val() + ":" + $("#txt-basic-auth-password").val())); status("Basic authorization header was added."); 	});

	$("#chk-request-word-wrap").on('change', function() { requestEditor.getSession().setUseWrapMode(this.checked); });
	$("#chk-response-word-wrap").on('change', function() { responseEditor.getSession().setUseWrapMode(this.checked); });

	setRequestHeader("Content-Type", "application/json")

	$("#btn-new").click();
});
