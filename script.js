const dayNamesEn = {
  Montag: 'Monday',
  Dienstag: 'Tuesday',
  Mittwoch: 'Wednesday',
  Donnerstag: 'Thursday',
  Freitag: 'Friday',
  Samstag: 'Saturday',
  Sonntag: 'Sunday'
};

async function loadData() {
  try {
    const response = await fetch('./data/streams.json');
    if (!response.ok) {
      throw new Error(`Datei konnte nicht geladen werden: ${response.status}`);
    }
    const data = await response.json();
    renderPage(data);
  } catch (error) {
    console.error(error);
    document.getElementById('daysGrid').innerHTML = `
      <div class="day-card">
        <div class="day-label">
          <div class="day-name">Fehler</div>
          <div class="day-en">Data</div>
        </div>
        <div class="day-content">
          <div class="stream-category">Die Datei <strong>data/streams.json</strong> konnte nicht geladen werden.</div>
        </div>
      </div>
    `;
  }
}

function renderPage(data) {
  document.title = data.pageTitle || 'Stream Schedule';
  setText('logoThe', data.brand?.logoTop || 'THE');
  setText('logoHotelier', data.brand?.logoMain || 'HOTELIER');
  setText('scheduleTitle', data.header?.title || 'Stream Plan');
  setText('scheduleSubtitle', data.header?.subtitle || 'twitch.tv/thehotelier');
  setText('twitchText', data.footer?.buttonText || 'twitch.tv/thehotelier');
  setText('footerNote', data.footer?.note || 'Check-in täglich zwischen 16:00 & 19:00 Uhr');

  const twitchLink = document.getElementById('twitchLink');
  if (data.footer?.buttonUrl) twitchLink.href = data.footer.buttonUrl;

  const daysGrid = document.getElementById('daysGrid');
  daysGrid.innerHTML = '';

  (data.days || []).forEach((day, index) => {
    const node = createDayCard(day, index);
    daysGrid.appendChild(node);
  });
}

function createDayCard(day, index) {
  const template = document.getElementById('dayCardTemplate');
  const card = template.content.firstElementChild.cloneNode(true);

  card.style.animationDelay = `${0.1 * (index + 1)}s`;
  card.querySelector('.day-name').textContent = day.day || '';
  card.querySelector('.day-en').textContent = day.dayEn || dayNamesEn[day.day] || '';
  card.querySelector('.time-text').textContent = day.time || '';
  card.querySelector('.stream-category').textContent = day.title || '';
  card.querySelector('.stream-tag').textContent = day.tag || 'Live';

  const imageWrap = card.querySelector('.stream-image-wrap');
  const image = card.querySelector('.stream-image');

  if (day.image && day.image.trim() !== '') {
    image.src = day.image;
    image.alt = day.imageAlt || `${day.day} Stream Bild`;
    imageWrap.classList.add('has-image');
  }

  return card;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

loadData();
