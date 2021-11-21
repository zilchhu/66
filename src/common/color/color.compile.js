const fs = require('fs')

function gen() {
  let data = fs.readFileSync('src/common/color/color.config', 'utf8')

  function lexer(str) {
    let cur = 0

    function* generator() {
      function untilNewLine() {
        let value = ''
        while (cur < str.length && str[cur] != '\r') {
          value += str[cur]
          cur += 1
        }
        return value
      }

      while (cur < str.length) {
        if (str[cur].match(/[A-Z]/)) {
          let value = untilNewLine()
          yield { type: 'color-name', value }
          continue
        }

        if (str[cur].match(/[a-z]/)) {
          untilNewLine()
          continue
        }

        if (str[cur].match(/[1-9]/)) {
          let value = untilNewLine()
          yield { type: 'color-variant', value }
          continue
        }

        if (str[cur] == '#') {
          let value = untilNewLine()
          yield { type: 'color-value', value }
          continue
        }

        cur += 1
      }
    }

    return Array.from(generator())
  }

  function parser(tokens) {
    let cur = 0

    function walk() {
      if (tokens[cur].type == 'color-name') {
        let node = {
          type: 'color',
          value: tokens[cur].value,
          variants: []
        }
        cur += 1

        while (cur < tokens.length && tokens[cur].type != 'color-name') {
          let variant = walk()
          node.variants.push(variant)
        }
        return node
      }

      if (tokens[cur].type == 'color-variant') {
        let node = {
          type: 'variant',
          key: tokens[cur].value,
          value: ''
        }
        cur += 1

        node.value = tokens[cur].value
        cur += 1

        return node
      }

      cur += 1
    }

    let ast = {
      type: 'root',
      colors: []
    }

    while (cur < tokens.length) {
      ast.colors.push(walk())
    }
    return ast
  }

  function codeGen(node, parent) {
    switch (node.type) {
      case 'root':
        return `const Color = {
          ${node.colors.map(codeGen).join(',\n')}
        }`
      case 'color':
        return node.variants.map(variant => codeGen(variant, node.value)).join(`,\n`)
      case 'variant':
        return `${parent.toLowerCase()}${node.key}: '${node.value}'`
    }
  }

  let tokens = lexer(data)
  let ast = parser(tokens)
  let output = codeGen(ast)

  console.log(output)
}


gen()