import express from 'express'
import startBatchTask from '../src/batch/redis/startBatchTask.js'

const app = express()
const PORT = 4000

startBatchTask.issueView()
startBatchTask.postView()

// 1초 batch
startBatchTask.saveLike()

app.listen(PORT, () => {
  console.log(`
(\`-')                  _  (\`-')   _      <-. (\`-')_    (\`-').->  (\`-')  _    (\`-')        (\`-') (\`-')  _    (\`-')
( OO).->        .->    \\-.(OO )  (_)        \\( OO) )   ( OO)_    ( OO).-/ <-.(OO )       _(OO ) ( OO).-/ <-.(OO )
/    '._   (\`-')----.  _.'    \\  ,-(\`-') ,--./ ,--/   (_)--\\_)  (,------. ,------,) ,--.(_/,-.\\(,------. ,------,)
|'--...__) ( OO).-.  '(_...--''  | ( OO) |   \\ |  |   /    _ /   |  .---' |   /\`. ' \\   \\ / (_/ |  .---' |   /\`. '
\`--.  .--' ( _) | |  ||  |_.' |  |  |  ) |  . '|  |)  \\_..\`--.  (|  '--.  |  |_.' |  \\   /   / (|  '--.  |  |_.' |
   |  |     \\|  |)|  ||  .___.' (|  |_/  |  |\\    |   .-._)   \\  |  .--'  |  .   .' _ \\     /_) |  .--'  |  .   .'
   |  |      '  '-'  '|  |       |  |'-> |  | \\   |   \\       /  |  \`---. |  |\\  \\  \\-'\\   /    |  \`---. |  |\\  \\
   \`--'       \`-----' \`--'       \`--'    \`--'  \`--'    \`-----'   \`------' \`--' '--'     \`-'     \`------' \`--' '--'
`)
  console.log(`[SINGLE] Batch Server is runnign on port ${PORT}`)
})
