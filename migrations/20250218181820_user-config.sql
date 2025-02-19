-- Up

CREATE TABLE userConfig (
  greenBg JSON,
  diceWindow JSON,
  shortcuts JSON
);

INSERT INTO userConfig VALUES ('{}', '{}', '{}');

-- Down

DROP TABLE userConfig;
