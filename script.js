'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const allSections = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');
const header = document.querySelector('.header');


const message = document.createElement('div')
message.classList.add('cookie-message')
message.innerHTML = `we use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>`

header.before(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  // message.remove
  message.parentElement.removeChild(message);
  header.style.paddingTop = 0;
}) 

message.style.backgroundColor = '#37382d'
message.style.width = '100%'
message.style.position = 'fixed'
message.style.bottom = '0%'
message.style.zIndex = 100;

message.style.height = Number.parseFloat(getComputedStyle(message).height) + 20 + 'px'


const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

btnScrollTo.addEventListener('click', function(e){

  // old school of implementing scrolling
  const {x, y}= section1.getBoundingClientRect(); 
  window.scrollTo({left: x + window.pageXOffset,
     top:y + window.pageYOffset,
     behavior: 'smooth'
      });
  // new school of implementing smooth scrolling

  //section1.scrollIntoView({behavior: 'smooth'})
});
/*
document.querySelectorAll('.nav__link').forEach(function(ele){
  ele.addEventListener('click', function(e){
    e.preventDefault()
    
    const section = document.querySelector(this.getAttribute('href'));
    const rect = section.getBoundingClientRect();
    
    window.scrollTo({
      top: rect.y + window.pageYOffset,
      left: rect.x + window.pageXOffset,
      behavior: "smooth"
     })
  })
})
*/

document.querySelector('.nav__links').addEventListener('click' ,function(e){

  e.preventDefault();
  // matching part
  // making sure that event originated from the elements not their parent
  if(e.target != e.currentTarget && !e.target.classList.contains('btn--show-modal')){
    const section = document.querySelector(e.target.getAttribute('href'))
    section.scrollIntoView({
    behavior: 'smooth'
    })
  }
})

const tabContainer = document.querySelector('.operations__tab-container')
const tabs = document.querySelectorAll('.operations__tab')
const tabContent = document.querySelectorAll('.operations__content')

tabContainer.addEventListener('click', function(e){
  // if span part is clicked just change the target to closest parent of operations_tab class (button)
  const clicked = e.target.closest('.operations__tab')
  // matching part
  if(!clicked) return;

  // make all buttons not active 
  tabs.forEach(function(tab){
    tab.classList.remove('operations__tab--active');
  })

  clicked.classList.add('operations__tab--active')
  
  tabContent.forEach(function(ele){
    ele.classList.remove('operations__content--active')
  })
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
  
})



const navigationHoverHandler = function(e){

  if(e.target.classList.contains('nav__link')){
    
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');
    
    siblings.forEach(ele => {
      if(ele != e.target)
        ele.style.opacity = this
    })

    logo.style.opacity = this
  }
}


const nav = document.querySelector('.nav')

nav.addEventListener('mouseover', navigationHoverHandler.bind(0.5))

nav.addEventListener('mouseout', navigationHoverHandler.bind(1))


// sticky navigation 


// old school
/*
const navHeight = Number.parseFloat(getComputedStyle(nav).height);
const section1Start = section1.getBoundingClientRect().y;

window.addEventListener('scroll', function(e){

  if(window.scrollY > section1Start - navHeight){
    nav.classList.add('sticky')
  }
  else{
    nav.classList.remove('sticky')
  }
})
*/
// new school   => Intersection Observer API

const observer = new IntersectionObserver(function(entries){
  const [entry] = entries;
  if(!entry.isIntersecting){
    nav.classList.add('sticky')
  }
  else {
    nav.classList.remove('sticky')
  }
}, {
  root: null,
  threshold: 0,
  rootMargin: `-${getComputedStyle(nav).height}`
});

observer.observe(header)


const sectionsObserver = new IntersectionObserver(function(entries, observer){
  const [entry] = entries;
 if(entry.isIntersecting){
    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)
 }
 
}, {
  root: null,
  threshold: 0.2
})
allSections.forEach((section) => {
  section.classList.add('section--hidden')
  sectionsObserver.observe(section)
})

const featureIImages = document.querySelectorAll('img[data-src]');
const lazyLoadImg = function(entries, observer){
  const entry = entries[0];
  if(!entry.isIntersecting)
    return;

  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function(e) {
    entry.target.classList.remove('lazy-img');   
  })
  observer.unobserve(entry.target);
}



const imgObserver = new IntersectionObserver(lazyLoadImg, {
  root: null,
  threshold: 1,
})

featureIImages.forEach(img => imgObserver.observe(img))

const slides = document.querySelectorAll('.slide')

slides.forEach((slide, i) => slide.style.transform = `TranslateX(${i * 100}%)`)


let state = 0;

const updateSlides = function(){
  
  slides.forEach((slide, i) => slide.style.transform = `TranslateX(${(i - state) * 100}%)`)
}

const slideRightbtn = document.querySelector('.slider__btn--right');
const slideleftbtn = document.querySelector('.slider__btn--left')

slideRightbtn.addEventListener('click', function(e){

  state++;
  
  if(state == slides.length)
    state = 0;
  updateSlides();
})


slideleftbtn.addEventListener('click', function(e){

  state--;
  
  if(state == -1)
    state = slides.length - 1;
  updateSlides();  
})