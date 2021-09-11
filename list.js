var list_store = [];

function startList(){
    buildComponent();
}

function buildComponent(){
    var html =
    '<div id="list_table_header"></div>' +
    '<div id="list_table_div">' +
        '<table id="list_table">' +
            '<thead>' +
                '<tr class="header_row">' +
                    '<th class="id_header header_cell">' +
                        'ID:' +
                    '</th>' +
                    '<th class="partner_header header_cell">' +
                        'Partner:' +
                    '</th>' +
                    '<th class="key_header header_cell">' +
                        'Key:' +
                    '</th>' +
                    '<th class="actions_header header_cell">' +
                    '</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
        '</table>' +
    '</div>' +
    '<div id="list_popup_mask">' +
        '<div id="list_popup"></div>' +
    '</div>';

    $("#list").html(html);
    buildControlbar();
    buildTable();

     //LISTENERS:
     $("#search_field").on('input', onSearchFieldChange);
     $("#list_popup_mask").on('click', onPopupMaskClick);
}

function onSearchFieldChange(e){
    var search_text = $("#search_field").val();
    refreshGrid(search_text);
}

function onPopupMaskClick(e){
    if(e.target == $("#list_popup_mask").get(0)){
        closeEditWindow();
    }
}

function buildControlbar(){
    var html =
        '<table width="100%"><tr>' +
            '<td width="10%"><img src="images/svf_logo.png" height="80px" class="logo"></td>' +
            '<td width="90%">' +
                '<button class="big_icon_button" onclick="newEntry()"><i class="material-icons">add</i><br>Neu</button>' +
                '<input type="file" id="file_input"></input>' +
                '<button class="big_icon_button" onclick="importList()"><i class="material-icons">upload</i><br>Import</button>' +
                '<button class="big_icon_button" onclick="downloadList()"><i class="material-icons">download</i><br>Export</button>' +
                '<button class="big_icon_button" onclick="openPrintWindow()"><i class="material-icons">print</i><br>Drucken</button>' +
            '</td>' +
        '</tr></table>';

    $("#list_table_header").html(html);
}

function buildTable(){
    var html =
        '<table id="list_table">' +
            '<thead>' +
                '<tr class="header_row">' +
                    '<th class="header_cell">' +
                        'ID:' +
                    '</th>' +
                    '<th class="header_cell">' +
                        'Nachname:' +
                    '</th>' +
                    '<th class="header_cell">' +
                        'Vorname:' +
                    '</th>' +
                    '<th class="header_cell">' +
                        'Adresse:' +
                    '</th>' +
                    '<th class="header_cell">' +
                        'Telefon:' +
                    '</th>' +
                    '<th class="header_cell">' +
                    '</th>' +
                '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
        '</table>';

    $("#list_table_div").html(html);
}

function getEntryById(entry_id){
    var found_entry = null;
    $.each(list_store,function(i, entry){
        if(entry.id == entry_id){
            found_entry = entry;
            return false;
        }
    });
    return found_entry;
}

function getIndexById(entry_id){
    var found_index = null;
    $.each(list_store,function(i, entry){
        if(entry.id == entry_id){
            found_index = i;
            return false;
        }
    });
    return found_index;
}

function removeEntry(entry_id){
    $.each(list_store,function(i, entry){
        if(entry.id == entry_id){
            entry_index = i;
        }
    });

    list_store.splice(entry_index, 1);
    refreshGrid();
}

function refreshGrid(search_text = null){
    var html = "";
    $.each(list_store,function(i, entry){
        if(search_text){
            var found = false;
            if(entry.id.toString().toLowerCase().indexOf(search_text.toLowerCase()) >= 0){
                found = true;
            }
            if(entry.name.toLowerCase().indexOf(search_text.toLowerCase()) >= 0){
                found = true;
            }
            if(entry.system_key.toLowerCase().indexOf(search_text.toLowerCase()) >= 0){
                found = true;
            }
            if(found == false){
                return;
            }
        }
        html = html +
                '<tr onclick="showNote(' + entry.id + ')" class="entry_row" id="entry_row_' + entry.id + '">' +
                    '<td>' + entry.id + '</td>' +
                    '<td>' + entry.Nachname + '</td>' +
                    '<td>' + entry.Vorname + '</td>' +
                    '<td>' + entry.Adresse + '</td>' +
                    '<td>' + entry.Telefon + '</td>' +
                    '<td style="text-align: right">' +
                        '<button onclick="openEditWindow(' + entry.id + ')" class="edit_button action_button"><i class="material-icons">edit</i></button>' +
                        '<button onclick="removeEntry(' + entry.id + ')" class="remove_button action_button"><i class="material-icons">delete</i></button>' +
                    '</td>' +
                '</tr>' +
                '<tr class="note_row" id="note_row_' + entry.id + '">' +
                '<td></td>' +
                '<td colspan=4>' +
                        '<b>Notiz: </b> ' + entry.Notiz +
                '</td>' +
                '<td></td>' +
                '</tr>';
    });
    $('#list_table tbody').html(html);
}

function showNote(entry_id){
    $(".note_row").css("height", "0");
    $(".note_row").css("display", "none");
    $(".entry_row").removeClass("entry_row_selected");
    $(".note_row").removeClass("note_row_selected");

    $("#note_row_" + entry_id).css("display", "table-row");
    $("#note_row_" + entry_id).css("height", "100px");
    $("#entry_row_" + entry_id).addClass("entry_row_selected");
    $("#note_row_" + entry_id).addClass("note_row_selected");
}

function openPrintWindow(){
    var html = '<div id="list_popup_content"></div><div id="list_popup_control"></div>';

    $("#list_popup").html(html);
    buildPrintForm();
    buildPrintControl();
    $("#list_popup_mask").css("display", "block");

    setTimeout(function() {
        $("#list_popup").css("top", "200px");
        $("#list_popup_mask").css("background-color", "rgba(0,0,0,0.4)")
    }, 1);
}

function buildPrintForm(){
    var html = "";
    html += "<table style='width: 100%;'>";
        html += "<tr>";
            html += "<td>Datum 1:</td>";
            html += '<td><input type="date" class="print_form_input" id="date1_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 2:</td>";
            html += '<td><input type="date" class="print_form_input" id="date2_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 3:</td>";
            html += '<td><input type="date" class="print_form_input" id="date3_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 4:</td>";
            html += '<td><input type="date" class="print_form_input" id="date4_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 5:</td>";
            html += '<td><input type="date" class="print_form_input" id="date5_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 6:</td>";
            html += '<td><input type="date" class="print_form_input" id="date6_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 7:</td>";
            html += '<td><input type="date" class="print_form_input" id="date7_input"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Datum 8:</td>";
            html += '<td><input type="date" class="print_form_input" id="date8_input"></td>';
        html += "</tr><br>";
    html += "</table>";

    $("#list_popup_content").html(html);
}

function buildPrintControl(){
    var html = "";
    html += '<button onclick="closePrintWindow()" class="close_button"><i class="material-icons">stop</i>Abbrechen</button>';
    html += '<button onclick="printList()" class="save_button"><i class="material-icons">print</i>Drucken</button>';

    $("#list_popup_control").html(html);
}

function closePrintWindow(){
    $("#list_popup").css("top", "-1000px");
    $("#list_popup_mask").css("background-color", "rgba(0,0,0,0)")
    setTimeout(function() {
        $("#list_popup").html("");
        $("#list_popup_mask").css("display", "none");
    }, 400);
}

function openEditWindow(entry_id){
    var entry = getEntryById(entry_id);
    var html = '<div id="list_popup_content"></div><div id="list_popup_control"></div>';

    $("#list_popup").html(html);
    buildEditForm(entry);
    buildEditControl(entry);
    $("#list_popup_mask").css("display", "block");

    setTimeout(function() {
        $("#list_popup").css("top", "200px");
        $("#list_popup_mask").css("background-color", "rgba(0,0,0,0.4)")
    }, 1);
}

function buildEditForm(entry){
    var nachname = "";
    var vorname = "";
    var adresse = "";
    var telefon = "";

    if(entry){
        nachname = entry.Nachname;
        vorname = entry.Vorname;
        adresse = entry.Adresse;
        telefon = entry.Telefon;
    }
    var html = "";
    html += "<table style='width: 100%;'>";
        html += "<tr>";
            html += "<td>Nachname:</td>";
            html += '<td><input type="text" class="edit_form_input" id="nachname_input" value ="' + nachname +'"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Vorname:</td>";
            html += '<td><input type="text" class="edit_form_input" id="vorname_input" value ="' + vorname +'"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Adresse:</td>";
            html += '<td><input type="text" class="edit_form_input" id="adresse_input" value ="' + adresse +'"></td>';
        html += "</tr><br>";
        html += "<tr>";
            html += "<td>Telefon:</td>";
            html += '<td><input type="text" class="edit_form_input" id="telefon_input" value ="' + telefon +'"></td>';
        html += "</tr><br>";
    html += "</table>";

    $("#list_popup_content").html(html);
}

function buildEditControl(entry){
    var id = -1;
    if(entry){
        id = entry.id;
    }
    var html = "";
    html += '<button onclick="closeEditWindow(false)" class="close_button"><i class="material-icons">stop</i>Abbrechen</button>';
    html += '<button onclick="closeEditWindow(true, ' + id + ')" class="save_button"><i class="material-icons">save</i>Speichern</button>';

    $("#list_popup_control").html(html);
}

function closeEditWindow(save = false, id = -1){
    console.log(id);
    if(save){
        if(id != -1){
            var index = getIndexById(id);
            if(index){
                list_store[index].Nachname = $("#nachname_input").val();
                list_store[index].Vorname = $("#vorname_input").val();
                list_store[index].Adresse = $("#adresse_input").val();
                list_store[index].Telefon = $("#telefon_input").val();
            }
        }
        else{
            var new_entry = {
                                id: getHighestID() + 1,
                                Nachname: $("#nachname_input").val(),
                                Vorname: $("#vorname_input").val(),
                                Adresse: $("#adresse_input").val(),
                                Telefon: $("#telefon_input").val()
                            };
            list_store.push(new_entry);
        }

        refreshGrid();
    }

    $("#list_popup").css("top", "-1000px");
    $("#list_popup_mask").css("background-color", "rgba(0,0,0,0)")
    setTimeout(function() {
        $("#list_popup").html("");
        $("#list_popup_mask").css("display", "none");
    }, 400);
}

function newEntry(){
    var highestID = getHighestID();
    var newID = highestID + 1;
    openEditWindow(newID);
}

function getHighestID(){
    var id = 0;
    $.each(list_store,function(i, entry){
        if(entry.id > id){
            id = entry.id;
        }
    });
    return id;
}

function downloadList(){
    $("<a />", {
        "download": "list.json",
        "href" : "data:application/json," + encodeURIComponent(JSON.stringify(list_store))
      }).appendTo("body")
      .click(function() {
         $(this).remove()
      })[0].click()
}

function importList(){
    var file = $('#file_input').prop('files')[0];
    if(file){
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(e) {
            new_list_store = JSON.parse(e.target.result);
            list_store = [];
            var id = 1;
            $.each(new_list_store,function(i, entry){
                entry.id = id;
                entry.Notiz = "";
                list_store.push(entry);
                id++;
            });
            refreshGrid();
        };
    }
}

function printList() {
    getPrintHTML();
    setTimeout(function() {
        window.print();
    }, 500);
}

function getPrintHTML(){
    var date1 = $("#date1_input").val();
    var date2 = $("#date2_input").val();
    var date3 = $("#date3_input").val();
    var date4 = $("#date4_input").val();
    var date5 = $("#date5_input").val();
    var date6 = $("#date6_input").val();
    var date7 = $("#date7_input").val();
    var date8 = $("#date8_input").val();

    var html = "";
    html += '<img src="images/svf_logo.png" height="80px"> <b style="font-size: 24px">Trainingsliste</b><br><br>';
    html += '<table style="width: 100%; font-family: sans-serif; font-size: 12px; border-collapse: collapse;">';
        html += '<tr>';
        if(date1){
            html += '<th width="">' + date1 + '</th>';
        }
        if(date2){
            html += '<th width="">' + date2 + '</th>';
        }
        if(date3){
            html += '<th width="">' + date3 + '</th>';
        }
        if(date4){
            html += '<th width="">' + date4 + '</th>';
        }
        if(date5){
            html += '<th width="">' + date5 + '</th>';
        }
        if(date6){
            html += '<th width="">' + date6 + '</th>';
        }
        if(date7){
            html += '<th width="">' + date7 + '</th>';
        }
        if(date8){
            html += '<th width="">' + date8 + '</th>';
        }
            html += '<th>Nachname</th>';
            html += '<th>Vorname</th>';
            html += '<th>Adresse</th>';
            html += '<th>Telefon</th>';
        html += '</tr>';
    $.each(list_store,function(i, entry){
        html += '<tr height="20px" style="border: 1px solid black; page-break: avoid;">';
        if(date1){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date2){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date3){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date4){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date5){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date6){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;"></td>';
        }
        if(date7){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;" ></td>';
        }
        if(date8){
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;" ></td>';
        }
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;">' + entry.Nachname + '</td>';
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;">' + entry.Vorname + '</td>';
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;">' + entry.Adresse + '</td>';
            html += '<td style="border: 1px solid black; page-break: avoid; padding: 2px;">' + entry.Telefon + '</td>';
        html += '</tr>';
    });
    html += '</table>';
    $("#print_div").html(html);
}

$(startList);