const toggle = document.querySelector('#toggle');
const quality = document.querySelector('#quality');
let enabled = true;
let savedQuality = 'max';
function render() {
  toggle.setAttribute('aria-checked', String(enabled));
  document.querySelector('#status').textContent = enabled ? 'Ajuste automático ativado' : 'Controle automático pausado';
  document.querySelector('#description').textContent = enabled ? 'Aplicando sua qualidade preferida' : 'Escolha a qualidade pelo YouTube';
  quality.value = String(savedQuality);
}
function fail() {
  const error = document.querySelector('#error');
  error.hidden = false;
  error.textContent = 'Não foi possível salvar. Feche e abra este painel para tentar novamente.';
}
chrome.storage.local.get({enabled:true, quality:'max'}).then(settings => {
  enabled = settings.enabled !== false;
  savedQuality = [...quality.options].some(option => option.value === String(settings.quality)) ? settings.quality : 'max';
  render(); toggle.disabled = false; quality.disabled = false;
}).catch(fail);
toggle.addEventListener('click', async () => {
  toggle.disabled = true;
  try {
    await chrome.storage.local.set({enabled:!enabled});
    enabled = !enabled; render();
    document.querySelector('#error').hidden = true;
  } catch { fail(); }
  finally { toggle.disabled = false; }
});
quality.addEventListener('change', async () => {
  const next = quality.value === 'max' ? 'max' : Number(quality.value);
  quality.disabled = true;
  try {
    await chrome.storage.local.set({quality:next});
    savedQuality = next;
    document.querySelector('#error').hidden = true;
  } catch { fail(); }
  finally { render(); quality.disabled = false; }
});
