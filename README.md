# Secretaria Online — Tramitação Digital

Protótipo **100% front-end**, sem backend, para demonstrar à Universidade Rovuma a tramitação digital de processos administrativos entre requerentes, Unidades Orgânicas e Reitoria.

## Executar

Abra `index.html` num navegador ou sirva a pasta com qualquer servidor estático, por exemplo:

```bash
python3 -m http.server 8000
```

## Arquitectura do protótipo

O projecto mantém os dados fictícios e a camada de interface separados:

- `index.html` contém a estrutura institucional da aplicação;
- `assets/app.js` concentra perfis, processo demonstrativo, Unidades Orgânicas e interacções simuladas, permitindo substituir esses dados por uma API posteriormente;
- `assets/styles.css` contém o design responsivo e os componentes visuais reutilizáveis.

Não existe autenticação, base de dados ou backend nesta fase.

## Perfis simulados

O selector **Simular utilizador** permite alternar a interface entre:

- Estudante — Nível I / solicitante;
- Director da FACEE, Director Adjunto Pedagógico, Chefe de Departamento e Director de Curso — Nível II / parecer;
- Gabinete do Reitor e Secretaria da Reitoria;
- Reitor — Nível III / autorização.

Cada perfil recebe apenas as áreas relevantes. Os perfis de parecer vêem **Processos que aguardam a minha intervenção**, enquanto o Reitor vê **Processos aguardando decisão** e as acções de despacho.

## Fluxo demonstrado

O processo fictício `EXP-2026-00125` demonstra uma **Exposição / Pedido dirigido ao Reitor**, submetida por um estudante:

1. O estudante submete a exposição, anexa documentos e recebe o protocolo digital.
2. A Secretaria regista e encaminha o processo ao Gabinete do Reitor.
3. O Gabinete aceita ou devolve o processo e solicita parecer a uma ou várias **Unidades Orgânicas**.
4. O pedido entra na FACEE; o Director encaminha internamente para Director Adjunto Pedagógico, Chefe de Departamento e Director do Curso.
5. O parecer regressa pela cadeia hierárquica até ao Gabinete do Reitor.
6. O Gabinete consolida pareceres de FACEE, DRH, Direcção de Finanças e Faculdade de Direito e encaminha ao Reitor.
7. O Reitor consulta documentos e pareceres, autoriza, recusa, devolve ou solicita parecer adicional; ao autorizar, emite um despacho.
8. O despacho segue para Gabinete, Secretaria e finalmente para notificação do requerente.

A timeline profissional apresenta o histórico completo e assinala de forma inequívoca a etapa actual. A área de selecção de pareceres suporta múltiplas Unidades Orgânicas, para demonstrar fluxos escalonáveis sem assumir uma hierarquia única para toda a instituição.

> Todos os nomes, processos, documentos e estados são fictícios e destinam-se exclusivamente à apresentação do protótipo.
