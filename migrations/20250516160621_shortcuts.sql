-- Up

Create Table shortcuts (
  id text not null primary key,
  name text unique not null,
  command text
);

Alter Table userConfig Drop Column shortcuts;

-- Down

Alter Table userConfig
Add Column shortcuts Json Default '{}';

Drop Table shortcuts;
