var SLICKADMIN = SLICKADMIN || {};

SLICKADMIN.chatter = {
  slickMail: "slick_mail",
  slickName: "slick_name",
  slickLogin: "slick_login", // Login button
  slickMessage: "slick_message",
  slickSend: "slick_send", // Message sending button
  slickHistory: 'slick_history',
  slickSocketType: {
    user: "usersChat",
    admin: "adminChat"
  },
  slickInit: function(){

    var adminuser = SLICKADMIN.storage.get("adminuser");
    console.log(adminuser);

    if (adminuser !== "undefined"){
       $('#' + SLICKADMIN.chatter.slickLogin + '_wrapper').slideUp();
       $('#' + SLICKADMIN.chatter.slickSend + '_wrapper').slideDown();
    }

    return io.connect();
  },
  slickEnterChat: function(socket, socketData){
   socket.emit('create', socketData.sroom);
  }
};

SLICKADMIN.storage = {

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


$('#' + SLICKADMIN.chatter.slickLogin).on("click", function(event) {
  event.preventDefault();

  var chatter_name = $('#' + SLICKADMIN.chatter.slickName).val(),
      chatter_email = $('#' + SLICKADMIN.chatter.slickMail).val();

  var hash = md5(chatter_email),
      url = "https://secure.gravatar.com/avatar/" + hash + "?d=mm";

  var userdata = {
      "sname": chatter_name,
      "semail": chatter_email,
      "spicture": url
    };

  SLICKADMIN.storage.save("adminuser",userdata);

  var socketData = userdata;
  socketData.type = SLICKADMIN.chatter.slickSocketType.admin;

  $('#' + SLICKADMIN.chatter.slickLogin + '_wrapper').slideUp();
  $('#' + SLICKADMIN.chatter.slickSend + '_wrapper').slideDown();
});


var socket = SLICKADMIN.chatter.slickInit();


