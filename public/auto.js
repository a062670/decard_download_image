var postid;
var floor;
var sec;

function go() {
  postid = $('#inputPostid').val();
  floor = $('#inputFloor').val();
  if (postid) {
    $('#inputPostid').attr('disabled', 'disabled');
    $('#inputFloor').attr('disabled', 'disabled');
    $('#button').attr('disabled', 'disabled');
    if (floor) {
      getFloor();
    } else {
      floor = 0;
      getCeil();
    }
  }
}

function getCeil() {
  axios
    .post('/dcard/ceil', {
      postid: postid
    })
    .then(function(response) {
      downloadImage(response.data);
      getFloor();
    })
    .catch(function(error) {
      alert(error);
    });
}

function getFloor() {
  axios
    .post('/dcard/floor', {
      postid: postid,
      floor: floor
    })
    .then(function(response) {
      if (response.data.length == 0) {
        sec = 5;
        computSec();
      } else {
        response.data.forEach(row => {
          floor = row.floor;
          $('#floor').text(floor);
          if (row.content) {
            downloadImage(row.content);
          }
        });
        getFloor();
      }
    })
    .catch(function(error) {
      alert(error);
    });
}

function downloadImage(str, type) {
  let images = [];
  images = images.concat(str.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.jpg/g));
  images = images.concat(str.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.png/g));
  images = images.concat(str.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.gif/g));
  images = images.concat(str.match(/https:\/\/i\.imgur\.com\/[^\.]+\.jpg/g));
  images = images.concat(str.match(/https:\/\/i\.imgur\.com\/[^\.]+\.png/g));
  images = images.concat(str.match(/https:\/\/i\.imgur\.com\/[^\.]+\.gif/g));

  images = images.filter(image => !!image);
  images.forEach(image => {
    image = image
      .replace('https://i.imgur.com', '/imgur')
      .replace('https://imgur.dcard.tw', '/imgur');
    axios
      .get(image, {
        responseType: 'arraybuffer'
      })
      .then(function(response) {
        var blob = new Blob([new Uint8Array(response.data)], {
          type: response.headers['content-type']
        });
        saveAs(blob, image.split('/').slice(-1)[0]);
      })
      .catch(function(error) {
        alert(error);
      });
  });
}

function computSec() {
  $('#sec').text(sec);
  sec--;
  if (sec < 0) {
    getFloor();
  } else {
    setTimeout(computSec, 1000);
  }
}
