import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';

@Injectable()
export class DatabaseProvider {

  constructor(public sqlite: SQLite) {
    console.log('DatabaseProvider ENTER');
  }

  public getDB() {
    return this.sqlite.create({
      name: 'pdmtrabalho.db',
      location: 'default'
    });
  }

  public createDatabase() {
    return this.getDB()
      .then((db: SQLiteObject) => {
        this.createTables(db);
        // this.insertFirstValues(db);
      })
      .catch(e => console.error("Erro no fim createDatabase ", e));
  }

  public createTables(db: SQLiteObject) {
    db.sqlBatch([
      ['CREATE TABLE IF NOT EXISTS registros ( ' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, ' +
        'frase TEXT NOT NULL, ' +
        'sha1sum TEXT NOT NULL, ' +
        'dataHora DATETIME NOT NULL)' ],
    ])
      .then(() => console.log('Tabelas foram criadas com sucesso'))
      .catch(e => console.error('Deu erro na criação da tabela: ', e));
  }

  public insertFirstValues(db: SQLiteObject) {
    db.executeSql('SELECT COUNT(id) AS qtd FROM registros', {})
      .then((resultSet: any) => {
        if (resultSet.rows.item(0).qtd == 0) {
          db.sqlBatch([
            ['INSERT INTO registros(frase,sha1sum,dataHora) values(?,?,?)', ['frase 1','sha1sum 1', new Date()]],
            ['INSERT INTO registros(frase,sha1sum,dataHora) values(?,?,?)', ['frase 2','sha1sum 2', new Date()]],
            ['INSERT INTO registros(frase,sha1sum,dataHora) values(?,?,?)', ['frase 3','sha1sum 3', new Date()]],
            ['INSERT INTO registros(frase,sha1sum,dataHora) values(?,?,?)', ['frase 4','sha1sum 4', new Date()]],
            ['INSERT INTO registros(frase,sha1sum,dataHora) values(?,?,?)', ['frase 5','sha1sum 5', new Date()]]
          ])
            .then(() => console.log('primeiros registros inseridos com sucesso'))
            .catch(e => console.error('Erro no sqlBatch dos primero valores', e));
        } else {
          console.log('Tabela já tem registros iniciais');
        }
      })
      .catch(e => console.error("insertFirstValues : Erro no count", e));
  }

}
