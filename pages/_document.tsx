import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head></Head>
        <body className='dark'>
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(){var a=document.body.classList;a.remove("dark");var e=localStorage.getItem("theme");e?a.add(e.replace(/"/g,"")):window.matchMedia("(prefers-color-scheme: dark)").matches?a.add("dark"):a.add("light")}()`,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
