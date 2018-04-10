const axios = require('axios');

exports.getImages = async function(postid) {
  let images = [];
  let res;
  let match;
  let postPage = 30;
  res = await axios.get(`https://www.dcard.tw/f/xx/p/${postid}`).catch(err => {
    console.log(err);
  });
  images = images.concat(
    res.data.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.jpg/g)
  );
  images = images.concat(
    res.data.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.jpeg/g)
  );
  images = images.concat(
    res.data.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.png/g)
  );
  images = images.concat(
    res.data.match(/https:\/\/imgur\.dcard\.tw\/[^\.]+\.gif/g)
  );

  while (res.data && !res.data.error && res.data.length > 0) {
    res = await axios
      .get(
        `https://www.dcard.tw/_api/posts/${postid}/comments?after=${postPage}`
      )
      .catch(err => {
        console.log(err);
      });
    res.data.forEach(row => {
      if (row.content) {
        images = images.concat(
          row.content.match(/https:\/\/i\.imgur\.com\/[^\.]+\.jpg/g)
        );
        images = images.concat(
          row.content.match(/https:\/\/i\.imgur\.com\/[^\.]+\.jpeg/g)
        );
        images = images.concat(
          row.content.match(/https:\/\/i\.imgur\.com\/[^\.]+\.png/g)
        );
        images = images.concat(
          row.content.match(/https:\/\/i\.imgur\.com\/[^\.]+\.gif/g)
        );
      }
    });
    postPage += 30;
  }
  images = images.filter(image => !!image);
  images = images.map(image => {
    if (image) {
      return image
        .replace('https://i.imgur.com', '/imgur')
        .replace('https://imgur.dcard.tw', '/imgur');
    }
  });
  return images;
};
