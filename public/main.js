
var trash = document.getElementsByClassName("fa-trash");

function deleteResult(_id) {
  fetch('/messages', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      '_id': _id
    })
  }).then(function (response) {
    window.location.reload()
  })
}

