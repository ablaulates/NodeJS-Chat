var chat = {
	iosocket: io.connect(":4000"),
	startConnection: function(){
		chat.iosocket.on('connect', function () {
	 		chat.setupHome();
		});
	},
	setupHome: function(){
		jQuery("#formlogin").on('submit', function(e){
			e.preventDefault();
			var name = jQuery('#login').val();
			var room = jQuery('#room').val();
			chat.showChat(name,room);
		});

		jQuery('.room-box').on('click', '.password-room', function(e){
			e.preventDefault();
			if(!jQuery(this).hasClass('generated')){
				var pass = Math.round(Math.random()*100000);
				jQuery(this).html(pass).addClass('generated');
				chat.iosocket.emit('setRoom', pass);
			}
		});
	},
	startChat: function(name,room){
		var user = {
			name: name,
			room: room
		};
		
		chat.iosocket.emit('setUser', user);
		chat.iosocket.on('error', function(msg){
			alert(msg);
			jQuery('body').remove();
			return false;
		});

		chat.iosocket.on('message', function(msg) {
			jQuery('#ChatMessages').append(jQuery('<li></li>').text(msg.sender_name + " diz: " + msg.message));
		});

		chat.iosocket.on('disconnect', function() {
			jQuery('body').remove();
		});

		jQuery('#SendMessage').keypress(function(event) {
			if(event.which == 13) {
				var msg = {
					room: user.room,
					sender_name: user.name,
					message: jQuery('#SendMessage').val()
				}
				event.preventDefault();
				chat.iosocket.emit('message', msg);
				jQuery('#SendMessage').val('');
			}
		});
	},
	showChat: function(name,room){
		var chatWindow = "<div id='chat'><ul id='ChatMessages'></ul><input type='text' id='SendMessage' placeholder='enviar' /></div>";
		jQuery("#wrapper.home").html("").removeClass('home');
		jQuery("#wrapper").append(chatWindow).addClass('chat');
		chat.startChat(name, room);
	}
}
jQuery(function(){
	chat.setupHome();
});