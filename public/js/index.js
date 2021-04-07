const socket = io();

const {name, room} = $.deparam(window.location.search);

socket.on('connect', () => {
  socket.emit('USER_INFO', {name, room});
  const newTemplate = $('#room-title-template').html();
  const html = Mustache.render(newTemplate, {
    room,
  });
  if ($('#room-id').children().length === 0) {
    $('#room-id').append(html);
  }
});

socket.on('disconnect', () => {
  console.log('server down');
});

socket.on('MESSAGE_TO_CLIENT', (msg) => {
  const newTemplate = $('#message-template').html();
  const html = Mustache.render(newTemplate, {
    content: msg.content,
    from: msg.from,
    createdAt: msg.createdAt,
  });

  $('#messages').append(html);
});

// document.getElementById
$('#message-form').on('submit', (e) => {
  e.preventDefault();

  const content = $('[name=message]').val();

  socket.emit('MESSAGE_TO_SERVER', {from: name, content});

  $('[name=message]').val('');
  $('#messages').scrollTop($('#messages').height());
});

$('#message-location').on('click', (e) => {
  if (!navigator.geolocation) alert('Your browser does not support');

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    socket.emit('LOCATION_TO_SERVER', {
      from: name,
      lat,
      lng,
    });
  });
});

socket.on('LOCATION_TO_CLIENT', (msg) => {
  const {lat, lng} = msg;
  const newTemplate = $('#location-template').html();
  const html = Mustache.render(newTemplate, {
    lat: msg.lat,
    lng: msg.lng,
    from: msg.from,
    createdAt: msg.createdAt,
  });

  $('#messages').append(html);
  $('#messages').scrollTop($('#messages').height());
});

socket.on('USERS_IN_ROOM', (msg) => {
  const users = msg.usersInRoom;
  console.log(users);
  const ol = $('<ol></ol>');
  console.log(ol);
  users.forEach((user) => {
    const li = $('<li></li>');
    li.text(user.name);
    ol.append(li);
  });
  $('#users').html(ol);
});
