import { Vibration } from '@ionic-native/vibration';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RegistroDaoProvider } from './../../providers/registro-dao/registro-dao';
import { Mensagem } from './../../models/mensagem';
import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  mensagens: Mensagem[];
  mensagem : Mensagem;

  constructor(
    public registroDAO: RegistroDaoProvider, public navCtrl: NavController, 
    private barcodeScanner: BarcodeScanner, private vibration: Vibration,
    private toastCtrl: ToastController, private alertCtrl: AlertController) {}

  ionViewDidEnter(){
    console.log("ionViewDidEnter - ENTER");
    this.getAllMensagens();
  }

  public getAllMensagens(){
    console.log("getAllMensagens - ENTER");
    this.registroDAO.getAll()
      .then((result: Mensagem[]) => {
        console.log(result[0]);
        this.mensagens = result;     
      })
      .catch(e => console.error("Erro no getAllMensagens() : ", e));
  }

  public insert(mensagem : Mensagem) {
    console.log("INSERT - ENTER");
    console.log("insert() :: frase: " + mensagem.frase);
    console.log("insert() :: sha1sum: " + mensagem.sha1sum);
    console.log("insert() :: dataHora: " + mensagem.dataHora);
    
    this.registroDAO.insert(mensagem)
      .then(() => {
        console.log("Sucesso no insert()");
        // this.mensagens = [];
        this.getAllMensagens(); 
      })
      .catch(e => console.error("Erro no insert() : ", e));
  }

  public delete(mensagem : Mensagem) {
    console.log("DELETE - ENTER" + mensagem.id);
    // console.log("delete(id) :: id: " + id);

    this.registroDAO.remove(mensagem.id)
      .then(() => {
        console.log("Sucesso no delete() : " + mensagem.id)
        let index = this.mensagens.indexOf(mensagem);
        console.log("index : " + index);
        this.mensagens.splice(index, 1);
      })
      .catch(e => console.error("Erro no delete() : " + e));
  }

  public info(id : Number) {
    let mensagem : Mensagem;
    this.mensagens.forEach((m) => {
      if(m.id === id) {
        mensagem = m;
      }
    })

    let info : String = "";
    info += "Frase : " + mensagem.frase + "\n";
    info += "Sha1sum : " + mensagem.sha1sum + "\n";
    info += "Data/Hora : " + mensagem.dataHora + "\n";

    this.alertCtrl.create({
      title: 'Informação',
      message: "" + info ,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('OK info');
          }
        },
        {
          text: 'Apagar',
          handler: () => {
            this.delete(mensagem);
          }
        }
      ]
    })
    .present();
  }

  readCode() {
    this.barcodeScanner.scan({resultDisplayDuration: 0, showTorchButton: false, disableSuccessBeep: true})
    .then(barcodeData => {
      let text = barcodeData.text;
      console.log('Barcode data', text);

      if(this.validaCode(text)) {
        console.log("Válido!");
        let mensagem: Mensagem = this.getRegistro(text);
        this.insert(mensagem);
      } else {
        console.log("Inválido!");

        this.toastCtrl.create({
          message: "Código Inválido!",
          duration: 2000,
          position: 'bottom'
        })
        .present()
        .then((e) => this.vibre());
      }
    })
    .catch(err => {
      console.error('Error', err);
    });

  }

  private validaCode(data : String) {
    if(data.includes("Frase:") && data.includes("Sha1sum:")) {
      return true;
    } else {
      return false;
    }
  }

  private getRegistro(data : String) {
    let frase : String;
    let sha1sum : String;
    let dataHora : Date = new Date();
    sha1sum = data.split("Sha1sum:")[1].trim();
    frase = data.split("Sha1sum:")[0].split("Frase:")[1].trim();

    console.log("Frase - " + frase);
    console.log("Sha1sum - " + sha1sum);
    console.log("Data e Hora - " + dataHora);

    let registro : Mensagem = new Mensagem();
    registro.frase = frase;
    registro.sha1sum = sha1sum;
    registro.dataHora = dataHora;

    console.log("Registro : ",registro);

    return registro;
  }

  public vibre() {
    console.log("vibre()");
    this.vibration.vibrate(1000);
  }

}
