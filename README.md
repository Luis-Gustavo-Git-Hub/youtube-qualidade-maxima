# YouTube Max

Extensão para Chrome e Brave que tenta manter a maior qualidade disponível no YouTube.

## Recursos

- Maior resolução disponível, incluindo 4K e 8K quando oferecidas.
- Na mesma resolução, prioriza a variante Premium reproduzível de bitrate alto.
- Painel escuro com botão de ativar/desativar e preferência persistente.
- Ao desativar, libera o limite de qualidade para o modo automático.
- Sem coleta de dados ou serviços externos.

## Instalação

1. Baixe o ZIP na seção Releases e extraia.
2. Abra `brave://extensions` ou `chrome://extensions`.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e escolha a pasta com `manifest.json`.
5. Recarregue as abas do YouTube e fixe o ícone para acessar o painel.

## Limitações

4K/8K têm prioridade sobre 1080p Premium. A extensão não libera recursos pagos: a variante Premium deve estar disponível para a conta e o vídeo. Usa funções internas do player, que podem mudar ou ignorar a solicitação. A lógica foi testada com player simulado; falta validação de reprodução real em uma conta Premium. A maior qualidade pode aumentar consumo de dados e causar pausas.

## Código

- `quality.js`: seleção de resolução e formato.
- `bridge.js`: sincronização da preferência com a aba.
- `popup.html`, `popup.css`, `popup.js`: interface.
- `manifest.json`: configuração Manifest V3.

Referências: [Chrome](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts), [YouTube Premium](https://support.google.com/youtube/answer/6308116?hl=pt-BR), [API interna observada no código do YouTube HD Plus](https://greasyfork.org/en/scripts/508784-youtube-hd-plus/code).
