String.prototype.hashCode = function() {
    //http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
	var hash = 0, i, chr, len;
	if (this.length == 0) return hash;
		for (i = 0, len = this.length; i < len; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0; // Convert to 32bit integer
	}
	return hash;
};


window.onload = function(){
	var base_url = '';
    $(function() {
    	var url = window.location.pathname.split('/');
    				url.pop();
    				var prefix = '';
    				url.forEach(function(i){
    					prefix += '../';
    				});
          $("#se_q").autocomplete({
                source: function(request, response) {
    				$.getJSON(prefix+"autocomplete", { term: request.term, table: $('#search_table').val() }, 
              		response);
  				},
                minLength: 3,
                select: function(event, ui) {
                	window.location = prefix+'search.html';
        		}
            });
         });
         
    $("form").on("submit", function (e) {
    e.preventDefault();
    });
	  $("#autocompleteForm").submit(function(){do_search();});
      $("#table").change(function(){do_search();});
      $("#page_size").change(function(){do_search();});
      $("#term").on('keyup change',function(){reset_toggle();});
      $("#wildcards").change(function(){toggle_wildcards();});
      $(function() {
          $("#term").autocomplete({
                source: function(request, response) {
    				$.getJSON("autocomplete", { term: request.term, table: $('#table').val() }, 
              		response);
  				},
                minLength: 3,
                select: function(event, ui) {
                	do_search(ui.item.value);
        		}
            });
         });
    
      $(function() {
        $.ajax({
          type: "GET",
          url: "autocomplete",
          data: {list:'tables'},
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(msg) {
          	  $("#table").get(0).options.length = 0;
              $("#table").get(0).options[0] = new Option("All", "multi");   
              $.each(msg, function(index, item) {
              	  $("#table").get(0).options[$("#table").get(0).options.length] = new Option(item, item);
              });
          },
          error: function() {
        	  $("#table").get(0).options.length = 0;
              $("#table").get(0).options[0] = new Option("All", "multi");   
              console.log("Error: failed to load tables");
          }
        });
        return false;
      });
    } 
    function do_search(search_term){
    	  search_term = search_term ? search_term : $('#term').val();
    	  if (!search_term) return;
    	  console.log(search_term);
    	  var offset = $('#offset') ? $('#offset').val() : 1;
    	  $.ajax({
            type: "GET",
            url: "search",
            data: { term: search_term, table: $('#table').val(), page_size: $('#page_size').val(), offset: offset },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
            		show_results(msg);
            },
            error: function(error) {
            	  console.log("Error: failed to execute search");
            	  console.log(error);
            }
           });
        }

function show_results (msg){  
	$('#results').empty();
	var results_txt = msg.count != 1 ? 'results' : 'result';
	var page_size = $('#page_size').val()
	$('#results').append('<div>' + msg.count + ' ' + results_txt + ':</div>');
	if (msg.count > page_size){
		var pages = Math.ceil(msg.count / page_size);
		var page = msg.page;
		$('#results').append('<div id="pages"> page <select id="offset"/> of ' + pages + '</div>');
		for (var p = 1; p <= pages; p++){
			var sel = p == page ? true : false;
			$('<option/>', {	text: p,
								value: (p-1)*page_size+1,
								selected: sel
							}).appendTo($('#offset'));
		}
	}
	$('#offset').change(function(){do_search()});
	$.each(msg.results, function(index, item) {
		$('#results').append('<div class="lbs_result" id="result_'+index+'">');
		if (item.gene && item.gene.stable_id){
			var url = base_url + '/' + item.gene.production_name;
			var gene_url = url + '/Gene/Summary?db=core;g=' + item.gene.stable_id;
			var header = '<div class="lbs_species">' + item.gene.production_name + '</div> <span class="lbs_large"><a href="' + gene_url + '"> ' + item.gene.stable_id + '</a></span>';
			if (item.gene.description){
				header += ' - <span>' + item.gene.description + '</span>';
			}
			$('#result_'+index).append('<div class="lbs_result_header">' + header + '</div>');
			if (item.gene.dbs){
				$('#result_'+index).append('<div id="result_'+index+'_xrefs" class="lbs_xrefs"></div>');
				$.each(item.gene.dbs, function(db_i, db_item) {
					db_i = db_i.toString().hashCode();
					$('#result_'+index+'_xrefs').append('<div id="result_'+index+'_'+db_i+'" class="lbs_xrefs_db"><span class="lbs_xrefs_db_name">' + db_item + '</span></div>');
					$.each(item.gene[db_item], function(x_i, x_item) { 
						x_i = x_i.toString().hashCode();
						$('#result_'+index+'_'+db_i).append('<div id="result_'+index+'_'+db_i+'_'+x_i+'" class="lbs_xrefs_entry"></div>');
						$('#result_'+index+'_'+db_i+'_'+x_i).append('<span class="lbs_xref">' + x_item.display_label + '</span>');
						if (x_item.description){
							$('#result_'+index+'_'+db_i+'_'+x_i).append('<span class="lbs_xref_desc"> - ' + x_item.description + '</span>');
						}
					});
				});
			}
			if (item.gene.location){
				var loc_url = url + '/Location/View?db=core;r=' + item.gene.location;
				$('#result_'+index).append('<div class="lbs_location">Location: <a href="' + loc_url + '">' + item.gene.location + '</a></div>');
			}
			if (item.gene.transcripts){
				var transcripts = item.gene.transcripts.length != 1 ? 'Transcripts' : 'Transcript';
				$('#result_'+index).append('<div id="result_'+index+'_transcripts" class="lbs_transcripts"></div>');
				$('#result_'+index+'_transcripts').append('<span class="lbs_transcripts_title">' + transcripts +':</span>');
				$.each(item.gene.transcripts.stable_ids, function(tsc_i, tsc_item) {
					var tsc_url = url + '/Transcript/Summary?db=core;t=' + tsc_item;
					$('#result_'+index+'_transcripts').append('<span class="lbs_transcript"><a href="' + tsc_url +'">' + tsc_item + '</a></span>');
				});
				if (item.gene.transcripts.dbs){
					$('#result_'+index).append('<div id="result_'+index+'_tsc_xrefs" class="lbs_xrefs"></div>');
					$.each(item.gene.transcripts.dbs, function(db_i, db_item) {
						db_i = db_i.toString().hashCode();
						$('#result_'+index+'_tsc_xrefs').append('<div id="result_'+index+'_tsc_'+db_i+'" class="lbs_xrefs_db"><span class="lbs_xrefs_db_name">' + db_item + '</span></div>');
						$.each(item.gene.transcripts[db_item], function(x_i, x_item) { 
							x_i = x_i.toString().hashCode();
							$('#result_'+index+'_tsc_'+db_i).append('<div id="result_'+index+'_tsc_'+db_i+'_'+x_i+'" class="lbs_xrefs_entry"></div>');
							$('#result_'+index+'_tsc_'+db_i+'_'+x_i).append('<span class="lbs_xref">' + x_item.display_label + '</span>');
							if (x_item.description){
								$('#result_'+index+'_tsc_'+db_i+'_'+x_i).append('<span class="lbs_xref_desc"> - ' + x_item.description + '</span>');
							}
						});
					});
				}
			}
		}
		if (item.gene.translations){
			var translations = item.gene.translations.length != 1 ? 'Translations' : 'Translation';
			$('#result_'+index).append('<div id="result_'+index+'_translations" class="lbs_translations"></div>');
			$('#result_'+index+'_translations').append('<span class="lbs_translations_title">' + translations +':</span>');
			$.each(item.gene.translations.stable_ids, function(tsl_i, tsl_item) {
				var tsl_url = url + '/Transcript/ProteinSummary?db=core;t=' + item.gene.translations[tsl_item];
				$('#result_'+index+'_translations').append('<span class="lbs_translation"><a href="' + tsl_url +'">' + tsl_item + '<\a></span>');
			});
			if (item.gene.translations.dbs){
				$('#result_'+index).append('<div id="result_'+index+'_tsl_xrefs" class="lbs_xrefs"></div>');
				$.each(item.gene.translations.dbs, function(db_i, db_item) {
					db_i = db_i.toString().hashCode();
					$('#result_'+index+'_tsl_xrefs').append('<div id="result_'+index+'_tsl_'+db_i+'" class="lbs_xrefs_db"><span class="lbs_xrefs_db_name">' + db_item + '</span></div>');
					$.each(item.gene.translations[db_item], function(x_i, x_item) { 
						x_i = x_i.toString().hashCode();
						$('#result_'+index+'_tsl_'+db_i).append('<div id="result_'+index+'_tsl_'+db_i+'_'+x_i+'" class="lbs_xrefs_entry"></div>');
						$('#result_'+index+'_tsl_'+db_i+'_'+x_i).append('<span class="lbs_xref">' + x_item.display_label + '</span>');
						if (x_item.description){
							$('#result_'+index+'_tsl_'+db_i+'_'+x_i).append('<span class="lbs_xref_desc"> - ' + x_item.description + '</span>');
						}
					});
				});
			}
		}
		if (item.seq_region && item.seq_region.name){
			var url = base_url + '/' + item.seq_region.production_name;
			var region_url = url + '/Location/View?db=core;r=' + item.seq_region.name + ':1-' + item.seq_region.length;
			var header = '<div class="lbs_species">' + item.seq_region.production_name + '</div> <span class="lbs_large"><a href="' + region_url + '"> ' + item.seq_region.name + '</a></span>';
			header += ' - ' + item.seq_region.seq_length + 'bp';
			$('#result_'+index).append('<div class="lbs_result_header">' + header + '</div>');
			if (item.seq_region.synonyms){
				var synonyms = item.gene.synonyms.length != 1 ? 'Synonyms' : 'synonym';
				$('#result_'+index).append('<br/><span class="lbs_large">' + synonyms +' -</span>');
				$.each(item.seq_region.synonyms, function(syn_i, syn_item) {
					$('#result_'+index).append(' ' + syn_item);
				});
			}
		}
	});
         
         
    }
    
       function toggle_wildcards(){
    	  search_term = $('#term').val();
    	  if (search_term.match(/^%/) || search_term.match(/%$/)){
    	  	  search_term = search_term.replace(/^%/,'');
    	      search_term = search_term.replace(/%$/,'');
    	  }
    	  else {
    	      search_term = '%' + search_term + '%';
    	  }
          $('#term').val(search_term);
        }
    function reset_toggle(){
    	  search_term = $('#term').val();
    	  if (search_term.match(/^%/) || search_term.match(/%$/)){
    	  	  $('#wildcards').prop('checked',true); 
    	  }
    	  else {
    	      $('#wildcards').prop('checked',false); 
    	  }
        }