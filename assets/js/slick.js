
var SLICK = SLICK || {};

SLICK.chatter = {
  slickMail: "slick_mail",
  slickName: "slick_name",
  slickSubject: "slick_subject",
  slickLogin: "slick_login", // Login button
  slickMessage: "slick_message",
  slickSend: "slick_send", // Message sending button
  slickHistory: 'slick_history',
  slickSocketType: {
    user: "usersChat",
    admin: "adminChat"
  },
  slickReady: function(){

    var textMessage = document.getElementById(this.slickMessage);
    var textHistory = document.getElementById(this.slickHistory);
    textHistory.scrollTop = textHistory.scrollHeight;
    textMessage.value = "";
    textMessage.focus();
  },
  slickInit: function(){

    var user = SLICK.storage.get("user");

    // if (user !== "undefined"){
    //   $('#' + SLICK.chatter.slickLogin + '_wrapper').slideUp();
    //   $('#' + SLICK.chatter.slickSend + '_wrapper').slideDown();
    // }


    return io.connect();
  },
  slickEnter: function(e){

     e = e || event;
     var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
     return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
  },
  slickEnterChat: function(socket, socketData){
   socket.emit('create', socketData.sroom);
  },
  slickChat: function(socket, socketData){

    var message = (socketData.init) ? socketData.ssubject : document.getElementById(this.slickMessage).value;

    var socketObject = {
        "msg" : message,
        "room" : socketData.sroom,
        "name" : socketData.sname,
        "spicture" : socketData.spicture,
        "stime": new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1")
    };

   socket.emit(socketData.type, socketData);

  var chat_history = document.getElementById(this.slickHistory);
  chat_history.innerHTML += SLICK.theming.userMessageTemplate(socketObject);
  this.slickReady();
  }
};


SLICK.theming = {

    userMessageTemplate : function(message) {

      var template = '<div class="chat-message clearfix">';
      template += '<img src="' + message.spicture +'" alt="" width="32" height="32">';
      template += '<div class="chat-message-content clearfix">';
      template += '<span class="chat-time">' + message.stime + '</span>';
      template += '<h5>' + message.name +'</h5>';
      template += '<p>' + message.msg + '</p>';
      template += '</div></div>';

      return template;
    }
};

SLICK.storage = {

    save: function (key,value){
        if (typeof(Storage) !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
        console.log("Sorry! No Web Storage support..");
        }
    },
    get: function (key){
        if (typeof(Storage) !== "undefined") {
          return JSON.parse(localStorage.getItem(key));
        } else {
          return 0;
        }
    }
};



var socket = SLICK.chatter.slickInit();
socket.on('message', function(msg){
        console.log(msg);
      });

$('#' + SLICK.chatter.slickLogin).on("click", function(event) {
  event.preventDefault();

  var chatter_name = $('#' + SLICK.chatter.slickName).val(),
      chatter_email = $('#' + SLICK.chatter.slickMail).val(),
      chatter_subject = $('#' + SLICK.chatter.slickSubject).val();

  var hash = md5(chatter_email),
      url = "https://secure.gravatar.com/avatar/" + hash + "?d=mm";

  var userdata = {
      "sname": chatter_name,
      "semail": chatter_email,
      "ssubject": chatter_subject,
      "spicture": url,
      "sroom": md5(chatter_email + chatter_name)
    };

  SLICK.storage.save("user",userdata);

  var socketData = userdata;
  socketData.type = SLICK.chatter.slickSocketType.user;
  socketData.init = 1;

  $('#' + SLICK.chatter.slickLogin + '_wrapper').slideUp();
  $('#' + SLICK.chatter.slickSend + '_wrapper').slideDown();

  SLICK.chatter.slickEnterChat(socket, socketData);
});



$('#' + SLICK.chatter.slickSend).on("click", function(event) {

  event.preventDefault();

  var userdata = SLICK.storage.get("user");

  var socketData = {
    type : SLICK.chatter.slickSocketType.user,
    sroom : userdata.sroom,
    sname : userdata.sname,
    spicture: userdata.spicture,
  };

  SLICK.chatter.slickChat(socket, socketData);
});

