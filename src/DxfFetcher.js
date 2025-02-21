import DxfParser from "./parser/DxfParser.js"

/** Fetches and parses DXF file. */
export class DxfFetcher {
  constructor(url, encoding = "utf-8") {
    this.url = url;
    this.encoding = encoding;
  }

  /** @param progressCbk {Function} (phase, receivedSize, totalSize) */
  // async Fetch(progressCbk = null) {
  //   const response = await fetch(this.url);
  //   const totalSize = +response.headers.get("Content-Length");

  //   const reader = response.body.getReader();
  //   let receivedSize = 0;
  //   //XXX streaming parsing is not supported in dxf-parser for now (its parseStream() method
  //   // just accumulates chunks in a string buffer before parsing. Fix it later.
  //   let buffer = "";
  //   let decoder = new TextDecoder(this.encoding);
  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) {
  //       buffer += decoder.decode(new ArrayBuffer(0), { stream: false });
  //       break;
  //     }
  //     buffer += decoder.decode(value, { stream: true });
  //     receivedSize += value.length;
  //     if (progressCbk !== null) {
  //       progressCbk("fetch", receivedSize, totalSize);
  //     }
  //   }
  async Fetch(progressCbk = null) {
    // console.log("Fetching " + this.url);
    const response = await fetch(this.url);
    const totalSize = +response.headers.get("Content-Length");
    console.log("Fetched file size: " + totalSize + " bytes");

    // if (progressCbk !== null) {
    //   progressCbk(ImportStatusPhase.parse, 20, totalSize);
    // }

    // const parser = new DxfParser(progressCbk);
    // progressCbk(ImportStatusPhase.parse, 25, null);
    // if (progressCbk !== null) {
    //   progressCbk("parse", 0, null);
    // }
    const parser = new DxfParser();
    // return parser.parseSync(buffer)
    return new Promise((resolve, reject) => {
      try {
        parser.parseStream(response.body, (err, dxf) => {
          if (err) {
            reject(err);
          } else {
            resolve(dxf);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
