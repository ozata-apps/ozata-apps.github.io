/* ==========================================================
   OZATA WEBSITE v1.0
========================================================== */

const navbar = document.querySelector(".navbar");

const menuButton = document.getElementById("menuButton");

const mobileMenu = document.getElementById("mobileMenu");

const backTop = document.getElementById("backToTop");

const sections = document.querySelectorAll("section");

const menuLinks = document.querySelectorAll(
".desktop-menu a, .mobile-menu a"
);



/* ==========================================================
NAVBAR SCROLL
========================================================== */

window.addEventListener("scroll",()=>{

if(window.scrollY>40){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

});



/* ==========================================================
MOBILE MENU
========================================================== */

menuButton.addEventListener("click",()=>{

mobileMenu.classList.toggle("active");

menuButton.classList.toggle("active");

});



menuLinks.forEach(link=>{

link.addEventListener("click",()=>{

mobileMenu.classList.remove("active");

menuButton.classList.remove("active");

});

});



/* ==========================================================
BACK TO TOP
========================================================== */

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

backTop.classList.add("show");

}else{

backTop.classList.remove("show");

}

});



backTop.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});



/* ==========================================================
SMOOTH SCROLL
========================================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

const target=document.querySelector(

this.getAttribute("href")

);

if(!target) return;

e.preventDefault();

target.scrollIntoView({

behavior:"smooth",

block:"start"

});

});

});



/* ==========================================================
SCROLL REVEAL
========================================================== */

const revealItems=document.querySelectorAll(

".hero-left,.hero-right,.section-header,.app-card,.about-left,.about-right,.contact-item,.footer-brand"

);

const observer=new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

},

{

threshold:.15

}

);

revealItems.forEach(item=>{

item.classList.add("hidden");

observer.observe(item);

});

/* ==========================================================
ACTIVE MENU
========================================================== */

const activateMenu = () => {

let current = "";

sections.forEach(section => {

const top = section.offsetTop - 120;

const height = section.offsetHeight;

if (window.scrollY >= top &&
    window.scrollY < top + height) {

current = section.getAttribute("id");

}

});

menuLinks.forEach(link => {

link.classList.remove("active");

if (link.getAttribute("href") === "#" + current) {

link.classList.add("active");

}

});

};

window.addEventListener("scroll", activateMenu);



/* ==========================================================
PAGE LOAD
========================================================== */

window.addEventListener("load", () => {

document.body.classList.add("loaded");

activateMenu();

});



/* ==========================================================
LOGO PARALLAX
========================================================== */

const logo = document.querySelector(".logo-card");

window.addEventListener("mousemove", e => {

if (!logo) return;

const x = (window.innerWidth / 2 - e.clientX) / 40;

const y = (window.innerHeight / 2 - e.clientY) / 40;

logo.style.transform =

`rotateY(${x}deg) rotateX(${-y}deg)`;

});



/* ==========================================================
RESET PARALLAX
========================================================== */

window.addEventListener("mouseleave", () => {

if (!logo) return;

logo.style.transform =

"rotateY(0deg) rotateX(0deg)";

});



/* ==========================================================
BUTTON RIPPLE
========================================================== */

document.querySelectorAll(

".primary-button,.secondary-button,.card-button"

).forEach(button=>{

button.addEventListener("click",function(e){

const ripple=document.createElement("span");

const rect=this.getBoundingClientRect();

const size=Math.max(rect.width,rect.height);

ripple.style.width=size+"px";

ripple.style.height=size+"px";

ripple.style.left=

e.clientX-rect.left-size/2+"px";

ripple.style.top=

e.clientY-rect.top-size/2+"px";

ripple.className="ripple";

this.appendChild(ripple);

setTimeout(()=>{

ripple.remove();

},600);

});

});



/* ==========================================================
PREVENT EMPTY LINKS
========================================================== */

document.querySelectorAll('a[href="#"]').forEach(link=>{

link.addEventListener("click",e=>{

e.preventDefault();

});

});



/* ==========================================================
END
========================================================== */