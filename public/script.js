function download(postid) {
  var images = [];
  document.querySelectorAll('img').forEach(element => {
    images.push(element.src);
  });
  getImage(postid, images, 0);
}

function getImage(postid, images, idx, responses = []) {
  if (idx >= images.length) {
    downloadZip(postid, responses);
    return;
  }
  axios
    .get(images[idx], {
      responseType: 'arraybuffer'
    })
    .then(function(response) {
      responses.push({
        name: images[idx].split('/').slice(-1)[0],
        res: response
      });
      getImage(postid, images, idx + 1, responses);
    })
    .catch(function(error) {
      alert(error);
    });
}

function downloadZip(postid, responses) {
  console.log(responses);
  var zip = new JSZip();
  responses.forEach(response => {
    var blob = new Blob([new Uint8Array(response.res.data)], {
      type: response.res.headers['content-type']
    });
    console.log(blob);
    zip.file(response.name, blob, {});
  });
  zip.generateAsync({ type: 'blob' }).then(
    function(blob) {
      saveAs(blob, postid + '.zip');
    },
    function(err) {
      alert(err);
    }
  );
}
