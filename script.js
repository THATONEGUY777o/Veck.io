const code = document.getElementById('activeRoomCode').innerText;
const tempInput = document.createElement('input');
tempInput.value = code;
document.body.appendChild(tempInput);
tempInput.select();
document.execCommand('copy');
document.body.removeChild(tempInput);

const btn = document.getElementById('btnCopyActiveCode');
btn.innerHTML = '<i class="fa-solid fa-check text-emerald-400"></i>';
setTimeout(() => {
    btn.innerHTML = '<i class="fa-regular fa-copy"></i>';
}, 1500);
