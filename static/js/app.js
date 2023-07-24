let URL;
const urlMale = "https://teachablemachine.withgoogle.com/models/OjV8A4hkV/";
const urlFemale = "https://teachablemachine.withgoogle.com/models/VXq81IU-K/";
let model, webcam, labelContainer, maxPredictions;

document.addEventListener('DOMContentLoaded', function() {
  var headerIcon = document.getElementById('header__icon');
  var siteCache = document.getElementById('site-cache');
  var body = document.body;

  headerIcon.addEventListener('click', function(e) {
    e.preventDefault();
    body.classList.toggle('with--sidebar');
  });

  siteCache.addEventListener('click', function() {
    body.classList.remove('with--sidebar');
  });
});

//header 메뉴 클릭시 페이지 이동
function fnMovePage(page) {
  if(page == "" || page == null) {
      location.href = "/";
    } else if(page == "blog") {
      location.href = "/";
    } else {
      location.href = "https://mbtichat.info";
    }
}

//언어 변경
function fnChangeLang(lang) {
  langType = lang.value;
  if(langType == "" || langType == null || langType == "ko") {
    location.href = "/";
  } else {
    location.href = "/"+langType;
  }
}

//파일 업로드
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $('.image-upload-wrap').hide();
      $('#loading').show();
      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();
      $('.image-title').html(input.files[0].name);
    };
    reader.readAsDataURL(input.files[0]);
    init().then(()=>{
        predict();
        $('#loading').hide();
    });
  } else {
      removeUpload();
  }
}

//파일 삭제버튼
function removeUpload() {
  //페이지 새로고침
  location.reload();
}

/* ******************************************************************************************
 * FUNCTION
****************************************************************************************** */
//이미지 로드
async function init() {
  if (document.getElementById("gender").checked) {
    URL = urlMale;
  } else {
    URL = urlFemale;
  }
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    var element = document.createElement("div")
    element.classList.add("d-flex");
    labelContainer.appendChild(element);
  }
}
//이미지 로드 결과
async function predict() {
  var image = document.getElementById("face-image")
  const prediction = await model.predict(image, false);
  prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability))
  console.log(prediction[0].className);
  var resultTitle, resultExplain, resultCeleb;
  if (document.getElementById("gender").checked) {
    switch (prediction[0].className) {
      case "sm":
        resultTitle = "SM상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "jyp":
        resultTitle = "JYP상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "yg":
        resultTitle = "YG상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "";
        resultCeleb = "";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  } else {
    switch (prediction[0].className) {
      case "sm":
        resultTitle = "SM상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "jyp":
        resultTitle = "JYP상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "yg":
        resultTitle = "YG상";
        resultExplain = "";
        resultCeleb = "";
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "";
        resultCeleb = "";
        break;
      default:
        resultTitle = "알수없음";
        resultExplain = "";
        resultCeleb = "";
    }
  }
  var title = "<div class='" + prediction[0].className + "-animal-title'>" + resultTitle + "</div>"
  var explain = "<div class='animal-explain pt-2'>" + resultExplain + "</div>"
  var celeb = "<div class='" + prediction[0].className + "-animal-celeb pt-2 pb-2'>" + resultCeleb + "</div>"
  $('.result-messege').html(title + explain + celeb);
  var barWidth;

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability.toFixed(2) > 0.1) {
      barWidth = Math.round(prediction[i].probability.toFixed(2) * 100) + "%";
    } else if (prediction[i].probability.toFixed(2) >= 0.01) {
      barWidth = "4%"
    } else {
      barWidth = "2%"
    }
    var labelTitle;
    switch (prediction[i].className) {
        case "sm":
          labelTitle = "SM상";
          break;
        case "jyp":
          labelTitle = "JYP상";
          break;
        case "yg":
          labelTitle = "YG상";
          break;
        case "hybe":
          labelTitle = "HYBE상";
          break;
        default:
          labelTitle = "알수없음";
    }
    var label = "<div class='agency-label d-flex align-items-center'>" + labelTitle + "</div>"
    var bar = "<div class='bar-container'><div class='" + prediction[i].className + "-box'></div><div class='d-flex justify-content-center align-items-center " + prediction[i].className + "-bar' style='width: " + barWidth + "'><span class='d-block percent-text'>" + Math.round(prediction[i].probability.toFixed(2) * 100) + "%</span></div></div>"
    labelContainer.childNodes[i].innerHTML = label + bar;

    // const classPrediction =
    //     resultName + ": " + prediction[i].probability.toFixed(2);
    // labelContainer.childNodes[i].innerHTML = classPrediction;
  }
}