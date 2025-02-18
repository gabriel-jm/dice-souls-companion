-- Up

CREATE TABLE currentResult (
  value TEXT NOT NULL,
  updatedAt DATE NOT NULL
);

-- Down

DROP TABLE currentResult;
