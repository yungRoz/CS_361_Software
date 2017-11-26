var step = 0;
var explainText = document.getElementById('explain');
var btn;
var btnTextColorDefault;
const btnBgColorActive = "#28a745";
const btnTextColorActive = "white";

function noGuided(){
  document.getElementById('btns').remove();
  explainText.textContent = "Thanks for stopping by, visit this page whenever you need help.";
}

function startGuided(){
  switch (step) {
    case 0:{
      document.getElementById('btns').remove();
      document.getElementById('nextBtn').style.visibility = "visible";
      explainText.textContent = "Welcome to the guided overview of EDGEGATE, we will go over the major functionality of this website.";
      break;
    }
    case 1:{
      setNewActiveButton(btn, 'home');
      explainText.textContent = "This is the Home page. It is your dashboard for progress/notifications and access to the discussion board.";
      break;
    }
    case 2:{
      setNewActiveButton(btn, 'courses');
      explainText.textContent = "This is the Courses page. This is where you can view all the courses that you are currently enrolled in.";
      break;
    }
    case 3:{
      setNewActiveButton(btn, 'projects');
      explainText.textContent = "This is the Projects page. This is where you can view all your active projects for your active course.";
      break;
    }
    case 4:{
      setNewActiveButton(btn, 'profile');
      explainText.textContent = "This is the Profile page. This is where you change your personal account settings.";
      break;
    }
    case 5:{
      setNewActiveButton(btn, 'help');
      explainText.textContent = "This is the Help page. This is where you can go through a guided tour of all the website features.";
      break;
    }
    case 6:{
      setNewActiveButton(btn, 'logout');
      explainText.textContent = "This is the Logout button. This is where you logout out of your session.";
      break;
    }
    case 7:{
      btn.style.backgroundColor = null;
      btn.style.color = btnTextColorDefault;
      document.getElementById('nextBtn').remove();
      explainText.textContent = "This is the end of the guided tour. Stop by whenever you need help.";
      break;
    }
  }
  step++;
}

function setNewActiveButton(oldBtn, newBtnId){
  if(oldBtn){
    btn.style.backgroundColor = null;
    btn.style.color = btnTextColorDefault;
  }

  btn = document.getElementById(newBtnId);
  btnTextColorDefault = btn.style.color;
  btn.style.color = btnTextColorActive;
  btn.style.backgroundColor = btnBgColorActive;
}