<h1 align="center">Welcome to Endeavor.</h1>
<p align="center">
  <img width="500" height="500" src="https://imgur.com/cootwFy.png">
</p> 
<p align="center">
  eLearn wrapper that makes tracking activities easier  
</p>


##  Why?

  

I got too lazy searching activities in eLearn and their due dates, so I decided to torture myself by writing this application that would do it for me. I spent **~48 hours** trying to debug the entire thing because *I* was stupid, and I ended up scrapping the entire app architecture I had planned because *it* was stupid, and start from scratch (again. For the 7th time.). It was by then I realized I should have spent the last 48-or-so-hours actually making my homework.

But hey, it works!
*I'm also going to eat my words once it doesn't actually work.*

##  How does it work?
It hooks into the Moodle REST API, which is what the Moodle app uses.

##  Since I have to put in my username and password, will I get hacked?

If you delve into the source code, you'll see that the only part that concerns your username and password is the login part. It doesn't do any scary stuff to it, or send it to a separate server for consumption.
