;(function () {
  'use strict'

  function initNav() {
    const nav = document.querySelector('nav#menu')
    const width = document.querySelector('section#top').clientWidth
    nav.style.width = width + 'px'
  }

  function initCanvasBackground() {
    const pixelSize = 5
    const width = document.querySelector('section#top').clientWidth / pixelSize
    const height = document.querySelector('section#top').clientHeight / pixelSize
    const widthIndex = width + 1
    const heightIndex = height * 2 + 1
    const pRate = 0.5
    const padding = 0

    function createGraph(random = true) {
      const array = []
      const func = random ? Math.random : () => 0
      for (let i = 0; i < heightIndex; i++) {
        const subArray = []
        for (let j = 0; j < widthIndex + (i % 2); j++) {
          subArray.push(func())
        }
        array.push(subArray)
      }
      return array
    }

    function colorizeGraph(graph, coloredGraph) {
      const a2s = arr => arr.toString()
      const s2a = str => str.split(',').map(k => parseInt(k))
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
    }

    // function drawMonoGraph(graph, ctx) {
    //   ctx.beginPath()
    //   for (let i = 0; i < heightIndex; i++) {
    //     for (let j = 0; j < widthIndex + (i % 2); j++) {
    //       if (graph[i][j] > pRate) {
    //         const baseX = j * pixelSize + padding
    //         const baseY = (i - (i % 2) - parseInt(i / 2)) * pixelSize + padding
    //         ctx.moveTo(baseX, baseY)
    //         i % 2 ? ctx.lineTo(baseX, baseY + pixelSize) : ctx.lineTo(baseX + pixelSize, baseY)
    //       }
    //     }
    //   }
    //   ctx.stroke()
    // }

    function drawColorGraph(coloredGraph, ctx) {
      const max = Math.max(...[...new Set(coloredGraph.flat())])
      for (let i = 0; i < heightIndex; i++) {
        for (let j = 0; j < widthIndex + (i % 2); j++) {
          if (coloredGraph[i][j] === 0) continue
          ctx.beginPath()
          ctx.strokeStyle = '#' + Math.floor(16777215 - ((coloredGraph[i][j] * 0.9) / max) * 16777215).toString(16)
          const baseX = j * pixelSize + padding
          const baseY = (i - (i % 2) - parseInt(i / 2)) * pixelSize + padding
          ctx.moveTo(baseX, baseY)
          i % 2 ? ctx.lineTo(baseX, baseY + pixelSize) : ctx.lineTo(baseX + pixelSize, baseY)
          ctx.stroke()
        }
      }
    }

    function initCanvas(canvas) {
      const ctx = canvas.getContext('2d')
      ctx.canvas.width = width * pixelSize + padding * 2
      ctx.canvas.height = height * pixelSize + padding * 2

      const graph = createGraph()
      const coloredGraph = createGraph(false)
      colorizeGraph(graph, coloredGraph)
      // drawMonoGraph(graph, ctx)
      drawColorGraph(coloredGraph, ctx)
    }

    const canvas1 = document.querySelector('canvas#background1')
    const canvas2 = document.querySelector('canvas#background2')
    const canvas3 = document.querySelector('canvas#background3')

    initCanvas(canvas1)

    clearInterval(canvasInterval)
    canvasInterval = setInterval(() => {
      const left = window.getComputedStyle(canvas1).left.slice(0, -2)
      const right = window.getComputedStyle(canvas3).left.slice(0, -2)
      if (left === '0') {
        initCanvas(canvas2)
        initCanvas(canvas3)
      }
      if (right === '0') {
        initCanvas(canvas1)
        initCanvas(canvas2)
      }
    }, 1000)
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
    const imgURL = ['de.jpg', 'mo.jpg', 'sea.jpg', 'sno.jpg', 'sta.jpg']
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

    const img = document.querySelector('img#chickenSoupImg')
    const wrapper = document.querySelector('section#chickenSoup .wrapper')
    const button = document.querySelector('button#refresh')
    wrapper.width = img.clientWidth + 'px'
    wrapper.height = img.clientHeight + 'px'
    wrapper.style = `left: ${(0.5 - img.clientWidth / window.clientWidth / 2) * 100}%;`
  }

  function init() {
    initNav()
    initCanvasBackground()
    initProjectDiv()
    initSoupDiv()
    // initDivTransition()
  }

  let canvasInterval

  init()
  window.addEventListener('resize', init)
})()
