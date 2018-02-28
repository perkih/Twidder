
window.onload = function() {
    loadView();
};


//check password strenght if okey send data to serverstub
function checkpassword() {
    var form = document.signup;
    var signupObj = {
        'email': form.email.value,
        "password": form.password.value,
        'firstname': form.firstname.value ,
        "familyname": form.familyname.value ,
        "gender": form.gender.value ,
        "city": form.city.value ,
        "country": form.country.value
    }
    if(document.signup.password.value != document.signup.repeatpw.value){
        document.getElementById("error1").innerHTML="password did not match";
        return false;
    }

    if(document.signup.password.value.length < 6) {
        document.getElementById("error1").innerHTML= "Password must contain at least six characters!";
        return false;
    }
    else{
        serverstub.signUp(signupObj);

        return true;
    }
}
//check if email and password exists in serverstub
// if user exists, login the user and create token
function SignIn() {
    var login = document.signin;
    var username = login.username.value;
    var password = login.password.value;
    var response = serverstub.signIn(username, password);


    if(response.success){
        localStorage.setItem("token", response.data)
        getuserinfo();
        loadView();
    }else{
        document.getElementById("error3").innerText = "Username or password incorrect!"

    }

    return false;
}

//load personalinfo and insert info on the wall that is active in profileWall
function getuserinfo() {
    var personaldata = serverstub.getUserDataByToken(localStorage.token).data;

    document.getElementById("personalemail").innerText = personaldata.email;
    document.getElementById("personalfirstname").innerText= personaldata.firstname;
    document.getElementById("personalfamilyname").innerText=personaldata.familyname;
    document.getElementById("personalgender").innerText=personaldata.gender;
    document.getElementById("personalcity").innerText = personaldata.city;
    document.getElementById("personalcountry").innerText=personaldata.country;
    localStorage.setItem("profileWall", personaldata.email);
}


function loadView(){
    if(localStorage.getItem("token") != null){
        document.getElementById("app").innerHTML = document.getElementById('profileView').innerHTML;
        // Get the element with id="defaultOpen" and click on it
        getuserinfo();
        document.getElementById("defaultOpen").click();


    }else
        document.getElementById("app").innerHTML = document.getElementById('welcomeView').innerHTML;

}


function openTab(event, tabName) {

    // Declare all variables
    var i, tabcontent, tablink;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablink = document.getElementsByClassName("tablink");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");

    }


    // Show the current tab, and add an "active" class to the button that opened the tab

    document.getElementById(tabName).style.display = "flex";
    event.currentTarget.className += " active";




}

function changePassword(){
    document.getElementById("error2").innerHTML = "";
    if (document.changepw.newpw.value != document.changepw.repeatpw.value) {
        document.getElementById("error2").innerHTML='password did not match!';
        return false;
    }

    if (document.changepw.newpw.value.length < 6) {
        document.getElementById("error2").innerHTML='Password must contain at least six characters!';
        return false;
    }

    if  (serverstub.changePassword(localStorage.token, document.changepw.oldpw.value, document.changepw.newpw.value).success) {
        document.getElementById("pwchange").innerHTML="password changed";
    }
    else {
        document.getElementById("pwchange").innerHTML="Wrong password";
    }
    document.getElementById("oldpw").value = "";
    document.getElementById("newpw").value= "";
    document.getElementById("repeatpw").value="";
    return false;
}

function signOut() {
    serverstub.signOut(localStorage.token)
    localStorage.removeItem("token");
    loadView();
}
function sendmessageHome() {
    var message = document.wallFormHome.messageHome.value;
    touser = document.getElementById("personalemail").innerText;
    console.log(touser);
    serverstub.postMessage(localStorage.token, message, touser)
    document.getElementById("sendmessageHome").value="";
    updateWall();
    return false;

}
function sendmessageBrowse() {
    var message = document.wallFormbrowse.messagebrowse.value;
    touser = document.getElementById("browseemail").innerText;
    console.log(touser);
    serverstub.postMessage(localStorage.token, message, touser)
    updateWall();
    document.getElementById("sendmessagebrowse").value = "";
    return false;

}
function updateWall() {
    if (document.getElementById("defaultOpen").className == "tablink active") {
        email = document.getElementById("personalemail").innerText;
        var message = serverstub.getUserMessagesByEmail(localStorage.token, email).data;
        console.log(message.length);

        document.getElementById("personalwall").innerText= "";
        for (var i = 0; i < message.length; i++) {
            document.getElementById("personalwall").innerText += message[i].writer + "   says:   " + message[i].content + "\n";

        }
        return false;}

    else {
        browseemail = document.getElementById("browseemail").innerText;
        var messages = serverstub.getUserMessagesByEmail(localStorage.token, browseemail).data;
        console.log(messages.length)
        document.getElementById('browsewall').innerHTML = "";
        for (var i = 0; i < messages.length; i++) {
            document.getElementById("browsewall").innerText += messages[i].writer + "   says:   " + messages[i].content + "\n";

        }
        return false;}
}


function findUser() {
    var userData = serverstub.getUserDataByEmail(localStorage.token, document.finduser.finduserbutton.value)
document.getElementById("userpage").style.display = "flex";

    if (userData.success) {
        var personaldata = userData.data;

        document.getElementById("browseemail").innerText = personaldata.email;
        document.getElementById("browsefirstname").innerText = personaldata.firstname;
        document.getElementById("browsefamilyname").innerText = personaldata.familyname;
        document.getElementById("browsegender").innerText = personaldata.gender;
        document.getElementById("browsecity").innerText = personaldata.city;
        document.getElementById("browsecountry").innerText = personaldata.country;

        // Get the element with id="defaultOpen" and click on it

        var message = serverstub.getUserMessagesByEmail(localStorage.token, document.finduser.finduserbutton.value).data;
        document.getElementById("browsewall").innerText = "";
        for (var i = 0; i < message.length; i++) {
            //console.log(message[i].content);
            document.getElementById("browsewall").innerText += message[i].writer + "   says:   " + message[i].content + "\n";

        }
        return false;
    }
    document.getElementById("error1").innerHTML = "Could not find user"
    return false;
}
