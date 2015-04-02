var count = 0;
var folders = {};
chrome.storage.sync.get('folders', function(obj) { 
    if (obj.folders) {
        folders = JSON.parse(obj.folders);

        for (var i = 0; i < Object.keys(folders).length; i++) {
            jQuery('.folder-list').append("<div class='folder-elem' id='"+i+"'>"+
                "Folder <input type='input' name='num' class='num' value='"+(i+1)+"' size='4' />: "+
                "<input type='input' name='folders[]' "+
                "id='"+i+"' class='folder' value='"+folders[i]+"' />"+
                "&nbsp;<input type='submit' class='minus' value='-' /></div>");
        }
        minus_click();
        change_num();

        var total = Object.keys(folders).length
        jQuery('input.folder').each(function() {
            if (count >= Object.keys(folders).length) {
                jQuery(this).val("");
            } else {
                jQuery(this).val(folders[count++]);
            }
        });
    } else {
        var total = 0;
    }

    jQuery('input.add').click(function() {
        jQuery('.folder-list').append("<div id='"+total+"'>"+
            "Folder <input type='input' name='num' class='num' value='"+(total+1)+"' size='4' />: "+
            "<input type='input name='folders[]' "+
            "id='"+total+"' class='folder' value='' />"+
            "&nbsp;<input type='submit' class='minus' value='-' /></div>");
        minus_click(this);       
        total++;
    });

    jQuery('input.submit').click(function() {
        count = 0;
        save = {};
        jQuery('input.folder').each(function() {
            if (jQuery(this).val() != "")
                save[count++] = jQuery(this).val();
        });
        chrome.storage.sync.set({'folders': JSON.stringify(save)});
        chrome.runtime.reload();
    });
});

function minus_click() {
    // make sure we only bind one click to the minus buttons
    jQuery('.minus').unbind("click");
    jQuery('.minus').click(function() {
        jQuery(this).parent().remove();
        var count = 0;
        jQuery('.num').each(function() {
            jQuery(this).val((count+1));
            jQuery(this).parent().children(1).attr('id',count);
            count++;
        });
    });
}

function change_num() {
    jQuery('.num').focus(function() {
        var old_val = jQuery(this).val();
        jQuery(this).change(function() {
            var new_val = jQuery(this).val();
            var count = 0;
            var adjust = 0;
            var that = this;
            jQuery('.folder-elem').each(function() {
                if (count == new_val) {
                    adjust += 1;
                }
                else {

                }
                count++;
            });
        });
    });
}
