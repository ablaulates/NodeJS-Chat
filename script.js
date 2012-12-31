var Chat = {
	iosocket: io.connect(":4000"),
	startConnection: function(){
		Chat.iosocket.on('connect', function () {
	 		Chat.setupHome();
		});
	},
	setupHome: function(){
		jQuery("#formlogin").on('submit', function(e){
			e.preventDefault();
			var name = jQuery('#login').val();
			var room = jQuery('#room').val();
			Chat.showChat(name,room);
		});

		jQuery('.room-box').on('click', '.password-room', function(e){
			e.preventDefault();
			if(!jQuery(this).hasClass('generated')){
				var pass = Math.round(Math.random()*100000);
				jQuery(this).html(pass).addClass('generated');
				Chat.iosocket.emit('setRoom', pass);
			}
		});
	},
	startChat: function(name,room){
		var user = {
			name: name,
			room: room
		};
		
		Chat.iosocket.emit('setUser', user);
		Chat.iosocket.on('error', function(msg){
			console.log(msg);
			jQuery('body').remove();
			return false;
		});

		Chat.iosocket.on('message', function(msg) {
			jQuery('#ChatMessages').append(jQuery('<li></li>').text(msg.sender_name + " diz: " + msg.message));
			jQuery("#ChatMessages").scrollTop(jQuery("#ChatMessages")[0].scrollHeight);
		});

		Chat.iosocket.on('disconnect', function() {
			console.log("Você foi desconectado!");
			window.location.reload();
		});

		jQuery('#SendMessage').keypress(function(event) {
			if(event.which == 13) {
				var msg = {
					room: user.room,
					sender_name: user.name,
					message: jQuery('#SendMessage').val()
				}
				event.preventDefault();
				Chat.iosocket.emit('message', msg);
				jQuery('#SendMessage').val('');
			}
		});
	},
	showChat: function(name,room){
		var chatWindow = "<div id='chat'><ul id='ChatMessages'></ul><input type='text' id='SendMessage' placeholder='enviar' /></div><aside><div class='user-online'><span>Pessoas online</span></div><ul id='userList'><li>Comming soon!</li></ul></aside>";
		jQuery("#wrapper.home").html("").removeClass('home');
		jQuery("#wrapper").append(chatWindow).addClass('chat');
		Chat.startChat(name, room);
	}
}
jQuery(function(){
	Chat.setupHome();
});