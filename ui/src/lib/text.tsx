import React from "react"

export function process_text (text) {
    let text_split = text.split("\n")
    let arrowregex = new RegExp('^\>.*$')
    let text_processed

    if (Array.isArray(text_split)) {
      let find_arrows = text_split.map((line, i) => {
        if (arrowregex.test(line)) {
          return <p key={`p-green-${i}`} className="text-chan-green">{line}</p>
        } else {
          return line
        }
      })
      let find_newlines = find_arrows.map((line, i) => {
        let t = line == "" ? <p  key={`p-newline-${i}`} className="whitespace-pre-line">{"\n"}</p> : line
        return t
      })
      text_processed = find_newlines
    } else {
      text_processed = text_split
    }

    return text_processed
  }