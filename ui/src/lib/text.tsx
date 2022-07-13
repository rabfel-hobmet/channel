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
      let n = false
      //if 'line' is a "" then we ask if 'n' is false. if it is, we make it true, and spit out a single newline <p>
      //any other "" we encounter we ignore, and then when we encounter a line that isnt empty we reset.
      let find_and_reduce_newlines = find_arrows.map((line,i) => {
        let t = line == ""
          ? (n == false ? (n = true, <p  key={`p-newline-${i}`} className="whitespace-pre-line">{"\n"}</p>) : line)
          : (n = false, line)
        return t
      })

      text_processed = find_and_reduce_newlines
    } else {
      text_processed = text_split
    }

    return text_processed
  }