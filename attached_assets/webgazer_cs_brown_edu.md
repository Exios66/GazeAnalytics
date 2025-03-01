URL: https://webgazer.cs.brown.edu/
---
# WebGazer.js

## Democratizing Webcam Eye Tracking on the Browser

WebGazer.js is an eye tracking library that uses common webcams to infer the eye-gaze locations of web visitors on a page in real time. The eye tracking model it contains self-calibrates by watching web visitors interact with the web page and trains a mapping between the features of the eye and positions on the screen. WebGazer.js is written entirely in JavaScript and with only a few lines of code can be integrated in any website that wishes to better understand
their visitors and transform their user experience. WebGazer.js runs entirely in the client browser, so no video data needs to be sent to a server, and it requires the user's consent to access their webcam.


* * *

WebGazer.js: Scalable Webcam EyeTracking Using User Interactions - YouTube

Alexandra Papoutsaki

62 subscribers

[WebGazer.js: Scalable Webcam EyeTracking Using User Interactions](https://www.youtube.com/watch?v=NRLlRh2apA8)

Alexandra Papoutsaki

Search

Watch later

Share

Copy link

Info

Shopping

Tap to unmute

If playback doesn't begin shortly, try restarting your device.

More videos

## More videos

You're signed out

Videos you watch may be added to the TV's watch history and influence TV recommendations. To avoid this, cancel and sign in to YouTube on your computer.

CancelConfirm

Share

Include playlist

An error occurred while retrieving sharing information. Please try again later.

[Watch on](https://www.youtube.com/watch?v=NRLlRh2apA8&embeds_referring_euri=https%3A%2F%2Fwebgazer.cs.brown.edu%2F)

0:00

0:00 / 1:54•Live

•

[Watch on YouTube](https://www.youtube.com/watch?v=NRLlRh2apA8 "Watch on YouTube")

Real time gaze prediction on most common browsers

No special hardware; WebGazer.js uses your webcam

Self-calibration from clicks and cursor movements

Easy to integrate with a few lines of JavaScript

Swappable components for eye detection

Multiple gaze prediction models

Continually supported and open source for 6+ years

#### Want to be notified about updates?

[Subscribe](https://docs.google.com/forms/d/e/1FAIpQLSeTCgnwF1gjrc1O8mfJ_5TmT_TLowFQ2DUhsollmqPG84pAFQ/viewform?usp=pp_url&entry.1299571007=WebGazer:+self-calibrating+online+webcam+eye+tracking&entry.1760653896=webgazer+frontpage)

* * *

## Usage

To use WebGazer.js you need to add the webgazer.js file as a script in your website:


```html hljs xml
 /* WebGazer.js library */
<script src="webgazer.js" type="text/javascript" >
```

_Be aware that when you do local development and you might need to run locally a simple http server that supports the https protocol._

Once the script is included, the `webgazer` object is introduced into the global namespace. `webgazer` has methods for controlling the operation of WebGazer.js allowing us to start and stop it, add callbacks, or change out modules. The two most important methods on `webgazer` are `webgazer.begin()` and `webgazer.setGazeListener()`. `webgazer.begin()` starts the data collection that enables the predictions, so it's important to call this early on. Once `webgazer.begin()` has been called, WebGazer.js is ready to start giving predictions. `webgazer.setGazeListener()` is a convenient way to access these predictions. This method invokes a callback you provide every few milliseconds to provide the current gaze location of a user. If you don't need constant access to this data stream, you may alternatively call `webgazer.getCurrentPrediction()` which will give you a prediction at the moment when it is called.


```javascript hljs

webgazer.setGazeListener(function(data, elapsedTime) {
	if (data == null) {
		return;
	}
	var xprediction = data.x; //these x coordinates are relative to the viewport
	var yprediction = data.y; //these y coordinates are relative to the viewport
	console.log(elapsedTime); //elapsed time is based on time since begin was called
}).begin();

```

Here is the alternate method of getting predictions where you can request a gaze prediction as needed.

```javascript hljs

var prediction = webgazer.getCurrentPrediction();
if (prediction) {
	var x = prediction.x;
	var y = prediction.y;
}

```

### Advanced Usage

There are several features that WebGazer.js enables beyond the example shown so far.

#### Saving Data Between Sessions

WebGazer.js can save and restore the training data between browser sessions by storing data to the browser using [localforage](https://localforage.github.io/localForage/), which uses IndexedDB. This occurs automatically with every click in the window. If you want each user session to be independent make sure that you set `window.saveDataAcrossSessions` in `main.js` to `false`.

#### Changing in Use Regression and Tracker Modules

At the heart of WebGazer.js are the tracker and regression modules. The tracker module controls how eyes are detected and the regression module determines how the regression model is learned and how predictions are made based on the eye patches extracted from the tracker module. These modules can be swapped in and out at any time. We hope that this will make it easy to extend and adapt WebGazer.js and welcome any developers that want to contribute.

WebGazer.js requires the bounding box that includes the pixels from the webcam video feed that correspond to the detected eyes of the user. Currently we include one external library to detect the face and eyes.

```javascript hljs
webgazer.setTracker("TFFacemesh"); //set a tracker module
```

```javascript hljs
webgazer.addTrackerModule("newTracker", NewTrackerConstructor); //add a new tracker module
```

Currently, MediaPipe [Facemesh](https://github.com/tensorflow/tfjs-models/tree/master/facemesh) comes by default with WebGazer.js. Let us know if you want to introduce your own facial feature detection library.

```javascript hljs
webgazer.setRegression("ridge"); //set a regression module
```

```javascript hljs
webgazer.addRegressionModule("newReg", NewRegConstructor); //add a new regression module
```

Here are all the regression modules that come by default with WebGazer.js. Let us know if you would like introduce different modules - just keep in mind that they should be able to produce predictions very fast.

- ridge - a simple ridge regression model mapping pixels from the detected eyes to locations on the screen.
- weightedRidge - a weight ridge regression model with newest user interactions contributing more to the model.
- threadedRidge - a faster implementation of ridge regression that uses threads.

#### Pause and Resume

It may be necessary to pause the data collection and predictions of WebGazer.js for performance reasons.

```javascript hljs

webgazer.pause(); //WebGazer.js is now paused, no data will be collected and the gaze callback will not be executed
webgazer.resume(); //data collection resumes, gaze callback will be called again

```

#### Util and Params

We provide some useful functions and objects in `webgazer.util`. The webgazer.params object also contains some useful parameters to tweak to control video fidelity (trades off speed and accuracy) and sample rate for mouse movements.

```javascript hljs

webgazer.util.bound(prediction);
prediction.x; //now always in the bounds of the viewport
prediction.y; //now always in the bounds of the viewport

```

* * *

## Browser Compatibility

WebGazer.js uses:


- [getUserMedia/Stream API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) to get access to the webcam, which supports [these browsers](http://caniuse.com/#feat=stream).
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (used by [localforage](https://localforage.github.io/localForage/)) for storing data to the browser, which supports [these browsers](https://caniuse.com/#feat=indexeddb).

![Google Chrome](https://webgazer.cs.brown.edu/media/browser/chrome.svg)

#### Google Chrome

![Microsoft Edge](https://webgazer.cs.brown.edu/media/browser/edge.svg)

#### Microsoft Edge

![Mozilla Firefox](https://webgazer.cs.brown.edu/media/browser/firefox.svg)

#### Mozilla Firefox

![Opera](https://webgazer.cs.brown.edu/media/browser/opera.svg)

#### Opera

![Safari](https://webgazer.cs.brown.edu/media/browser/safari.svg)

#### Safari

* * *

## Download Options

#### Download

Download WebGazer.js

#### Dataset

A webcam video dataset comprising 51 participants for training and evaluating eye tracking models. Please see the [documentation and download link](https://webgazer.cs.brown.edu/data).


#### Build from source

The GitHub repository contains the [source code and version history](https://github.com/brownhci/WebGazer).

```bash hljs
# Ensure NodeJS is downloaded: https://nodejs.org/en/download/
git clone https://github.com/brownhci/WebGazer.git
cd WebGazer
#install the dependencies
npm install
#build the project
npm run build
```

* * *

## Examples

![Empty Webpage Demo](https://webgazer.cs.brown.edu/media/example/empty.png)

#### Calibration on Empty Page

See how easy it is to integrate WebGazer.js on any webpage. With just a few clicks you will get real-time predictions. Follow the popup instructions to click through 9 calibration points on the screen whilst looking at the cursor.


Try Live Demo

![Collision demo](https://webgazer.cs.brown.edu/media/example/collision.png)

#### Ball Collision Game

Move the orange ball with your eyes and create collisions with the blue balls. Train WebGazer.js by clicking in various locations within the screen, while looking at your cursor.


Try Live Demo

![SearchGazer](https://webgazer.cs.brown.edu/media/example/google_serp.png)

#### WebGazer on Search Engines (legacy)

We have created SearchGazer.js, a library that incorporates WebGazer in Search Engines such as Bing and Google. Note that this uses an older version of WebGazer, so is here just as a legacy demo.


Try SearchGazer.js

* * *

## Publications

_**Note:** The current iteration of WebGazer no longer corresponds with the WebGazer described in the following publications. The legacy version as described in the paper can be found in the [commit history](https://github.com/brownhci/WebGazer/tree/2a4a70cb49b2d568a09362e1b52fd3bd025cd38d) on GitHub._

[![pdf icon](https://webgazer.cs.brown.edu/media/pdf.svg)](https://jeffhuang.com/Final_WebGazer_IJCAI16.pdf)

If you use WebGazer.js please cite:

`
				@inproceedings{papoutsaki2016webgazer,
				  author     = {Alexandra Papoutsaki and Patsorn Sangkloy and James Laskey and Nediyana Daskalova and Jeff Huang and James Hays},
				  title      = {WebGazer: Scalable Webcam Eye Tracking Using User Interactions},
				  booktitle  = {Proceedings of the 25th International Joint Conference on Artificial Intelligence (IJCAI)},
				  pages      = {3839--3845},
				  year       = {2016},
				  organization={AAAI}
				}
			`

[![pdf icon](https://webgazer.cs.brown.edu/media/pdf.svg)](https://jeffhuang.com/Final_SearchGazer_CHIIR17.pdf)

If you use [SearchGazer.js](https://webgazer.cs.brown.edu/search) please cite the following paper:

`
				@inproceedings{papoutsaki2017searchgazer,
				  author = {Alexandra Papoutsaki and James Laskey and Jeff Huang},
				  title = {SearchGazer: Webcam Eye Tracking for Remote Studies of Web Search},
				  booktitle = {Proceedings of the ACM SIGIR Conference on Human Information Interaction \& Retrieval (CHIIR)},
				  year = {2017},
				  organization={ACM}
				}
			`

[![pdf icon](https://webgazer.cs.brown.edu/media/pdf.svg)](https://jeffhuang.com/Final_EyeTyper_ETRA18.pdf)

For the [WebGazer webcam dataset](https://webgazer.cs.brown.edu/data) and findings about gaze behavior during typing:

`
				@inproceedings{papoutsaki2018eye,
				  title={The eye of the typer: a benchmark and analysis of gaze behavior during typing},
				  author={Papoutsaki, Alexandra and Gokaslan, Aaron and Tompkin, James and He, Yuze and Huang, Jeff},
				  booktitle={Proceedings of the 2018 ACM Symposium on Eye Tracking Research \& Applications},
				  pages={16},
				  year={2018},
				  organization={ACM}
				}
			`

* * *

## Press

Websites that have featured WebGazer.js:

- [PCWorld](http://www.pcworld.com/article/3078712/application-development/web-developers-meet-webgazer-software-that-turns-webcams-into-eye-trackers.html)
- [News from Brown](https://news.brown.edu/articles/2016/06/eyetracker)
- [Softpedia](http://news.softpedia.com/news/webgazer-uses-javascript-and-your-webcam-to-track-eye-movements-505666.shtml)
- [TechXplore](https://techxplore.com/news/2016-06-software-webcams-eye-trackers.html)
- [The Register](http://www.theregister.co.uk/2016/06/02/brown_boffins_brew_eyetracking_javascript/)
- [I Programmer](http://www.i-programmer.info/news/146-uiux/9786-webgazerjs-an-in-browser-eye-tracking-library.html)
- [Z NEWS](http://zeenews.india.com/news/science/webgazer-js-turns-users-webcams-into-eye-trackers_1891045.html)
- [CIO](http://www.cio.com.au/article/601028/web-developers-meet-webgazer-software-turns-webcams-into-eye-trackers/), [(archive)](https://web.archive.org/web/20170505044746/http://www.cio.com.au/article/601028/web-developers-meet-webgazer-software-turns-webcams-into-eye-trackers)

Online discussions and shares in:

- [Hacker News](https://news.ycombinator.com/item?id=11770273), [repost](https://news.ycombinator.com/item?id=23859985)
- [Reddit /r/programming](https://www.reddit.com/r/programming/comments/4kyeww/webgazerjs_eye_tracking_library_using_the_webcam/)
- [Twitter](https://twitter.com/search?f=tweets&vertical=default&q=webgazer)
- [YouTube](https://www.youtube.com/results?search_query=webgazer)

* * *

## Who We Are

![Alexandra Papoutsaki](https://webgazer.cs.brown.edu/media/people/alexpap.jpg)

#### [Alexandra Papoutsaki](http://www.cs.pomona.edu/~apapoutsaki/)

![Aaron Gokaslan](https://webgazer.cs.brown.edu/media/people/aaron.jpg)

#### [Aaron Gokaslan](https://skylion007.github.io/)

![Ida De Smet](https://webgazer.cs.brown.edu/media/people/ida.jpg)

#### [Ida De Smet](https://www.linkedin.com/in/idakdesmet/)

![Xander Koo](https://webgazer.cs.brown.edu/media/people/xander.jpg)

#### [Xander Koo](https://www.linkedin.com/in/xanderkoo/)

![James Tompkin](https://webgazer.cs.brown.edu/media/people/james.jpg)

#### [James Tompkin](https://jamestompkin.com/)

![Jeff Huang](https://webgazer.cs.brown.edu/media/people/jeff.jpg)

#### [Jeff Huang](https://jeffhuang.com/)

### Other Contributors

- [Nediyana Daskalova](https://nediyana.github.io/)
- [James Hays](https://www.cc.gatech.edu/~hays/)
- Yuze He
- James Laskey
- [Patsorn Sangkloy](https://patsorn.me/)
- Elizabeth Stevenson
- [Preston Tunnell Wilson](https://cs.brown.edu/~ptunnell/)
- Jack Wong

Want to help? See these open issues tagged ["help wanted"](https://github.com/brownhci/WebGazer/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

### Acknowledgements

Webgazer is based on the research originally done at Brown University, with recent work and maintenance jointly between Pomona College and Brown University. The current maintainer is Jeff Huang.

The calibration example file was developed in the context of a course project with the aim to improve the feedback of WebGazer, proposed by Dr. Gerald Weber and his team Dr. Clemens Zeidler and Kai-Cheung Leung.

This research is supported by NSF grants IIS-1464061, IIS-1552663, a Seed Award from the Center for Vision Research at Brown University, and the Brown University Salomon Award.

* * *

## License

Copyright (C) 2016-2023 [Brown WebGazer Team](https://webgazer.cs.brown.edu/)

Licensed under [GPLv3](http://www.gnu.org/licenses/gpl-3.0.en.html). For other licensing options, please contact [webgazer@lists.cs.brown.edu](mailto:webgazer@lists.cs.brown.edu)