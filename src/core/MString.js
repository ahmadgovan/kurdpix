/*
 * class for string iterations
 * that is used by MarkdownParser.js
 */

export default class MString {
  constructor(text, start) {
    this.txt = text;
    this.iter = start || 0;
  }

  done() {
    return (this.iter >= this.txt.length);
  }

  moveForward() {
    this.iter += 1;
    return (this.iter < this.txt.length);
  }

  setIter(iter) {
    this.iter = iter;
  }

  getChar() {
    return this.txt[this.iter];
  }

  slice(start, end) {
    return this.txt.slice(start, end || this.iter);
  }

  has(str) {
    return this.txt.startsWith(str, this.iter);
  }

  move(cnt) {
    this.iter += cnt;
    return (this.iter < this.txt.length);
  }

  skipSpaces(skipNewlines = false) {
    for (;this.iter < this.txt.length; this.iter += 1) {
      const chr = this.txt[this.iter];
      if (chr !== ' ' && chr !== '\t' && (!skipNewlines || chr !== '\n')) {
        break;
      }
    }
  }

  countRepeatingCharacters() {
    const chr = this.getChar();
    let newIter = this.iter + 1;
    for (;newIter < this.txt.length && this.txt[newIter] === chr;
      newIter += 1
    );
    return newIter - this.iter;
  }

  moveToNextLine() {
    const lineEnd = this.txt.indexOf('\n', this.iter);
    if (lineEnd === -1) {
      this.iter = this.txt.length;
    } else {
      this.iter = lineEnd + 1;
    }
  }

  getLine() {
    const startLine = this.iter;
    this.moveToNextLine();
    return this.txt.slice(startLine, this.iter);
  }

  getIndent(tabWidth) {
    let indent = 0;
    while (this.iter < this.txt.length) {
      const chr = this.getChar();
      if (chr === '\t') {
        indent += tabWidth;
      } else if (chr === ' ') {
        indent += 1;
      } else {
        break;
      }
      this.iter += 1;
    }
    return indent;
  }

  goToCharInLine(chr) {
    let { iter } = this;
    for (;
      iter < this.txt.length && this.txt[iter] !== '\n'
        && this.txt[iter] !== chr;
      iter += 1
    );
    if (this.txt[iter] === chr) {
      this.iter = iter;
      return iter;
    }
    return false;
  }

  static isWhiteSpace(chr) {
    return (chr === ' ' || chr === '\t' || chr === '\n');
  }

  /*
   * Convoluted way to check if the current ':' is part of a link
   * we do not check for a 'http' because we might support application links
   * like telegram://... or discord://..
   * returns the link or false if there is none
   * moves iter forward to after the link, if there's one
   */
  checkIfLink() {
    let cIter = this.iter;
    if (!this.txt.startsWith('://', cIter) || cIter < 3) {
      return null;
    }

    let linkStart = cIter - 1;
    for (; linkStart >= 0
      && !MString.isWhiteSpace(this.txt[linkStart])
      && this.txt[linkStart] !== '('; linkStart -= 1);
    linkStart += 1;

    cIter += 3;
    /* just some most basic test */
    let dots = 0;
    let slashes = 0;
    for (; cIter < this.txt.length
      && !MString.isWhiteSpace(this.txt[cIter])
      && this.txt[cIter] !== ')'; cIter += 1
    ) {
      if (this.txt[cIter] === '.') {
        if (slashes !== 0) {
          return null;
        }
        dots += 1;
      } else if (this.txt[cIter] === '/') {
        slashes += 1;
      }
    }
    if (!dots || (!slashes && this.txt[cIter - 1] === '.')) {
      return null;
    }

    /* special case where someone pasted a http link after a text
     * without space in between
     */
    let link = this.txt.slice(linkStart, cIter);
    const httpOc = link.indexOf('http');
    if (httpOc !== -1 && httpOc !== 0) {
      linkStart += httpOc;
      link = this.txt.slice(linkStart, cIter);
    }

    this.iter = cIter;
    return link;
  }
}