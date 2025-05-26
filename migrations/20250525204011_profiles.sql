-- Up
Create Table profiles (
  id Varchar Primary Key Not Null,
  name Varchar Not Null,
  redEffects Json Default '[]',
  blackEffects Json Default '[]',
  blueEffects Json Default '[]'
);

Insert Into profiles Values (
  '7aebaa6d-5029-4b0b-8ab8-1452641e9f40',
  'Padrão',

  '["Armas Nv.1",\
"Só Escudo","Proibido Curar",\
"Sem Elixir Magnífico","Sem Summon",\
"Sem Cinza da Guerra","Region Lock",\
"Run Genocida","Sem Armadura",\
"Não upar STR/DEX","Não upar INT/FTH/ARC",\
"Não upar HP","Sem Mesa Redonda",\
"Use O Que Ver","Sem Torrent","Sem Mapa",\
"100% Drop Rate","5x Runas","Adiciona 50k de Souls",\
"Inimigos Paralisados"]',

  '["No Hit","Sem Esquiva",\
"Tela Invertida","No Melee",\
"1.5x Velocidade","1/2 DMG -> 2x DEF",\
"2x DMG -> 1/2 DEF","1/2 HP -> 2X VIG",\
"2x HP -> 1/2 VIG","Rerroll All Dice!",\
"No Rush","Sem Talismã","Sem Travar Mira",\
"Fat Roll","Teclado e Mouse","Só Ataque Carregado",\
"Sem Graça Nova","Proibido Upar",\
"Só Ataque com Pulo","One Hit Kill"]',

  '["Remove um Efeito PERMANENTE (D20 Vermelho) já ativo"]'
);

Alter Table userConfig
Add Collumn profileId References profiles (id)
Default '7aebaa6d-5029-4b0b-8ab8-1452641e9f40';

-- Down
Alter Table userConfig Drop Collumn profileId;

Drop Table profiles;
