import { Mensagem } from './../../models/mensagem';
import { SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from './../database/database';
import { Injectable } from '@angular/core';

@Injectable()
export class RegistroDaoProvider {

  constructor(public dbProvider: DatabaseProvider) {
    console.log('RegistroDaoProvider - ENTER');
  }

  public insert(mensagem : Mensagem) {
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'INSERT INTO registros ( frase , sha1sum , datahora ) values(?,?,?)';
        let data = [mensagem.frase, mensagem.sha1sum, mensagem.dataHora];

        return db.executeSql(sql,data)
                .then(() => console.log('insert : sucesso no executeSQL'))
                .catch(e => console.error('insert : erro no executeSQL ', e));
      })
      .catch(e => console.error('insert : erro no getDB ', e));
  }

  public remove(id : Number){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'DELETE FROM registros WHERE id = ?';
        let data = [id];

        return db.executeSql(sql,data)
          .then(() => console.log('remove : sucesso no executeSQL'))
          .catch(e => console.error('remove : erro no executeSQL ', e));
      })
      .catch(e => console.error('remove : Erro no getDB ', e));
  }

  public get(id : Number) {
    return this.dbProvider.getDB()
    .then((db: SQLiteObject) => {
      let sql = 'SELECT * FROM registros WHERE id = ?';
      let data = [id];

      return db.executeSql(sql,data)
        .then((resultSet: any) => {
          if(resultSet.rows.length > 0){
            let reg = resultSet.rows.item(0);
            let mensagem = new Mensagem();

            mensagem.id = reg.id;
            mensagem.frase = reg.frase;
            mensagem.sha1sum = reg.sha1sum;
            mensagem.dataHora = reg.dataHora;
            return mensagem;
          }
          return null;
        })
        .catch(e => console.error("getRegistro - erro no executeSql", e));
    })
    .catch(e => console.error("getRegistro - erro no getDB", e));
  }

  public getAll(){
    return this.dbProvider.getDB()
      .then((db: SQLiteObject) => {
        let sql = 'SELECT * FROM registros';
        let data: any[] = [];

        return db.executeSql(sql,data)
          .then((resultSet: any) => {
            if(resultSet.rows.length > 0){
              let mensagens : Mensagem[] = [];
              for(let i = 0; i < resultSet.rows.length; i++){
                let reg = resultSet.rows.item(i);
                let mensagem = new Mensagem();

                mensagem.id = reg.id;
                mensagem.frase = reg.frase;
                mensagem.sha1sum = reg.sha1sum;
                mensagem.dataHora = reg.dataHora;

                mensagens.push(mensagem); 
              }
              return mensagens;
            }else{
              return [];
            }
          })
          .catch(e => console.error("getAll - erro no executeSql: ", e));
      })
      .catch(e => console.error("getAll - erro no getDB ", e)
      );
  }
}