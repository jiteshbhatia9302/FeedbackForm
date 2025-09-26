
const form = document.getElementById('feedbackForm');
const message = document.getElementById('message');

const slidersInfo = [
  {id:'math', color:'#4CAF50'},
  {id:'science', color:'#2196F3'},
  {id:'english', color:'#FF9800'}
];

slidersInfo.forEach(({id,color})=>{
  const slider = document.getElementById(id);
  const display = document.getElementById(id+'Value');
  const updateSlider = ()=>{
    const valPercent = ((slider.value-slider.min)/(slider.max-slider.min))*100;
    slider.style.setProperty('--val', valPercent+'%');
    slider.style.setProperty('--color', color);
    display.textContent = slider.value;
  }
  slider.addEventListener('input',updateSlider);
  updateSlider();
});

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const math = document.getElementById('math').value;
  const science = document.getElementById('science').value;
  const english = document.getElementById('english').value;

  try {
    const response = await fetch('/feedback',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name, math, science, english})
    });
    const result = await response.json();
    if(response.ok){
      message.textContent = result.message;
      message.classList.remove('error');
      message.classList.add('success');
      form.reset();
      slidersInfo.forEach(({id})=>document.getElementById(id+'Value').textContent=3);
    } else {
      message.textContent = result.message;
      message.classList.remove('success');
      message.classList.add('error');
    }
  } catch(err){
    message.textContent = "An unexpected error occurred.";
    message.classList.remove('success');
    message.classList.add('error');
    console.error(err);
  }
});
