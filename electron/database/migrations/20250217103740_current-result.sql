-- Up

CREATE TABLE currentResult (
  value JSON NOT NULL,
  updatedAt DATE NOT NULL
);

-- Down

DROP TABLE currentResult;
