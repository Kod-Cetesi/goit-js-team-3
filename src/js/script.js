// dark / light mode switch

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#myButton');

  if (localStorage.getItem('light-mode') === 'enabled') {
    document.body.classList.add('light-mode');
  }

  btn.addEventListener('click', () => {
    const b = document.body;
    const active = b.classList.toggle('light-mode');

    active
      ? localStorage.setItem('light-mode', 'enabled')
      : localStorage.removeItem('light-mode');
  });
});

// modal - teaser

const modalButton = document.querySelector('.teaser-button');
const modalHeader = document.querySelector('.close-modal');
const modalT = document.querySelector('.teaser-modal-bg');

modalButton.addEventListener('click', () => {
  modalT.style.display = 'flex';
});

modalHeader.addEventListener('click', () => {
  modalT.style.display = 'none';
});
