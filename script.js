const form = document.querySelector('#calculator-form');
const inputScreen = document.querySelector('#input-screen');
const resultScreen = document.querySelector('#result-screen');
const errorMessage = document.querySelector('#form-error');

const selections = { 'hours-per-day': 5, 'days-per-week': 5 };

document.querySelectorAll('[data-choice]').forEach((group) => {
  group.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    group.querySelectorAll('button').forEach((item) => item.classList.remove('selected'));
    button.classList.add('selected');
    selections[group.dataset.choice] = Number(button.dataset.value);
  });
});

function digitsOnly(value) {
  return value.replace(/[^0-9]/g, '');
}

document.querySelectorAll('input[inputmode="numeric"]').forEach((input) => {
  input.addEventListener('input', () => {
    const digits = digitsOnly(input.value);
    input.value = digits ? Number(digits).toLocaleString('ja-JP') : '';
  });
});

function friendlyNumber(value) {
  const rounded = value >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  return rounded.toLocaleString('ja-JP', { maximumFractionDigits: 1 });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const itemName = document.querySelector('#item-name').value.trim();
  const price = Number(digitsOnly(document.querySelector('#price').value));
  const wage = Number(digitsOnly(document.querySelector('#wage').value));

  if (!itemName || !price || !wage) {
    errorMessage.textContent = '欲しいもの・金額・時給を入力してください。';
    return;
  }

  const hours = price / wage;
  const workDays = hours / selections['hours-per-day'];
  const weeks = workDays / selections['days-per-week'];
  const months = weeks / (52 / 12);

  document.querySelector('#result-heading').textContent = `「${itemName}」`;
  document.querySelector('#result-hours').textContent = friendlyNumber(hours);
  document.querySelector('#result-days').textContent = `約${friendlyNumber(workDays)}日`;
  document.querySelector('#result-weeks').textContent = `約${friendlyNumber(weeks)}週間`;
  document.querySelector('#result-months').textContent = `約${friendlyNumber(months)}ヶ月`;
  document.querySelector('#schedule-copy').textContent = `1日${selections['hours-per-day']}時間・週${selections['days-per-week']}日 働くなら`;

  const longTerm = document.querySelector('#long-term-result');
  if (months >= 12) {
    const totalMonths = Math.round(months);
    const years = Math.floor(totalMonths / 12);
    const remainingMonths = totalMonths % 12;
    longTerm.textContent = `🌱 約${years}年${remainingMonths ? `${remainingMonths}ヶ月` : ''}で届く目安です`;
    longTerm.hidden = false;
  } else {
    longTerm.hidden = true;
  }

  errorMessage.textContent = '';
  inputScreen.hidden = true;
  resultScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelector('#reset-button').addEventListener('click', () => {
  resultScreen.hidden = true;
  inputScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.querySelector('#item-name').focus({ preventScroll: true });
});
