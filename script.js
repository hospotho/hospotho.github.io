;(function () {
  'use strict'

  function initNav() {
    const nav = document.querySelector('nav#menu')
    const width = document.querySelector('section#top').clientWidth
    nav.style.width = width + 'px'
  }

  function initCanvasBackground() {
    function createColorizeGraph() {
      function visitNode(i, j, sub = false) {
        if (visitedNode.has(a2s([i, j]))) return
        visitedNode.add(a2s([i, j]))
        unvisitedNode.delete(a2s([i, j]))
        waitingNode.delete(a2s([i, j]))
        if (graph[i][j] < pRate) return

        coloredGraph[i][j] = count

        if (i % 2) {
          if (unvisitedNode.has(a2s([i - 2, j]))) {
            waitingNode.add(a2s([i - 2, j]))
          }
          if (unvisitedNode.has(a2s([i - 1, j - 1]))) {
            waitingNode.add(a2s([i - 1, j - 1]))
          }
          if (unvisitedNode.has(a2s([i - 1, j]))) {
            waitingNode.add(a2s([i - 1, j]))
          }
          if (unvisitedNode.has(a2s([i + 1, j - 1]))) {
            waitingNode.add(a2s([i + 1, j - 1]))
          }
          if (unvisitedNode.has(a2s([i + 1, j]))) {
            waitingNode.add(a2s([i + 1, j]))
          }
          if (unvisitedNode.has(a2s([i + 2, j]))) {
            waitingNode.add(a2s([i + 2, j]))
          }
        } else {
          if (unvisitedNode.has(a2s([i - 1, j]))) {
            waitingNode.add(a2s([i - 1, j]))
          }
          if (unvisitedNode.has(a2s([i - 1, j + 1]))) {
            waitingNode.add(a2s([i - 1, j + 1]))
          }
          if (unvisitedNode.has(a2s([i, j - 1]))) {
            waitingNode.add(a2s([i, j - 1]))
          }
          if (unvisitedNode.has(a2s([i, j + 1]))) {
            waitingNode.add(a2s([i, j + 1]))
          }
          if (unvisitedNode.has(a2s([i + 1, j]))) {
            waitingNode.add(a2s([i + 1, j]))
          }
          if (unvisitedNode.has(a2s([i + 1, j + 1]))) {
            waitingNode.add(a2s([i + 1, j + 1]))
          }
        }

        while (!sub && waitingNode.size) {
          const [newi, newj] = s2a(waitingNode.values().next().value)
          visitNode(newi, newj, true)
        }
      }
      const createRandomGraph = () => {
        const array = new Array(heightIndex)
        for (let i = 0; i < heightIndex; i += 2) {
          const subArrayH = new Array(widthIndex)
          for (let j = 0; j < widthIndex; j++) {
            subArrayH[j] = Math.random()
          }
          const subArrayV = new Array(widthIndex + 1)
          for (let j = 0; j < widthIndex + 1; j++) {
            subArrayV[j] = Math.random()
          }
          array[i] = subArrayH
          array[i + 1] = subArrayV
        }
        const subArrayH = new Array(widthIndex)
        for (let j = 0; j < widthIndex; j++) {
          subArrayH[j] = Math.random()
        }
        array[heightIndex] = subArrayH
        return array
      }
      const createEmptyGraph = () => {
        const array = new Array(heightIndex)
        for (let i = 0; i < heightIndex; i += 2) {
          const subArrayH = new Array(widthIndex)
          for (let j = 0; j < widthIndex; j++) {
            subArrayH[j] = 0
          }
          const subArrayV = new Array(widthIndex + 1)
          for (let j = 0; j < widthIndex + 1; j++) {
            subArrayV[j] = 0
          }
          array[i] = subArrayH
          array[i + 1] = subArrayV
        }
        const subArrayH = new Array(widthIndex)
        for (let j = 0; j < widthIndex; j++) {
          subArrayH[j] = 0
        }
        array[heightIndex] = subArrayH
        return array
      }
      const a2s = arr => arr[0] * 10000 + arr[1]
      const s2a = num => [(num - (num % 10000)) / 10000, num % 10000]

      const graph = createRandomGraph()
      const coloredGraph = createEmptyGraph()
      const visitedNode = new Set()
      const waitingNode = new Set()
      const unvisitedNode = new Set()

      for (let i = 0; i < heightIndex; i++) {
        for (let j = 0; j < widthIndex + (i % 2); j++) {
          unvisitedNode.add(a2s([i, j]))
        }
      }

      let count = 1
      while (unvisitedNode.size !== 0) {
        const [i, j] = s2a(unvisitedNode.values().next().value)
        const temp = visitedNode.size
        visitNode(i, j)
        if (visitedNode.size > temp + 1) count++
      }

      return coloredGraph
    }
    function drawColorGraph(ctx, location = 0) {
      function getGraphMax(arr) {
        const array = arr.flat()
        let max = array[0]
        for (let i = 0; i < array.length; i++) {
          max = array[i] > max ? array[i] : max
        }
        return max
      }
      const numToColor = num => '#' + Math.floor(16777215 - ((num * 0.9) / max) * 16777215).toString(16)

      const coloredGraph = createColorizeGraph()
      const max = getGraphMax(coloredGraph)
      const left = bodyWidth * location + padding

      ctx.clearRect(left, 0, bodyWidth, bodyHeight)

      for (let i = 0; i < heightIndex; i += 2) {
        const baseY = (i / 2) * pixelSize + padding
        for (let j = 0; j < widthIndex; j++) {
          if (coloredGraph[i][j] === 0) continue
          ctx.beginPath()
          ctx.strokeStyle = numToColor(coloredGraph[i][j])
          const baseX = left + j * pixelSize
          ctx.moveTo(baseX, baseY)
          ctx.lineTo(baseX + pixelSize, baseY)
          ctx.stroke()
        }
        for (let j = 0; j < widthIndex + 1; j++) {
          if (coloredGraph[i + 1][j] === 0) continue
          ctx.beginPath()
          ctx.strokeStyle = numToColor(coloredGraph[i + 1][j])
          const baseX = left + j * pixelSize
          ctx.moveTo(baseX, baseY)
          ctx.lineTo(baseX, baseY + pixelSize)
          ctx.stroke()
        }
      }
      const baseY = (heightIndex / 2) * pixelSize + padding
      for (let j = 0; j < widthIndex; j++) {
        if (coloredGraph[heightIndex][j] === 0) continue
        ctx.beginPath()
        ctx.strokeStyle = numToColor(coloredGraph[heightIndex][j])
        const baseX = left + j * pixelSize
        ctx.moveTo(baseX, baseY)
        ctx.lineTo(baseX + pixelSize, baseY)
        ctx.stroke()
      }
    }

    const pixelSize = 10
    const padding = 20
    const pRate = 0.5

    const bodyWidth = document.documentElement.clientWidth
    const bodyHeight = document.documentElement.clientHeight
    const containerWidth = document.querySelector('section#top').clientWidth

    const canvasWidth = containerWidth - padding * 2
    const canvasHeight = bodyHeight - padding * 2
    const canvasWidthPixels = canvasWidth / pixelSize
    const canvasHeightPixels = canvasHeight / pixelSize

    const widthIndex = Math.ceil(canvasWidthPixels)
    const heightIndex = Math.ceil(canvasHeightPixels * 2)

    const canvas = document.querySelector('canvas#background')
    const ctx = canvas.getContext('2d')
    ctx.canvas.width = bodyWidth * 3
    ctx.canvas.height = bodyHeight

    drawColorGraph(ctx)
    drawColorGraph(ctx, 1)
    drawColorGraph(ctx, 2)

    canvas.style = 'animation: loop ease 16s infinite alternate;'

    const loop = () => {
      const transform = window.getComputedStyle(canvas).transform
      if (transform === 'matrix(1, 0, 0, 1, 0, 0)') {
        drawColorGraph(ctx, 1)
        drawColorGraph(ctx, 2)
      } else {
        drawColorGraph(ctx)
        drawColorGraph(ctx, 1)
      }
    }
    canvas.removeEventListener('animationiteration', loop)
    canvas.addEventListener('animationiteration', loop)
  }

  async function initProjectDiv() {
    function formatDate(date) {
      const d = new Date(date)
      const year = d.getFullYear()
      const month = (d.getMonth() + 1).toString().padStart(2, '0')
      const day = d.getMonth().toString().padStart(2, '0')
      return `${year}/${month}/${day}`
    }

    const projBaseUrl = 'https://api.github.com/repos/hospotho/'
    const projName = ['hospotho.github.io', 'Image-Viewer', 'rangeDeleteBot', 'wf-skill', 'Bitburner-script']
    const spanID = ['homepage', 'image_viewer', 'discord_bot', 'wf_skill', 'bitburner_script']

    const asyncDateList = []
    const asyncCommitList = []
    for (const name of projName) {
      asyncDateList.push(
        fetch(projBaseUrl + name)
          .then(data => data.json())
          .then(json => json.pushed_at)
      )
      asyncCommitList.push(
        fetch(projBaseUrl + name + '/contributors')
          .then(data => data.json())
          .then(json => json[0].contributions)
      )
    }

    const dateList = await Promise.all(asyncDateList)
    const commitList = await Promise.all(asyncCommitList)
    for (let i = 0; i < spanID.length; i++) {
      const dateSpan = document.querySelector(`span#${spanID[i]}Date`)
      dateSpan.innerHTML = 'last update: ' + formatDate(dateList[i])
      const countSpan = document.querySelector(`span#${spanID[i]}Count`)
      countSpan.innerHTML = 'commit count: ' + commitList[i]
    }
  }

  function initSoupDiv() {
    const folder = 'chickenSoup/'
    const imgURL = ['de-small.jpg', 'mo-small.jpg', 'sea-small.jpg', 'sno-small.jpg', 'sta-small.jpg']
    const quotes = [
      '“Perfection has to do with the end product, but excellence has to do with the process.” – Jerry Moran',
      '“Excellence is a continuous process and not an accident.” – A. P. J. Abdul Kalam',
      '“We are what we repeatedly do. Excellence then is not an act, but a habit." – Will Durant',
      '“The road to excellence is always under construction.” – Anonymous',
      '“You’ve got to get up every morning with determination if you’re going to go to bed with satisfaction." – George Lorimer',
      '“Failure will never overtake me if my determination to succeed is strong enough.” – Og Mandino',
      '“A dream doesn’t become reality through magic; it takes sweat, determination and hard work.” – Colin Powell',
      '“Happiness is an attitude of mind, born of the simple determination to be happy under all outward circumstances.” – J. Donald Walters',
      '“You were designed for accomplishment, engineered for success, and endowed with the seeds of greatness.” – Zig Ziglar',
      '“Stick to your true north — build greatness for the long term.” – Ruth Porat',
      '“To achieve greatness one should live as if they will never die.” – Francois de La Rochefoucauld',
      '“Big dreams create the magic that stir men’s souls to greatness.” — Bill McCartney'
    ]

    const wrapper = document.querySelector('section#chickenSoup .chickenSoupFrame')
    const span = wrapper.querySelector('span#chickenSoupCation')
    const button = document.querySelector('button#refresh')

    let imgIndex = 0
    let quoteIndex = 0

    const randomIndex = (length, curr) => {
      let newIndex = Math.floor(length * Math.random())
      while (newIndex === curr) {
        newIndex = Math.floor(length * Math.random())
      }
      return newIndex
    }

    const action = () => {
      imgIndex = randomIndex(imgURL.length, imgIndex)
      quoteIndex = randomIndex(quotes.length, quoteIndex)
      wrapper.style = `background-image: url("${folder + imgURL[imgIndex]}");`
      span.innerHTML = quotes[quoteIndex]
    }
    button.removeEventListener('click', action)
    button.addEventListener('click', action)
  }

  function init() {
    initNav()
    initCanvasBackground()
    initProjectDiv()
    initSoupDiv()
  }

  let debounceTimeout
  window.addEventListener('resize', () => {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(init, 500)
  })
  init()
})()
