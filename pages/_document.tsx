import Document, { Head, Html, Main } from 'next/document'

import DeferNextScript from '@components/DeferNextScript'

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
          <DeferNextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
