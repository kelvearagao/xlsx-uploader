import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [data, setData] = useState([]);
  const [publish, setPublish] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      // Supondo que você queira ler a primeira planilha
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Remove o cabeçalho e define o estado com os dados
      const rows = jsonData;
      setData(rows);

      const publish = rows.slice(1).reduce((acc, item) => {
        acc[item[0]] = item[9] === "PUBLICAR";

        return acc;
      }, {});

      setPublish(publish);
    };
    reader.readAsBinaryString(file);
  };

  const handlePublish = useCallback((e) => {
    setPublish((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
      >
        <main className={styles.main}>
          <div>
            <h1>Upload de Arquivo XLSX</h1>
            <br />
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
            />
            <br />
            <br />
            <h2>Dados do Arquivo:</h2>
            <br />
            {data?.length > 0 && (
              <table border={1}>
                <thead>
                  <tr>
                    {data[0].map((item, index) => (
                      <th key={item}>{item.replaceAll("_", " ")}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(1).map(
                    (row, index) =>
                      row?.length > 0 && (
                        <tr key={index}>
                          {Array(data[0].length)
                            .fill({})
                            .map((_, colIndex) => (
                              <td key={colIndex}>
                                {colIndex == 9 ? (
                                  <div>
                                    <input
                                      name={row[0]}
                                      type="checkbox"
                                      checked={publish[row[0]]}
                                      onChange={handlePublish}
                                    />{" "}
                                    Publicar
                                  </div>
                                ) : colIndex == 2 ? (
                                  row[2].toFixed(2)
                                ) : (
                                  row[colIndex]
                                )}
                              </td>
                            ))}
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
