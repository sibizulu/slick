
var SLICK = SLICK || {};

SLICK.chatter = {
  slickButton: "slick_send",
  slickMessage: "slick_message",
  slickHistory: 'slick_history',
  slickReady: function(){

    var textMessage = document.getElementById(this.slickMessage);
    textMessage.value = "";
    textMessage.focus();
  },
  slickEnter: function(e){

     e = e || event;
     var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
     return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
  },
  slickChat: function(socket, socketData){

    var message = document.getElementById(this.slickMessage).value;
    var socketObject = {
        "msg" : message,
        "room" : socketData.room,
        "name" : socketData.name
    };
    socket.emit(socketData.type, socketObject);

    var chat_history = document.getElementById(this.slickHistory);
    chat_history.innerHTML += SLICK.theming.userMessageTemplate(socketObject);
    this.slickReady();
  }
};


SLICK.theming = {

    userMessageTemplate : function(message) {

      var template = '<div class="chat-message clearfix">';
      template += '<img src="http://lorempixum.com/32/32/people" alt="" width="32" height="32">';
      template += '<div class="chat-message-content clearfix">';
      template += '<span class="chat-time">13:35</span>';
      template += '<h5>' + message.name +'</h5>';
      template += '<p>' + message.msg + '</p>';
      template += '</div></div>';

      console.log(template);

      return template;
    }
};


var socket = io.connect();


$('#' + SLICK.chatter.slickButton).on("click", function(event) {
  event.preventDefault();

  var socketData = {
    type : "usersChat",
    room : "croom",
    name : "Testing RP"
  };

  SLICK.chatter.slickChat(socket, socketData);

});


 // function fitChat() {
 //    $('.chatter_convo').scrollTop($('.chatter_convo')[0].scrollHeight);
 //    $('#chatter_message').focus();
 //  }

  // $('#sendchat').click(function() {
  //   var thisChat = $('#chatter_message').val();
  //   if( thisChat === '' ) {
  //     return false;
  //   }
  //   //Get chatter details
  //   var cname = store.get('cname'),
  //   cemail = store.get('cemail'),
  //   croom = store.get('croom'),
  //   cpic = store.get("cpic");
  //   socket.emit('usersChat', {"msg":thisChat, "room":croom, "chatter_name":cname});
  //   var thisChatHtml = "<span class='chatter_msg_item chatter_msg_item_user clearfix'>\
  //   <span class='chatter_avatar'><img src='"+cpic+"' /></span>\
  //   <strong class='chatter_name'>"+cname+"</strong>"+thisChat+"</span>";

  //   $('.chatter_convo').append(thisChatHtml);
  //   $('#chatter_message').val('');
  //   fitChat();
  // });
