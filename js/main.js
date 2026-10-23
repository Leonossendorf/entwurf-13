// Direktbuchung: fuehrt in das bestehende DIRS21-Buchungssystem des Hotels, mit Datum und Personen vorbefuellt.
(function () {
  var BASIS = 'https://reservation.one.dirs21.de/hotel-freye/';
  var anreise = document.getElementById('b-anreise');
  var naechte = document.getElementById('b-naechte');
  var gaeste = document.getElementById('b-gaeste');

  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var heute = new Date(); heute.setHours(12, 0, 0, 0);
  anreise.min = iso(heute);
  anreise.value = iso(heute);
  for (var i = 1; i <= 14; i++) {
    var o = document.createElement('option'); o.value = i; o.textContent = i + (i === 1 ? ' Nacht' : ' Nächte'); naechte.appendChild(o);
  }

  function buchungsLink(start, n, personen) {
    var ende = new Date(start); ende.setDate(ende.getDate() + n);
    var sets = [{ uuid: 'z1', occupancy: { adultCount: personen, children: [] } }];
    return BASIS + 'result?range=' + iso(start) + ',' + iso(ende) + '&sets=' + encodeURIComponent(JSON.stringify(sets)) + '&culture=de-DE&show_results=true&los=' + n;
  }
  function oeffnen(personen) {
    var s = anreise.value ? new Date(anreise.value + 'T12:00:00') : heute;
    if (s < heute) s = heute;
    window.open(buchungsLink(s, +naechte.value || 1, personen || +gaeste.value || 2), '_blank', 'noopener');
  }

  document.getElementById('buchen').addEventListener('submit', function (e) { e.preventDefault(); oeffnen(); });
  document.querySelectorAll('[data-gaeste]').forEach(function (b) {
    b.addEventListener('click', function () { gaeste.value = b.dataset.gaeste; oeffnen(+b.dataset.gaeste); });
  });

  // Gruppenanfrage: im Entwurf nur Zusammenfassung, kein Versand
  var f = document.getElementById('anfrage');
  var ab = f.elements.anreise, bis = f.elements.abreise;
  ab.min = iso(heute); bis.min = iso(heute);
  ab.addEventListener('change', function () { bis.min = ab.value; if (bis.value && bis.value <= ab.value) bis.value = ''; });
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = function (v) { return v ? v.split('-').reverse().join('.') : ''; };
    var ok = f.querySelector('.anfrage-ok');
    ok.innerHTML = '';
    var zeilen = [
      'So käme Ihre Anfrage im Hotel an (im Entwurf wird nichts versendet):',
      d(ab.value) + ' bis ' + d(bis.value) + ', ' + f.elements.ez.value + ' Einzel- und ' + f.elements.dz.value + ' Doppelzimmer, Anlass: ' + f.elements.anlass.value,
      f.elements.name.value + ', ' + f.elements.kontakt.value
    ];
    zeilen.forEach(function (t, i) { var p = document.createElement('p'); if (i === 0) { var b = document.createElement('b'); b.textContent = t; p.appendChild(b); } else p.textContent = t; ok.appendChild(p); });
    ok.hidden = false;
  });
})();
