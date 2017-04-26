# JS优化
## 使用 `requestAnimationFrame` 来实现视觉变化
使用setTimeout或者setInterval来实现动画，回调将在帧中的某个时间点运行，容易丢失帧率。而`requestAnimationFrame`则是浏览器根据动画展示情况，自动计算该如何展现动画，实现正常的帧率。
## 降低复杂性或使用 Web Worker
如果一个算法不需要对DOM 进行操作，则完全可以将其放到webwork上进行计算，然后通过postmessage进行数据通信。优点是减少Javascript对线程的占用，缺点就是它不能直接对DOM进行操作。
如果您的工作必须在主线程上执行，请考虑一种批量方法，将大型任务分割为微任务，每个微任务所占时间不超过几毫秒，并且在每帧的 requestAnimationFrame 处理程序内运行。

```Javascript
// webwork
var dataSortWorker = new Worker("sort-worker.js");
dataSortWorker.postMesssage(dataToSort);

// The main thread is now free to continue working on other things...

dataSortWorker.addEventListener('message', function(evt) {
   var sortedData = evt.data;
   // Update data on screen...
});

// microTask
var taskList = breakBigTaskIntoMicroTasks(monsterTaskList);
requestAnimationFrame(processTaskList);

function processTaskList(taskStartTime) {
  var taskFinishTime;

  do {
    // Assume the next task is pushed onto a stack.
    var nextTask = taskList.pop();

    // Process nextTask.
    processTask(nextTask);

    // Go again if there’s enough time to do the next task.
    taskFinishTime = window.performance.now();
  } while (taskFinishTime - taskStartTime < 3);

  if (taskList.length > 0)
    requestAnimationFrame(processTaskList);

}

```
## 避免微优化 JavaScript

知道浏览器执行一个函数版本比另一个函数要快 100 倍可能会很酷，比如请求元素的offsetTop比计算getBoundingClientRect()要快，但是，您在每帧调用这类函数的次数几乎总是很少，因此，把重点放在 JavaScript 性能的这个方面通常是白费劲。您一般只能节省零点几毫秒的时间。
