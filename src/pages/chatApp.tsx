import { useEffect, useState } from "react";
import { collection, getDocs, QuerySnapshot } from "firebase/firestore";
import { Toast } from '@capacitor/toast';
import { db, dbAdd } from "../services/FireBase";
import "./Style.css";
import Logo from "./../img/Logo.png";
import Loading from "../components/load/Load";



interface IMensagem {
  mensagemText: string;
  dataHora: string;
}

const ChatApp = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMensagem[]>([]);
  const [load, setLoad] = useState(false);

  const dataAtual = new Date();

  // Função para formatar a data no formato DD/MM/AAAA
  const formatarData = (data: Date): string => {
    const dia = String(data.getDate()).padStart(2, "0"); // Obtendo o dia com zero à esquerda se necessário
    const mes = String(data.getMonth() + 1).padStart(2, "0"); // Obtendo o mês com zero à esquerda se necessário (lembrando que janeiro é 0)
    const ano = data.getFullYear(); // Obtendo o ano

    return `${dia}/${mes}/${ano}`;
  };

  // Função para formatar a hora no formato 24h (HH:MM)
  const formatarHora = (data: Date): string => {
    const hora = String(data.getHours()).padStart(2, "0"); // Obtendo a hora com zero à esquerda se necessário
    const minutos = String(data.getMinutes()).padStart(2, "0"); // Obtendo os minutos com zero à esquerda se necessário

    // Retornando a hora no formato HH:MM
    return `${hora}h${minutos}`;
  };

  // Função para processar cada documento da consulta
  const processarDocumento = (doc: any): IMensagem => {
    const dataMensagem = doc.data().dataMensagem.toDate(); // Convertendo o _Timestamp para Date
    const dataFormatada = formatarData(dataMensagem); // Formatando a data
    const horaFormatada = formatarHora(dataMensagem); // Formatando a hora

    return {
      mensagemText: doc.data().mensagem,
      dataHora: `${dataFormatada} - ${horaFormatada}`,
    };
  };

  const obterDataHoraFormatada = () => {
    // Obtendo componentes de data e hora
    const dia = String(dataAtual.getDate()).padStart(2, "0");
    const mes = String(dataAtual.getMonth() + 1).padStart(2, "0"); // Meses começam do zero
    const ano = String(dataAtual.getFullYear()).slice(-2); // Pegando os últimos dois dígitos do ano

    // Montando a string no formato DD/MM/AA
    const dataFormatada = `${dia}/${mes}/${ano}`;

    // Obtendo componentes de hora
    const horas = String(dataAtual.getHours()).padStart(2, "0");
    const minutos = String(dataAtual.getMinutes()).padStart(2, "0");

    // Montando a string no formato HH:MM:SS
    const horaFormatada = `${horas}h${minutos}`;

    // Retornando a data e hora formatadas
    return `${dataFormatada} - ${horaFormatada}`;
  };

  // Função principal para consultar o banco de dados
  const dbconsult = async () => {
    const firestore = db();
    let responseData: IMensagem[] = [];

    try {

    
      setLoad(true);
      const querySnapshot: QuerySnapshot = await getDocs(
        collection(firestore, "Conversas")

      );

      // Mapear os documentos e processar cada um
      responseData = querySnapshot.docs.map(processarDocumento);

      setMessages(responseData); // Atualizar o estado com as mensagens formatadas

      await Toast.show({
        text: 'Você está conectado à internet',
         duration: "long",
         position:"top"
      });

    } catch (error) {

      console.error("Erro ao consultar o banco de dados:", error);
      await Toast.show({
        text: 'Erro verifique sua conexão de internet',
         duration: "long",
         position:"top"
      });

    } finally {
      setLoad(false);
    }
  };

  // Função para lidar com mudanças de entrada (input)
  const handleInputChange = (e: any) => {
    // Atualiza o estado 'message' com o valor do campo de entrada alvo
    setMessage(e.target.value);
  };

  // Função para lidar com o envio de mensagem
  const handleSendMessage = () => {
    // Cria um objeto 'objMensagem' com informações da mensagem
    const objMensagem = {
      idUser: "01",
      mensagemText: message,
      dataHora: obterDataHoraFormatada(),
    };

    // Adiciona a mensagem ao banco de dados (dbAdd é uma função que parece estar definida em outro lugar)
    dbAdd("01", message, dataAtual);

    // Verifica se a mensagem não é undefined antes de prosseguir
    if (message !== undefined) {
      // Atualiza o estado 'messages' adicionando a nova mensagem
      setMessages((state) => [...state, objMensagem]);

      // Limpa o estado 'message' após o envio da mensagem
      setMessage("");
    }
  };

  useEffect(() => {
    dbconsult();
  }, []);

  if (load) {
    return <Loading />;
  } else {
    return (
  <div className="containerBox"> 
        <div style={{backgroundColor:"white" }}>
        {/*logo */}
        <div className="center">
          <div className="logo">
            <img src={Logo} alt="Logo super frete" />
          </div>
        
          {/*input */}

          <div>
            <h2 className="titulos">Digite um texto abaixo</h2>
          </div>

          <form className=" inputbox">
            <label className="inputLabel" htmlFor="inputSend">
              {message && "Mensagem *"}
              <textarea
                id="inputSend"
                value={message}
                onChange={handleInputChange}
                placeholder="Insira sua mensagem*"
                style={message ? {} : { marginTop: "10px" }}
              />
            </label>

            <button
              type="submit"
              disabled={message == ""}
              onClick={handleSendMessage}
              className={"buttonSend"}
            >
              Enviar
            </button>
          </form>
       </div>
       </div>
        {/*mensagens */}

        <div style={{height:"60%"}}
      >
        <div id="mensagens">
          {messages.length === 0 ? (
            <div className="vazio">
              <h2 className="titulos">Não há mensagens</h2>
              <p>
                Não há mensagens para exibir no momento. Por favor, escreva uma
                nova mensagem.
              </p>
            </div>
          ) : (
            <>
              <h2 className="titulos">Mensagens enviadas</h2>

              {messages.map((msg, index) => (
                <div className="mensagem" key={index}>
                  <p className="texto">{msg.mensagemText}</p>
                  <span className="data">{msg.dataHora.toString()}</span>
                </div>
              ))}
            </>
          )} 
        </div>

    
      </div>
    </div>
    );
  }
};

export default ChatApp;
