root            = '/';
current_page    = 0;
max_pages       = 0;	
myNotif         = $('#myNotif')[0];
soundPlayed     = false;
active          = 'home';
pageTitle       = document.title;
adOrder         = 1;

$(document).ready( function() {
	//id_user = getMyId();
	id_receiver = 0;
	
	// loading the wait loader
	$('.connected_container').css('height','0px').append("<div id='wait'></div>");
	
	
	// if not logged in or id not defined try to grab it again
	/*
	if (id_user == "undefined" || id_user == 0)
		id_user = getMyId();

	*/
	
	// send when form is sent
	$('form#msg').bind('submit', function (e) {
		e.preventDefault();
		sendMsg();
	});
	
	// login form stuff & subscribe form validation on submit
	/*
	$('form.loginNewMemberForm').bind('submit', function (e) {
            var info = $("form.loginNewMemberForm").serialize();
			var username = $(this).find('input[name=username]').val();
			var flag1=false;
			var flag2=false;
			var flag3=false;
			
			if ($(this).hasClass('subscribeForm')){
				var email = $(this).find('#email').val();
				var pwd   = $(this).find('#password_1').val();
				var pwd2  = $(this).find('#password_2').val();
				
				if ((pwd != pwd2) || pwd.length < 6)
				{
					$('#password_1').popover('show');
					$('html, body').animate({
				        scrollTop: $(".navbar").offset().top
				    }, 1000);
				}
				else
					flag1 = true;
				
				if (!IsEmail(email))
				{
					$('#email').popover('show');
					$('html, body').animate({
				        scrollTop: $(".navbar").offset().top
				    }, 1000);
				}
				else
					flag2 = true;
			}
			
			e.preventDefault();
			
			if (!$(this).hasClass('oldMember') && !$(this).hasClass('profile'))
			{
				$.get(root+'user/checkUsedUsernameOut/'+username,{}, function(data){
						
					if (username.length < 6 || data == 'error')
					{
						$('#username').popover('show');
						$('html, body').animate({
					        scrollTop: $(".navbar").offset().top
					    }, 1000);
					}
					else
					{
						flag3 = true;
					}				
					
					// kolchi is valid
					if ($(this).hasClass('subscribeForm')){
						if (flag1 && flag2 && flag3)
						{
							$('form.loginNewMemberForm').unbind('submit').submit();
						}	
					}
					else
					{
						if (flag3)
						{
							$('form.loginNewMemberForm').unbind('submit').submit();
						}
					}	
				});
			}
			else if ($(this).hasClass('profile')){
				// do nothing in update frm
				var x = $(this).serialize();
				
				if (!$(this).hasClass('member')) // normal guest edit profile form 
					$('form.loginNewMemberForm').unbind('submit').submit();
				else{ // member edit pofile form
					var email = $(this).find('#email').val();
					var pwd   = $(this).find('#password_1').val();
					var pwd2  = $(this).find('#password_2').val();
					
					if (pwd.length > 0)
					{
						if ((pwd != pwd2) || pwd.length < 6){
							$('#password_1').popover('show');
							$('html, body').animate({
						        scrollTop: $(".navbar").offset().top
						    }, 1000);
						 }
						 else
						 	flag1 = true;
					}
					else if (pwd.length == 0)
						flag1 = true;
					
					if (!IsEmail(email))
					{
						$('#email').popover('show');
						$('html, body').animate({
					        scrollTop: $(".navbar").offset().top
					    }, 1000);
					}
					else
						flag2 = true;
						
					if (flag1 && flag2)
						$('form.loginNewMemberForm').unbind('submit').submit();
				}
			}
			else{ // registred member login
				var pwd   = $(this).find('#password_1').val();
				if (username.length < 6){
					$('#username').popover('show');
						$('html, body').animate({
					        scrollTop: $(".navbar").offset().top
					    }, 1000);
				}
				else if (pwd.length < 6){
					$('#username').popover('show');
						$('html, body').animate({
					        scrollTop: $(".navbar").offset().top
					    }, 1000);
				}
				else
					$('form.loginNewMemberForm').unbind('submit').submit();
				
			}
			
    });
*/
    
    // fade popover on textfield hovers
    $('#username, #password_1, #email').focus(function(){
	    $(this).popover('hide');
    });
    
    
    // block person handler
    $('.block_person').click(function(){
    	if (confirm('are you sure you want to BLOCK this person?')){
		    var id_partner  = $('.chat_messages .panel .panel-body span').attr('data-id');
		    $.get(root+'user/blockUser/'+id_partner,{},function(data){
		    	refresh();
			    alert('You\'ll no longer receive message from this person again :) ');
		    });
	    }
    });
});

function getCities(country_code){

	if (country_code != 0 && country_code != '' && country_code != undefined)
	{
		$.post(root+'user/getCities/'+country_code,{/*country_code:country_code, selected_city:selected_city*/}, function(data){
			$(".villes").html(data);
			//$(".villes").find("option[value="+selected_city+"]").prop("selected", true);
		});
	}
}

function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function getMyId(){
	$.post(root+"user/getMyId", {}, function(data){
    	return data;
    });
}