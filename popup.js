const toggle = document.querySelector('#toggle');
let enabled = true;
function render() {
  toggle.setAttribute('aria-checked', String(enabled));
  document.querySelector('#status').textContent = enabled ? 'Qualidade máxima ativada' : 'Controle automático pausado';
  document.querySelector('#description').textContent = enabled ? 'Ajuste automático em todos os vídeos' : 'Escolha a qualidade pelo YouTube';
}
function fail() {
  const error = document.querySelector('#error');
  error.hidden = false;
  error.textContent = 'Não foi possível salvar. Feche e abra este painel para tentar novamente.';
}
chrome.storage.local.get({enabled:true}).then(settings => {
  enabled = settings.enabled !== false;
  render(); toggle.disabled = false;
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
