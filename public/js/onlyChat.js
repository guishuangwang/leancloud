function checkNewMessages(){
	$.get(root+'user/checkNewMessages', {}, function(data){
		if (data != '0' && data != 'out' && data != "" && data != " ")
		{
			//got new messages 
			console.log(data+' new messages');
			$('.left_part .top-controls a.messages').css('color','red').addClass('animated seeMePlease');
			
			//play sound
			if(soundPlayed == false)
			{
				myNotif.play();
				soundPlayed = true;
			}
			
			// change title
			document.title = '*** '+data+' NEW MESSAGES ***';
		}
		else if (data == '0'){
			// no new messages
			soundPlayed = false;
			console.log(data+' new messages');
			$('.left_part .top-controls a.messages').css('color','#428bca').removeClass('animated seeMePlease');
			
			// change title
			document.title = pageTitle;
		}
		else if (data == 'out')
		{
			logout();
		}
	});
}

function logout(){
	window.location.replace(root+'user/logout/auto/'+$('.hide.id_user').html());	
}


function nextPage(){
	max_pages = $(".totalPages").text();
	if (current_page < max_pages-1)
	current_page++;
	
	loadConnectedUsers(current_page);
	return false;
}

function prevPage(){
	if (current_page > 0)
	current_page--;
	
	loadConnectedUsers(current_page);
	return false;
}

function refresh(){
	loadConnectedUsers(current_page);
}


function home(){
	active = 'home';
	current_page = 0
	loadConnectedUsers(0);
}


function reloadTopAds(){
	
	var location = 'top';
	var size     = '460x60';
	
	if (refreshAds == 1){	// rotating 4 adslots
		
		if (adOrder >= 5)
		adOrder = 1
		
		if ( ($(window).width() > 991) && ($(window).width() < 1200)){ // medium desktop ads
			size     = '460x60';
			//$('.top_ads').load(root+"ad/loadAd/"+location+"/"+size+"/"+adOrder);	
                        injectAd($('.top_ads'), location, size, adOrder);
		}
		else if ($(window).width() > 1200){ // large desktop ads
			size     = '728x90';
			//$('.top_ads').load(root+"ad/loadAd/"+location+"/"+size+"/"+adOrder);
                        injectAd($('.top_ads'), location, size, adOrder);
		}
	}
	else{ // only one static add slot
		if ( ($(window).width() > 991) && ($(window).width() < 1200)){ // medium desktop ads
			size     = '460x60';
			//$('.top_ads').load(root+"ad/loadAd/"+location+"/"+size+"/1");
                  	injectAd($('.top_ads'), location, size, adOrder);
                  
		}
		else if ($(window).width() > 1200){ // large desktop ads
			size     = '728x90';
                  	//$('.top_ads').load(root+"ad/loadAd/"+location+"/"+size+"/1");
                  	injectAd($('.top_ads'), location, size, adOrder);
                        
		}
	}
}

function injectAd(where, location, size, adOrder)
{
  //$('.top_ads').load(root+"ad/loadAd/"+location+"/"+size+"/"+adOrder);
  var h = 460;
  var w = 60;
  
  if (size == '300x250')
  {
  	h = 250;
  	w = 300;
  	where.html('').append('<div class="col-lg-6"><iframe seamless="seamless" scrolling="no" style="overflow: hidden; border:none; width:'+w+'px; height:'+h+'px;" border=0 width="100%" src="'+root+"ad/loadAd/"+location+"/"+size+"/"+adOrder+'"/></div>').append('<div class="col-lg-6"><iframe seamless="seamless" scrolling="no" style="overflow: hidden; border:none; width:'+w+'px; height:'+h+'px;" border=0 width="100%" src="'+root+"ad/loadAd/"+location+"/"+size+"/"+adOrder+'"/></div>');

  }
  else if (size == '728x90')
  {
  	h = 90;
  	w = 728;
 	where.html('').append('<iframe seamless="seamless" scrolling="no" style="overflow: hidden; border:none; width:'+w+'px; height:'+h+'px;" border=0 width="100%" src="'+root+"ad/loadAd/"+location+"/"+size+"/"+adOrder+'"/>');

  }
  else if (size == '460x60')
  {
  	h = 60;
  	w = 460;
  	where.html('').append('<iframe seamless="seamless" scrolling="no" style="overflow: hidden; border:none; width:'+w+'px; height:'+h+'px;" border=0 width="100%" src="'+root+"ad/loadAd/"+location+"/"+size+"/"+adOrder+'"/>');
  }
}

function reloadBodyAds(){
	
	var location = 'body';
	var size     = '300x250';
	
	if (refreshAds == 1){ // rotating adslot
		
		if (adOrder >= 5)
		adOrder = 1
		
		if ( ($(window).width() > 991) && ($(window).width() < 1200)){ // medium desktop ads
			//$('.medium_and_large').load(root+"ad/loadAd/"+location+"/"+size+"/"+adOrder);
			injectAd($('.medium_and_large'), location, size, adOrder);
		}
		else if ($(window).width() > 1200){ // large desktop ads
			//$('.medium_and_large, .large').load(root+"ad/loadAd/"+location+"/"+size+"/"+adOrder);
			injectAd($('.large'), location, size, adOrder);
		}
	}
	else{ // only one static ad slot
		if ( ($(window).width() > 991) && ($(window).width() < 1200)){ // medium desktop ads
			//$('.medium_and_large').load(root+"ad/loadAd/"+location+"/"+size+"/1");
		}
		else if ($(window).width() > 1200){ // large desktop ads
			//$('.medium_and_large, .large').load(root+"ad/loadAd/"+location+"/"+size+"/1");
		}
	}
}

function showAdsBody(){
	/*** disarearing bug  ***/
	$('.toggle').hide();
	$('.body_ads').show();
	//$('.chat_messages, .alert.alert-success').addClass('hideme').hide();
	$('form#msg').removeClass('hideme').show();
}

function updateActivity(){
	$.get(root+'user/updateActivity/',{}, function(data){
	console.log("activity "+data);
		if (data == 'out')
		logout();
	});
}



$(document).ready( function() {
	refreshAds = 1;
	
	// on load
	//loadConnectedUsers(current_page,'auto');
	//checkNewMessages();
	
	// planified
    //setInterval(function(){updateActivity();}, 5000);
    //setInterval(function(){loadConnectedUsers(current_page,'auto')}, 120000);
    //setInterval(function(){checkNewMessages();}, 30000);
});