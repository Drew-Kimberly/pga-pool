/**
 * Maps some mismatched names from metabet to PGA.
 */
export const playerMap: Record<string, string> = {
  'Joo-hyung Kim': 'Tom Kim',
  'Sebastian Munoz': 'Sebastián Muñoz',
  'Seonghyeon Kim': 'S.H. Kim',
  'Byeong-Hun An': 'Byeong Hun An',
  'Ze-cheng Dou': 'Zecheng Dou',
  'Matthias Schmid': 'Matti Schmid',
  'Nicolas Echavarria': 'Nico Echavarria',
  'Sung-Hoon Kang': 'Sung Kang',
  'Matthys Daffue': 'MJ Daffue',
  'Benjamin Silverman': 'Ben Silverman',
  'Harold Varner': 'Harold Varner III',
  'Robert Macintyre': 'Robert MacIntyre',
  'Samuel Stevens': 'Sam Stevens',
  'Seung-Yul Noh': 'S.Y. Noh',
  'Ludvig Aberg': 'Ludvig Åberg',
  'Thorbjorn Olesen': 'Thorbjørn Olesen',
  'Minwoo Lee': 'Min Woo Lee',
  'Rasmus Hojgaard': 'Rasmus Højgaard',
  'Séamus Power': 'Seamus Power',
  'Sami Välimäki': 'Sami Valimaki',
};

/**
 * PGA Tour Tournament -> Metabet Tournament
 */
export const tournamentMap: Record<string, string> = {
  'arnold palmer invitational presented by mastercard':
    'arnold palmer invitational pres. by mastercard',
  'the memorial tournament presented by workday': 'the memorial tournament pres. by workday',
  'cognizant classic in the palm beaches': 'cognizant classic',
  'the open championship': 'the open',
};
