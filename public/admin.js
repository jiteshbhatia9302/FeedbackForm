const loginForm = document.getElementById('loginForm');
const dashboard = document.getElementById('dashboard');
const link1 = document.getElementById('link1');

loginForm.addEventListener('submit', async (e)=>{
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/admin/login',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({username,password})
  });

  const result = await res.json();

  if(result.success){
    loginForm.style.display='none';
    link1.style.display='none';
    dashboard.style.display='block';
    loadSummary();
  } else {
    alert(result.message);
  }
});

async function loadSummary(){
  const res = await fetch('/admin/summary');
  const summary = await res.json();
  const tbody = document.querySelector('#summaryTable tbody');
  tbody.innerHTML = '';

  Object.keys(summary).forEach(subject=>{
    const row = document.createElement('tr');
    row.innerHTML = `<td>${subject}</td><td>${summary[subject].average}</td><td>${summary[subject].count}</td>`;
    tbody.appendChild(row);
  });
}
