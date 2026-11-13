/** Ajuda contextual e barra Voltar / ? / Fechar */

export function createHelp(deps) {
  const { icon } = deps;

  const HELP = {
    mapa: {
      title: 'O mapa',
      lead: 'Aqui você vê os problemas que os moradores marcaram em Recife.',
      items: [
        ['Lista ao lado (ou embaixo no celular)', 'Mostra os pontos desta parte do mapa. Toque num item para abrir a ficha.'],
        ['Adicionar ponto', 'Marca um problema novo. O mapa pede o lugar exato.'],
        ['PÂNICO', 'Para um perigo acontecendo agora, como alagamento ou deslizamento.'],
        ['Mais ações', 'Mapa de calor, riscos oficiais, filtros e legenda.'],
        ['Busca', 'Digite o nome do bairro ou do problema.']
      ],
      steps: 'Toque num pino colorido no mapa. A ficha abre com fotos, apoios e o que já aconteceu. Para sair, use Voltar ou o X.'
    },
    detalhe: {
      title: 'Ficha do ponto',
      lead: 'Tudo o que se sabe sobre este problema.',
      items: [
        ['Apoiar', 'Diz que você também vê esse problema. Pode retirar o apoio depois.'],
        ['Enviar foto', 'Mostra como o lugar está. Só entra quem tem conta.'],
        ['Adicionar nota', 'Um recado curto dos moradores.'],
        ['Compartilhar e WhatsApp', 'Manda o ponto para outra pessoa.'],
        ['Street View', 'Abre a foto da rua, quando existir.']
      ],
      steps: 'Leia a ficha de cima para baixo. Se não couber, role a janela. Voltar ou X fecham e mostram o mapa.'
    },
    ranking: {
      title: 'Ranking',
      lead: 'Os problemas com mais apoio dos vizinhos.',
      items: [
        ['A lista', 'Quem está no topo é o que mais gente apoiou.'],
        ['Toque num item', 'Abre a ficha daquele ponto.']
      ],
      steps: 'Use esta tela para ver o que está pesando mais. Voltar leva à tela anterior.'
    },
    votacao: {
      title: 'Votação do mês',
      lead: 'A associação escolhe o que levar ao vereador. Seu voto ajuda a decidir.',
      items: [
        ['As opções', 'São problemas já apoiados. Escolha um.'],
        ['Votar', 'Grava sua escolha neste aparelho.']
      ],
      steps: 'Entre na conta, escolha um problema e confirme.'
    },
    conta: {
      title: 'Sua conta',
      lead: 'Seu nome, seu bairro e o que você já fez no Mutirão.',
      items: [
        ['Bairro', 'As mensagens ao líder usam este bairro. Dá para trocar.'],
        ['Mensagens', 'Recados que você enviou ao líder.'],
        ['Painel do líder', 'Quem organiza o bairro responde por aqui.'],
        ['Sair', 'Apaga a sessão só neste aparelho. Os pontos continuam no mapa.']
      ],
      steps: 'Se ainda não entrou, preencha nome, login, senha e bairro. Nada sai do seu navegador.'
    },
    adicionar: {
      title: 'Novo ponto',
      lead: 'Descreva o problema e confirme o lugar.',
      items: [
        ['Tipo e título', 'Diga o que é, em poucas palavras.'],
        ['Fotos', 'Opcional. Ajudam a associação a reconhecer o lugar.'],
        ['Publicar', 'O ponto aparece no mapa para todo mundo ver.']
      ],
      steps: 'Preencha, confira o bairro e publique.'
    },
    sucesso: {
      title: 'Ponto publicado',
      lead: 'Deu certo. O problema já está no mapa.',
      items: [
        ['Ver no mapa', 'Volta para o pino que você acabou de criar.']
      ],
      steps: 'Toque em voltar ao mapa ou no X.'
    },
    pick: {
      title: 'Escolher o lugar',
      lead: 'O pino amarelo é o lugar do problema. Mova o mapa até ele ficar em cima do ponto certo.',
      items: [
        ['Buscar rua', 'Digite o endereço e escolha na lista.'],
        ['GPS', 'Usa onde você está agora, se o celular permitir.'],
        ['Confirmar local', 'Guarda esse lugar e volta ao formulário.'],
        ['Cancelar', 'Volta sem trocar o lugar, quando você já estava preenchendo uma ficha.']
      ],
      steps: 'Quando o nome do bairro aparecer, confirme. Se estiver fora do Recife, o botão fica desligado.'
    },
    alertas: {
      title: 'Alertas',
      lead: 'O que precisa de atenção agora: pânico, recado ao líder e um atalho para obras.',
      items: [
        ['Pânico', 'Perigos acontecendo neste momento.'],
        ['Mensagem ao líder', 'Um recado para quem organiza o bairro.'],
        ['Obras', 'Obras públicas que os moradores estão acompanhando.']
      ],
      steps: 'Escolha um cartão. Se você for líder do bairro, esta aba abre o seu painel.'
    },
    panico: {
      title: 'Ocorrências de pânico',
      lead: 'Lista de perigos marcados pelos moradores.',
      items: [
        ['Novo alerta', 'Abre o formulário. É preciso ter conta.'],
        ['Um item da lista', 'Mostra o detalhe.']
      ],
      steps: 'Use só para algo acontecendo agora. Problema antigo continua em Adicionar ponto.'
    },
    panicoAdd: {
      title: 'Registrar pânico',
      lead: 'Conte o que está acontecendo e onde.',
      items: [
        ['Tipo e gravidade', 'Ajuda a vizinhança a entender a urgência.'],
        ['Mudar local', 'Abre o mapa para posicionar o pino.'],
        ['Registrar', 'Publica o alerta e mostra no mapa.']
      ],
      steps: 'Preencha, confira o lugar e registre.'
    },
    panicoDetalhe: {
      title: 'Detalhe do alerta',
      lead: 'O que foi registrado nesta ocorrência.',
      items: [
        ['Resolver', 'Quem criou, ou o líder, pode marcar que o perigo passou.']
      ],
      steps: 'Leia o texto e o bairro. Voltar retorna à lista.'
    },
    obras: {
      title: 'Obras públicas',
      lead: 'Obras que a vizinhança está cobrando: no prazo, atrasadas ou paradas.',
      items: [
        ['Registrar obra', 'Inclui órgão, datas e o lugar.'],
        ['Situação', 'O Mutirão calcula sozinho a partir das datas.']
      ],
      steps: 'Toque num cartão para ver o histórico.'
    },
    obraAdd: {
      title: 'Registrar obra',
      lead: 'Cadastre uma obra pública para a vizinhança acompanhar.',
      items: [
        ['Órgão e datas', 'Quem faz e até quando deveria terminar.'],
        ['Local', 'O mapa pede o ponto.'],
        ['Salvar', 'A obra entra na lista e no mapa.']
      ],
      steps: 'Datas no passado deixam a obra como atrasada.'
    },
    obraDetalhe: {
      title: 'Detalhe da obra',
      lead: 'Histórico e situação desta obra.',
      items: [
        ['Atualizar', 'Acrescenta um recado no histórico.'],
        ['Declarar conclusão', 'O órgão disse que acabou. Ainda falta a vizinhança confirmar.'],
        ['Verificar', 'Moradores conferem se realmente terminou.']
      ],
      steps: 'A cor do selo muda conforme as datas e essas confirmações.'
    },
    mensagens: {
      title: 'Mensagem ao líder',
      lead: 'Um recado para a pessoa que organiza o seu bairro.',
      items: [
        ['Caixa de texto', 'Escreva o pedido com palavras simples.'],
        ['Enviar', 'Guarda a mensagem neste aparelho.'],
        ['Resposta', 'Quando o líder responder, um aviso aparece aqui uma vez.']
      ],
      steps: 'Confira o bairro na sua conta. Sem bairro, o líder não encontra o recado.'
    },
    lider: {
      title: 'Painel do líder',
      lead: 'O que os moradores do seu bairro enviaram: alertas, mensagens e obras.',
      items: [
        ['Responder', 'Sua resposta aparece para quem escreveu.'],
        ['Obra', 'Toque no cartão para abrir o detalhe.']
      ],
      steps: 'Só entram itens do bairro escolhido na conta.'
    },
    menu: {
      title: 'Mais ações',
      lead: 'Ajustes do mapa que não cabem nos botões principais.',
      items: [
        ['Ver Recife inteiro', 'Afasta o mapa até a cidade toda.'],
        ['Mapa de calor', 'Pinta os bairros conforme a quantidade de problemas.'],
        ['Riscos oficiais', 'Pontos da Defesa Civil. Não são os pontos dos moradores.'],
        ['Filtrar pontos', 'Escolhe tipos e situações que continuam no mapa.'],
        ['Destacar morros', 'Marca bairros com encosta.'],
        ['Legenda', 'Explica as cores.']
      ],
      steps: 'Toque numa linha para usar. Toque fora ou no X para fechar.'
    },
    filtros: {
      title: 'Filtrar pontos',
      lead: 'Esconde do mapa o que você não quer ver agora. Nada é apagado.',
      items: [
        ['Tipo', 'Alagamento, buraco, lixo e os outros.'],
        ['Situação', 'Sem resposta, paliativo, com a associação, com o vereador ou resolvido.'],
        ['Mostrar tudo', 'Marca todas as caixas de novo.'],
        ['Aplicar', 'Atualiza o mapa.']
      ],
      steps: 'Deixe marcado só o que interessa e toque em Aplicar.'
    },
    entrar: {
      title: 'Por que pedir conta',
      lead: 'Olhar o mapa é livre. Marcar, apoiar, votar e enviar foto pedem um nome.',
      items: [
        ['Entrar', 'Abre a tela da conta.'],
        ['Cancelar', 'Fecha esta janela e não muda nada.']
      ],
      steps: 'A conta deste protótipo fica só neste navegador.'
    },
    legenda: {
      title: 'Legenda',
      lead: 'O que cada cor e cada forma significam no mapa.',
      items: [
        ['Tipo', 'O desenho dentro do pino é o tipo de problema.'],
        ['Situação', 'A forma pequena diz em que pé está a cobrança.'],
        ['Fundo do mapa', 'Morro, outros bairros e cidades vizinhas.']
      ],
      steps: 'Abra a legenda quando esquecer uma cor. Ela não altera o mapa.'
    },
    janela: {
      title: 'Esta janela',
      lead: 'Uma janela por cima do mapa. O que você fizer aqui só vale ao confirmar.',
      items: [
        ['?', 'Explica a janela que está aberta.'],
        ['X', 'Fecha sem aplicar, quando o botão principal ainda não foi usado.']
      ],
      steps: 'Leia o título, preencha se precisar e use o botão colorido para confirmar.'
    }
  };

  function sheetBar(view) {
    const home = view === 'mapa';
    const back = `<button type="button" class="btn ghost sheet-back" id="navBack">${icon('arrow', 'sm')} Voltar</button>`;
    const help = `<button type="button" class="iconbtn help-btn" id="navHelp" aria-label="Ajuda desta tela" title="Ajuda">?</button>`;
    const close = `<button type="button" class="iconbtn" id="navClose" aria-label="Fechar e voltar ao mapa">${icon('close')}</button>`;
    return `<div class="sheet-bar">${home ? '<span class="sheet-hint">Toque num ponto para abrir a ficha.</span>' : back}${help}${home ? '' : close}</div>`;
  }

  function closeHelp() {
    const el = document.querySelector('.help-scrim');
    if (el) el.remove();
  }

  function openHelp(key) {
    const topic = HELP[key] || HELP.janela;
    closeHelp();
    const scrim = document.createElement('div');
    scrim.className = 'scrim help-scrim';
    scrim.innerHTML = `<div class="modal help-modal" role="dialog" aria-modal="true" aria-labelledby="helpTitle">
      <div class="sheet-bar">
        <span class="sheet-hint">Ajuda</span>
        <button type="button" class="btn ghost" id="helpClose">${icon('close')} Fechar ajuda</button>
      </div>
      <h2 id="helpTitle">${topic.title}</h2>
      <p>${topic.lead}</p>
      <h3 class="sec">O que cada parte faz</h3>
      <ul class="help-list">${topic.items.map(([n, t]) => `<li><b>${n}.</b> ${t}</li>`).join('')}</ul>
      <h3 class="sec">Como usar</h3>
      <p>${topic.steps}</p>
    </div>`;
    document.body.appendChild(scrim);
    const close = () => scrim.remove();
    scrim.querySelector('#helpClose').addEventListener('click', close);
    scrim.addEventListener('click', e => { if (e.target === scrim) close(); });
    scrim.querySelector('#helpClose').focus();
  }

  return { openHelp, closeHelp, sheetBar, HELP };
}
