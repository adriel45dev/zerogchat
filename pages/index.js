import { useState } from "react";
import appConfig from "../config.json";
import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import Head from "next/head";
import { useRouter } from "next/router";

function Title({ title, tag }) {
  const Tag = tag;
  return (
    <>
      <Tag>{title}</Tag>
      <style jsx>
        {`
          ${Tag} {
            font-size: 24px;
            font-weight: 600;
            color: ${appConfig.theme.colors.neutrals[100]};
          }
        `}
      </style>
    </>
  );
}

export default function PaginaInicial() {
  const [username, setUsername] = useState("adriel45dev");
  const roteamento = useRouter();

  const getUser = (e) => {
    const input = e.target.value;
    setUsername(input);
  };

  return (
    <>
      <Head>
        <title>Spacecord - Zero G </title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: "url(/images/back-space.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            backgroundColor: appConfig.theme.colors.neutrals[700],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={(e) => {
              e.preventDefault();
              roteamento.push("/chat");
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Image
              src={"images/rocket-launch.svg"}
              styleSheet={{
                width: "96px",
                marginBottom: "16px",
              }}
            />

            <Title tag="h2" title="This is Not Rocket Science!" />

            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
                fontWeight: "600",
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              onChange={getUser}
              value={username}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              disabled={username.length < 2}
              type="submit"
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              backgroundColor: appConfig.theme.colors.neutrals[800],
              border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              src={`https://github.com/${username}.png`}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = "/images/telescope.png";
              }}
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {username}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}
