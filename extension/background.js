function zeroPad (num, numZeros) {
    var an = Math.abs(num);
    var digitCount = 1 + (an ? (Math.floor(Math.log(an) / Math.LN10)) : 0);
    if (digitCount >= numZeros) {
        return num;
    }
    var zeroString = Math.pow(10, numZeros - digitCount).toString().substr(1);
    return num < 0 ? '-' + zeroString + an : zeroString + an;
}

var menu_obj = {
    'title': "Save Image in Folder...",
    'contexts': ["image"],
    'type': 'normal'
};

/*
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
	console.log(item);
    suggest({
		var dir = items[info['menuItemId']];
    	var dateString = zeroPad(d.getFullYear(),4) + zeroPad(d.getMonth()+1, 2) + zeroPad(d.getDate(), 2);
    	dateString = dateString + zeroPad(d.getHours(), 2) + zeroPad(d.getMinutes(),2) + zeroPad(d.getSeconds(),2) + '_';
    	console.log(dateString);
		var filename = dir + dateString + url.substring(url.lastIndexOf('/') + 1);
		console.log(filename);
        filename: item.filename,
        conflictAction: 'overwrite'
    });
});
*/

/**
 * Create a context menu which will only show up for images.
 */
var parent_id = chrome.contextMenus.create(menu_obj, function() { if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError); }});
var items = {};
chrome.storage.sync.get('folders', 
	function(obj) { 
		if (obj.folders) {
		    folders = JSON.parse(obj.folders);
		    for (var i = 0; i < Object.keys(folders).length; i++) {
				var child_obj = {
				    'title': folders[i],
				    'contexts': ["all"],
				    'onclick': function(info, tab) { 
				    	var d = new Date();
						var url = info['srcUrl'];
						var dir = items[info['menuItemId']];
				    	var dateString = zeroPad(d.getFullYear(),4) + zeroPad(d.getMonth()+1, 2) + zeroPad(d.getDate(), 2);
				    	dateString = dateString + zeroPad(d.getHours(), 2) + zeroPad(d.getMinutes(),2) + zeroPad(d.getSeconds(),2) + '_';
						var filename = dir + dateString + url.substring(url.lastIndexOf('/') + 1);

						var dlOpts = {
							saveAs: false,
							url: url,
							filename: filename,
							conflictAction: "overwrite"
						};
						console.log(dlOpts);
						chrome.downloads.download(
							dlOpts,
							function(downloadId) {
								if (chrome.runtime.lastError) {
						    		console.log(chrome.runtime.lastError);
						    	}
							}
						);
			    	},
			    	'parentId': parent_id
				};

				var id = chrome.contextMenus.create(child_obj);
				items[id] = folders[i];
	    	}
	    } else {
	    	chrome.contextMenus.create({
	    		'title': 'No folders defined...',
	    		'contexts': ['all'],
	    		'type': 'normal',
	    		'parentId': parent_id
	    	});
	    }
	}
);