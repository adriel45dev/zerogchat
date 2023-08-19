import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import { useState } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";

const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5NzE0NiwiZXhwIjoxOTU4ODczMTQ2fQ.XQMrl5Fx8l60jBRU-An31obkBwd5f6k9ZqCgL4tK9Rw";

const SUPABASE_URL = "https://uwppifzshjofflpalzwb.supabase.co";
const supabaseCliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function listeningRealTimeMessage(adicionaMensagem) {
  return supabaseCliente
    .from("mensagens")
    .on("INSERT", (respostaLive) => {
      adicionaMensagem(respostaLive.new);
    })
    .subscribe();
}

export default function ChatPage() {
  const roteamento = useRouter();
  const loggedUser = roteamento.query.username;
  const [mensagem, setMensagem] = useState("");
  const [listaDeMensagens, setListaDeMensagens] = useState([]);

  React.useEffect(() => {
    supabaseCliente
      .from("mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        setListaDeMensagens(data);
      });

    listeningRealTimeMessage(
      (novaMensagem) => {
        setListaDeMensagens((valorAtualDaLista) => {
          return [novaMensagem, ...valorAtualDaLista];
        });
      }
      // handleNovaMensagem(novaMensagem)
    );
  }, []);

  const handleNovaMensagem = (novaMensagem) => {
    const mensagem = {
      texto: novaMensagem,
      de: loggedUser,
    };
    supabaseCliente
      .from("mensagens")
      .insert([mensagem])
      .then(({ data }) => {});

    setMensagem("");
  };

  const handleDeleteMensagem = (id) => {
    const newData = listaDeMensagens.filter((message) => message.id !== id);

    supabaseCliente
      .from("mensagens")
      .delete()
      .match({ id: id })
      .then(() => {
        setListaDeMensagens(newData);
        console.log("Mensagem apagada com sucesso!");
      });
  };

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(/images/back-space.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      {/* Chat */};
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listaDeMensagens}
            handleDeleteMensagem={handleDeleteMensagem}
          />

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => {
                e.preventDefault();
                setMensagem(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key !== "Enter") return;
                e.preventDefault();
                handleNovaMensagem(mensagem);
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleNovaMensagem(`:sticker:${sticker}`);
              }}
            />
            <Box>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleNovaMensagem(mensagem);
                }}
                type="submit"
                label="✔"
                fullWidth
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: appConfig.theme.colors.primary[500],
                  mainColorLight: appConfig.theme.colors.primary[800],
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
                styleSheet={{
                  borderRadius: "50%",
                  padding: "0 3px 0 0",
                  minWidth: "50px",
                  minHeight: "50px",
                  fontSize: "20px",
                  marginBottom: "8px",
                  lineHeight: "0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: appConfig.theme.colors.primary[800],

                  hover: {
                    filter: "grayscale(0)",
                  },
                }}
                // styleSheet={{
                //   width: "36px",
                //   height: "36px",
                //   borderRadius: "50%",
                //   resize: "none",
                //   backgroundImage: "URL(/images/send.svg)",
                //   backgroundSize: "80%",
                //   backgroundRepeat: "no-repeat",
                //   backgroundPosition: "center",
                // }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList({ mensagens, handleDeleteMensagem }) {
  return (
    <Box
      tag="ul"
      className="chat"
      styleSheet={{
        overflow: "scroll;",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
        overflowX: "hidden",
      }}
    >
      {mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              width: "100%",
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
                alt={mensagem.de}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Button
                onClick={() => {
                  handleDeleteMensagem(mensagem.id);
                }}
                iconName="FaTrashAlt"
                style={{ width: "18px", height: "18px" }}
                styleSheet={{
                  marginLeft: "8px",
                }}
                buttonColors={{
                  contrastColor: "#FFFFFF",
                  mainColor: "#e03131",
                  mainColorLight: "#fa5252",
                  mainColorStrong: "#c92a2a",
                }}
              />
            </Box>

            {mensagem.texto.startsWith(":sticker:") ? (
              <Image
                src={mensagem.texto.replace(":sticker:", "")}
                styleSheet={{ width: "128px" }}
                alt={"sticker"}
              />
            ) : (
              mensagem.texto
            )}
          </Text>
        );
      })}
    </Box>
  );
}
