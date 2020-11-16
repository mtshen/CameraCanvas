window.onload = function () {
  var canvas = document.getElementsByTagName('canvas')[0],
      context = canvas.getContext('2d'),
      video = document.getElementsByTagName("video")[0],
      snap = document.getElementById("snap"),
      close = document.getElementById("close"),
      start = document.getElementById("start"),
      MediaStreamTrack;
  start.addEventListener('click', function () {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
              video: true,
              audio: true
          }).then(function (stream) {
              console.log(stream);
              MediaStreamTrack=typeof stream.stop==='function'?stream:stream.getTracks()[1];
              video.src=(window.URL).createObjectURL(stream);
              video.play();
          }).catch(function(err){
              console.log(err);
          });
      }else if(navigator.getMedia){
          navigator.getMedia({
              video: true
          }).then(function (stream) {
              console.log(stream);
              MediaStreamTrack=stream.getTracks()[1];
              video.src=(window.webkitURL).createObjectURL(stream);
              video.play();
          }).catch(function(err){
              console.log(err);
          });
      }
  });
  snap.addEventListener('click', function () {
      context.drawImage(video, 0, 0,200,150);
  });
  close.addEventListener('click', function () {
      MediaStreamTrack && MediaStreamTrack.stop();
  });
}
