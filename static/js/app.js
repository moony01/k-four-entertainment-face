let URL;
const urlMale = "https://teachablemachine.withgoogle.com/models/OjV8A4hkV/";
const urlFemale = "https://teachablemachine.withgoogle.com/models/VXq81IU-K/";
let model, webcam, labelContainer, maxPredictions;
let langType = "";

document.addEventListener('DOMContentLoaded', function() {
  var headerIcon = document.getElementById('header__icon');
  var siteCache = document.getElementById('site-cache');
  var body = document.body;

  Kakao.init('8329cd81f78ef956d4487f90e5a4cd49'); 

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
      location.href = "/kpop-companies-face/";
    } else if(page == "blog") {
      location.href = "/";
    } else {
      window.open("https://mbtichat.info", "_blank");
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

//공유하기 버튼클릭
function fn_sendFB(sns) {
  var thisUrl = ""
  var snsTitle = "";
  var snsDesc = "";
  
  if(!langType == "" || !langType == null || !langType == "ko") {
    thisUrl = "https://moony01.com/kpop-companies-face/"+langType;
    snsTitle = "KPOP COMPANIES FACE TEST";
    snsDesc = "What is my face like in K-POP entertainment companies?";
  } else {
    thisUrl = "https://moony01.com/kpop-companies-face/";
    snsTitle = "KPOP 소속사 얼굴상 테스트";
    snsDesc = "내 얼굴은 K-POP 엔터 소속사중 어떤 얼굴상일까?";
  }

  if( sns == 'facebook' ) {
    var url = "http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(thisUrl);
    window.open(url, "", "width=486, height=286");
  }
  else if( sns == 'twitter' ) {
    var url = "http://twitter.com/share?url="+encodeURIComponent(thisUrl)+"&text="+encodeURIComponent(snsTitle);
    window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
  }
  else if( sns == 'band' ) {
    var url = "http://www.band.us/plugin/share?body="+encodeURIComponent(snsTitle)+"&route="+encodeURIComponent(thisUrl);
    window.open(url, "shareBand", "width=400, height=500, resizable=yes");
  }
  else if( sns == 'kakaotalk' ) {
    // 카카오링크 버튼 생성
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: snsTitle,                    // 제목
          description: snsDesc,               // 설명
          imageUrl: 'https://moony01.com/img/share-img.jpg',  // 썸네일 이미지
          link: {
              mobileWebUrl: thisUrl,
              webUrl: thisUrl
          }
        }
    });
  } else if( sns == 'kakaostory') {
    // 사용할 앱의 JavaScript 키 설정
    Kakao.Story.share({
      url: thisUrl,
      text: snsTitle
    });
  } else if( sns == 'copyurl') {
    var tmp = document.createElement('input');
    var url = thisUrl;
    document.body.appendChild(tmp);
    tmp.value = url;
    tmp.select();
    document.execCommand("copy");
    document.body.removeChild(tmp);
    alert("URL이 복사되었습니다.");
  } 
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
        resultExplain = "#꽃미남, #짙은 쌍커풀, #밝은 인상";
        resultCeleb = "SM 소속 연예인: NCT, 동방신기, 샤이니, 슈퍼주니어, 엑소";
        break;
      case "jyp":
        resultTitle = "JYP상";
        resultExplain = "#무쌍커풀, #매력있는 비주얼";
        resultCeleb = "JYP 소속 연예인: 2PM, 2AM, GOT7, 스트레이 키즈";
        break;
      case "yg":
        resultTitle = "YG상";
        resultExplain = "#개성있는 비주얼, #HIP #스타일리쉬 #쿨한 인상";
        resultCeleb = "YG 소속 연예인: 빅뱅, 위너, 아이콘, 트레저";
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "#다양한 매력";
        resultCeleb = "HYBE 소속 연예인: 방탄소년단, 투모로우바이투게더, 세븐틴, 엔하이픈";
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
        resultExplain = "#토끼상 #최강 비주얼 #밝은 인상";
        resultCeleb = "SM 소속 연예인: 소녀시대, 레드벨벳, 에스파, 에프엑스, 보아";
        break;
      case "jyp":
        resultTitle = "JYP상";
        resultExplain = "#여우상 #매력있는 비주얼";
        resultCeleb = "JYP 소속 연예인: 원더걸스, 트와이스, ITZY, 미쓰에이, 엔믹스";
        break;
      case "yg":
        resultTitle = "YG상";
        resultExplain = "#고양이상 #고급스러운 비주얼";
        resultCeleb = "YG 소속 연예인: 2EN1, 블랙핑크, 이하이, 에픽하이";
        break;
      case "hybe":
        resultTitle = "HYBE상";
        resultExplain = "#개성있는 비주얼 #다양한 매력";
        resultCeleb = "HYBE 소속 연예인: 뉴진스, 르세라핌, 프로미스나인";
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